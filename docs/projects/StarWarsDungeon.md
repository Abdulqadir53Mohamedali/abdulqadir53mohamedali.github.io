---
layout: doc
---
<script setup lang="ts">
import { StarWarsDungeonSlides,StarWarsDungeonProceduralSlides,StarWarsDungeonEnemyCombatSlides,StarWarsDungeonShopSlides } from '../.vitepress/theme/data/projectSlides'
</script>


<ProjectHero
  title="Procedural Star Wars Text Based Dungeon"
  role="Solo Programmer"
  tools="C++, Visual Studio 2022"
/>

## Overview
::: tip Context
This project was a solo developed uiversity assigment , in which we were given 8 weeks to develop a text based game in pure C++, it was encouraged to go above & beyond what was taught in lesson.
:::

<ProjectSlideshow :slides="StarWarsDungeonSlides" />

<div class="project-overview">

<!-- This solo project is a **pure C++ Star Wars-inspired text dungeon crawler** built around a simple but replayable loop: navigate a dot-grid facility, trigger **random enemy encounters**, survive **randomised combat waves**, and spend coins in a **shop + inventory system** to improve your loadout. -->

The core focus for me was writing a complete game-style system in modern C++ using clean structure and safe memory management — including **polymorphic item systems**, enemy inheritance, wave generation, and strong input validation so the game never breaks on bad user input.

Key features:
- **Grid-based dungeon navigation** (visual dot-grid with player + goal)
- **Random enemy positions** (unique placements, never overlapping each other or key tiles)
- **Wave combat** (enemy types are randomised each encounter, so no wave feels identical)
- **Coins + Shop + Inventory** (weapons + power-ups with slot limits and refunds)
- **Robust verification checks** (trim/validate input, enforce inventory rules, prevent invalid 
states)
- **Replayable Loop**: navigate grid -> random enemy encounters -> survive randomised combat waves -> spend coins in a shop + inventory system -> continues until goal/exit is reached 
</div>


## Highlights

<CollapseSection sectionId= "DungeonGrid" title="Procedural Dungeon Grid + Encounters" icon="▦">

- The dungeon is a **12×12 dot grid** (`config::GRID_SIZE`) rendered in console (`displayGrid()`), with:
  - `P` = player start  
  - `G` = goal tile  
  - `.` | 'E' = empty space | enemy also hidden 
  <ProjectSlideshow :slides="StarWarsDungeonProceduralSlides" />
 
- Enemy encounter positions are generated using a `std::set<Position>` so positions are **unique by default**.
- Spawns avoid key tiles (player start + goal), preventing unfair/buggy setups:
  - `(0,0)` and `(GRID_SIZE-1, GRID_SIZE-1)` are excluded.
<CodeCollapseSection title="Code Snippet - Unique enemy spawns (std::set + excluded tiles)" icon="⌘">

```cpp
// Grid.cpp (trimmed)
// Goal: generate unique enemy positions and avoid unfair spawns (start + goal)

std::set<Position> generateEnemyPositions(int count) {
    std::set<Position> enemyPositions;
    std::srand(static_cast<unsigned>(std::time(nullptr))); // different per run

    while (enemyPositions.size() < count) {
        int x = std::rand() % config::GRID_SIZE;
        int y = std::rand() % config::GRID_SIZE;

        // Avoid key tiles
        if ((x == 0 && y == 0) || (x == config::GRID_SIZE - 1 && y == config::GRID_SIZE - 1))
        {
          continue;
        }

        enemyPositions.insert({ x, y }); // std::set enforces uniqueness
    }

    return enemyPositions;
}
```
</CodeCollapseSection>

- Movement uses `_getch()` so navigation is responsive (no “press enter” needed).

This creates a simple but replayable overworld: the player explores, hits random encounters, and pushes toward the exit.
</CollapseSection>

<CollapseSection sectionId = "WaveSystem"title="Wave Combat System (Turn-Based + Randomised Enemies)" icon="♺">

- Encounters trigger combat via the grid: stepping onto an enemy tile calls `combatWave(player, wave)`.
- Waves are created with `generateEnemyWave(5)` and enemies are **randomly selected**, meaning you rarely fight the same composition twice.
- Combat is clean turn-based:
  - Player chooses an inventory item (weapon / power-up)
  - Enemies take their turn one-by-one
  - Defeated enemies are removed using `erase(remove_if(...))`
