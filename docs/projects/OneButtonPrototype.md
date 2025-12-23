---
layout: doc
---
<script setup lang="ts">
import { OneButtonPrototypeSlides } from '../.vitepress/theme/data/projectSlides'
</script>

<ProjectHero
  title="Contextual Input Platformer"
  role="Solo Programmer"
  tools="C#,Unity , Visual Studio 2022"
/>

## Overview
::: tip Context
This project was a solo developed university assigment in which we were tasked within 3 weeks to make a series of different mechanics only using one action button other than the WASD keys 
:::
<ProjectSlideshow :slides="OneButtonPrototypeSlides" />
<div class="project-overview">

The core loop is simple: **move through short platforming sections**, use Space to chain traversal options (double jump → swing → wall hold/jump), and clear basic enemies by **stomping them from above** (Mario-style). The goal was to keep the game readable: one key, but clear rules and predictable behaviour.

Mechanics included:
- **Double jump** for mid-air correction and gap coverage
- **Swinging** when close enough to a swing point (Space acts as “grab rope”)
- **Wall hold / wall jump** to recover from bad jumps and climb tight areas
- **Basic enemies** that patrol left/right and can be defeated only by landing on top
</div>

## Highlights

<CollapseSection sectionId = "SpacebarRules"title="One-Button Design (Spacebar Rules)" icon="▸">

This prototype was built around a strict constraint: **only one extra key (Spacebar)** could drive multiple mechanics. To make that work, Space is treated as a **context-sensitive action**.

- **If near a swing point:** & Space is held then rope form point to player created.
- **if touching a wall:** Space supports **wall hold / wall jump off** (recovery + climbing).
- **if on ground or air or wall** normal one tap or double tap on space will perform a normal or double jump
The goal was to keep it readable: *one input*, but the player can still predict what will happen based on their current state and position.
</CollapseSection>

<CollapseSection sectionId = "PlayerToolkit"title="Traversal Toolkit (Double Jump / Swing / Wall Jump)" icon="↕">

This project is essentially a small **movement playground** where the player chains traversal tools to progress:

- **Double jump** helps with gap coverage and correcting mistakes mid-air.
- **Swing points** add momentum-based traversal and route variety.
- **Wall hold / wall jump** supports tight sections and prevents cheap falls.

**Media suggestion:** keep this dropdown visual — 2–3 short gifs max:
1) Double jump correction  
2) Swing attach + release  
3) Wall jump recovery
</CollapseSection>


## General

<CollapseSection sectionId = "EnemyStomp"title="Enemy Prototype (Stomp Kill + Simple Patrol AI)" icon="✚">

- Enemies are intentionally simple: they **patrol left/right**, and the player can only defeat them by **jumping on top** (Mario-style).
- **enemy senses via tag and normal detection**.   

- Keeps combat readable and lets the prototype stay focused on the movement constraint rather than complex fighting systems.

**Media suggestion:** 1 short gif showing a stomp kill + enemy patrol loop.
</CollapseSection>

## External Assets Used
<CollapseSection title="External Assets" icon="✎">

- City & Sky background: https://free-game-assets.itch.io/free-city-backgrounds-pixel-art

</CollapseSection>

