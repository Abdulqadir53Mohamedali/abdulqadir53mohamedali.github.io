---
layout: doc
---

<script setup lang="ts">
import { TankGameSlides,TankGameDropdownBossSlides  } from '../.vitepress/theme/data/projectSlides'
</script>


<ProjectHero
  title="Tank Combat Encounters"
  role="Solo Programmer"
  tools="Unreal Engine 5.4 • Unreal Blueprints • Visual Studio 2022"
/>

## Overview
::: tip Context
This Unreal Engine 5.4 prototype is a combat sandbox + boss encounter level built on a provided framework. My focus was expanding gameplay variety through **weapon pickups**, **enemy behaviour types**, and **readable combat feedback** — all implemented in **Blueprints**.
:::

<ProjectSlideshow :slides="TankGameSlides" />


The level is split into **separate sections** that introduce new hazards, enemies (standard → commanders → bosses), and new weapon pick-ups, with difficulty ramping as you progress.

### Enemy encounter design (mixed threat roles)
<div class="project-overview">

Encounters are built by combining different enemy roles so the player is pressured in multiple ways:
- **Chasing shooters** and **homing projectile enemies** to force constant repositioning  
- **Summoners** that spawn mini-tanks which rush and explode on impact  
- **Aura-damage enemies** that punish staying too close  
- **Turrets** and **multi-turret commander/boss variants** that layer projectile patterns  

### Environment hazards + interactables
The environment supports the combat loop and encourages movement/risk-reward:
- **Exploding barrels** with **radial damage** that can chain-react  
- **Lava zones** for continuous hazard pressure  
- **Levitation barrel jump boost** that spawns a circular VFX field when destroyed (reposition / progress)  
- **Health pickups** and **speed boost orbs**  

Everything was built in **Blueprints**, with readability supported through **impact VFX**, **hit flashes / warning feedback**, and arena-style encounters designed for quick iteration and clear video demonstration.
</div>


## Highlights

<CollapseSection sectionId = "Weapons" title="Weapon Pickups + Firing Feel (4 weapon types)" icon="✹">

The player can swap between multiple pickup weapons, each built to feel distinct in pacing and feedback:
- **Standard fire** (baseline consistent weapon)
- **Sniper-style** (longer cooldown, fast travel)
- **Heavy cannon** (slow, high impact)
- **Fast-firing weapon** (high rate of fire + camera shake)

**What I focused on:** making each weapon change how the player approaches fights (timing, spacing, target priority), not just raw damage.

<ProjectMedia
  type="image"
  src="/Images/TankGame/ALlWeaponsInherit.png"
  caption="All Weapon pickups Inheriently use this event upon overlap"
/>
<ProjectMedia
  type="image"
  src="/Images/TankGame/PlayerBP.png"
  caption="Based on the weapon pickups Name and Mesh the corresponding visual and mechanical changes occur"
/>

</CollapseSection>

<CollapseSection title="Enemy Variety + Threat Roles" icon="⚔">

Enemy variety is using a mix of any two or more mentioned below
- **Chasers / shooters:** keep the player moving
- **Homing enemies:** punish predictable strafing and force route changes
- **Summoners:** create bursts of chaos by spawning mini tanks that rush + explode
- **Aura enemies:** deny safe positions and punish close-range drifting

<ProjectMedia
  type="video"
  src="/Videos/TankGame/SummonerTank.mp4"
  caption="Summoner with Aura"
/>

- **Turrets:** add sustained area pressure and create crossfire


**Summoned Explosive Tanks Blueprint:**
<ProjectMedia
  type="image"
  src="/Images/TankGame/EXTSM1.png"
  caption="Upon player overlapping within the summoned areas the AiSpawn Event is called | Hover to Zoom in"
/>

<ProjectMedia
  type="image"
  src="/Images/TankGame/EXTSM2.png"
  caption="On AiSpawn being called the corresponding explosivie tanks are spawned at the location of spawn area center point  | Hover to Zoom in"
/>

</CollapseSection>

<CollapseSection sectionId= "Boss&Command"title="Boss + Commander Design" icon="♛">

<!-- Progression is built around **commander minibosses** that teach patterns, leading into a **final boss** that combines multiple threats: -->
- Multi-turret firing patterns (layered projectiles)
- Homing pressure + standard shots at the same time
- Some variants add aura damage and/or summoning

<ProjectMedia
  type="video"
  src="/Videos/TankGame/EnemyCommanders.mp4"
  caption="Commander Tank Area | Aura | Homing Projectiles | Stationary Tanks"
/>

**Why it works:** bosses & commanders feel harder because they combine mechanics, not just because they have more health.

<ProjectSlideshow :slides="TankGameDropdownBossSlides" />

</CollapseSection>

---

## General

<CollapseSection sectionId = "Enviroment&Interactables"title="Environment Interactables + Hazards" icon="▣">

The level includes hazards and interactables that support the combat loop:
- **Explosive barrels:** radial damage + chain reactions  
- **Lava:** constant hazard pressure  
- **Levitation barrel:** destroys into a VFX boost field to reposition / reach new areas  
<ProjectMedia
  type="video"
  src="/Videos/TankGame/LevitationTank.mp4"
  caption="Levitation / Jumpad Barrel"
/>

- **Pickups:** health + speed orbs to reward riskier routing  

<ProjectMedia
  type="image"
  src="/Images/TankGame/DamageBarrel.png"
  caption="Explosive AOE damage Barrel logic"
/>

</CollapseSection>

<CollapseSection title="Combat Feedback + VFX Readability" icon="✧">

Readability was reinforced through fast, clear feedback:
- Projectile **impact VFX** across weapons
- Enemy **hit flash / warning feedback** to make damage states obvious
- Camera shake used selectively (fast-firing weapon) to sell intensity

</CollapseSection>

<CollapseSection title="Level Structure + Testing Arena Workflow" icon="▵">

The project is split into:
- A **testing arena** to quickly validate weapons, enemies, and hazards  
- A **progression run** that ramps difficulty through commanders → final boss  

This structure made iteration faster and produced clean, demo-friendly gameplay footage.

</CollapseSection>