<CodeCollapseSection title="Code Snippet - Turn loop + remove defeated enemies + wave rewards" icon="⌘">

```cpp
// Combat.cpp (trimmed)
// Goal: clean turn loop, remove dead enemies, reward coins if player survives

while (!enemies.empty() && player.getHealth() > 0) {
    player.combat(enemies, player);

    enemies.erase(
        std::remove_if(enemies.begin(), enemies.end(), isEnemyDefeated),
        enemies.end()
    );

    for (auto& e : enemies) {
        int damage = e->combat();
        player.takeDamage(damage);
        if (player.getHealth() <= 0) 
        {
          break;
        }
    }
}

if (player.getHealth() > 0) {
    player.addCoins(totalEnemyCoins(enemies));
    player.resetDamageBoost(); // buffs are wave-limited for fairness
}
```
</CodeCollapseSection>

- Coins are calculated per wave (`totalEnemyCoins`) and awarded only if the player survives, then buffs reset for fairness (`resetDamageBoost()`).
  <ProjectSlideshow :slides="StarWarsDungeonEnemyCombatSlides" />


It’s a strong “game loop” showcase: encounter → combat → reward → prepare for next wave.
</CollapseSection>

<CollapseSection sectionId = "ShopInventory"title="Shop + Inventory (Polymorphism + Smart Pointers)" icon="₵">

- Inventory is stored as `std::map<int, std::unique_ptr<Item>>`, so items are owned safely and cleaned up automatically.
- The shop uses a **factory approach**: each `ShopItem` stores a `std::function<std::unique_ptr<Item>()>` so buying an item creates the correct derived type at runtime.
<CodeCollapseSection title="Code Snippet - Shop factory (std::function → std::unique_ptr<Item>)" icon="⌘">

```cpp
// Shop.cpp (trimmed)
// Goal: each shop entry knows how to construct the correct derived Item type

std::map<int, ShopItem> shop = {
  {1, {25, "DL-44", "Min dmg: 20 | Max dmg: 50",
      [](){ return std::make_unique<DL44>(); }}},

  {5, {12, "Health Pack", "+300 health",
      [](){ return std::make_unique<PowerUps>("Health Pack", healthPack); }}}
};
```
</CodeCollapseSection> 

- Items are polymorphic:
  - `Weapon : Item` (ammo, mags, reload logic, used flag)
  - `PowerUps : Item` (stores an action via `std::function<void(Player&)>`)
- Restrictions prevent broken loadouts:
  - Max **2 weapons** + max **2 power-ups**
  - You can’t leave the shop without **at least one weapon**
- Refund rules are handled (weapons marked as “used” can’t be refunded).
    <ProjectSlideshow :slides="StarWarsDungeonShopSlides" />


</CollapseSection>


## General
<CollapseSection title="Weapons + Ammo / Reload Rules" icon="✹">

- Weapons track `damage`, `currentAmmo`, `ammoCapacity`, and `mags`.
- Reloading happens automatically when ammo hits zero (if mags remain).
- If ammo + mags are empty, some weapons fall back to a **melee hit** (small guaranteed damage), so combat never hard-locks.
- Some weapons apply **wave splash damage** logic (total damage divided across enemies).

</CollapseSection>

<CollapseSection title="Error Handling & Input Validation" icon="⌯⌲">

- Input is validated using helper functions:
  - whitespace trimming (`trimWhiteSpace`)
  - numeric checks (`isInputInteger`)
  - readable error output (`errorMessage`)
- Menus enforce valid ranges (e.g., start menu only accepts 1–2).
- Inventory decisions enforce safe states (can’t return to game with no weapon).

This kept the project stable — no crashing or broken states from bad input.
<CodeCollapseSection title="Code Snippet — Input cleaning + numeric validation (prevents broken states)" icon="⌘">

```cpp
// GeneralErrorHandaling.cpp (trimmed)
// Goal: stop bad input from crashing menus / inventory logic

bool isInputInteger(string userInput) {
    if (userInput.empty())
    {
      return false;
    }

    for (char c : userInput)
        if (!std::isdigit(c)) 
        {
          return false;
        }

    return true;
}

string trimWhiteSpace(string& userInput) {
    string result = userInput;
    result.erase(std::remove_if(result.begin(), result.end(), ::isspace), result.end());
    return result;
}
```
</CodeCollapseSection>

</CollapseSection>
