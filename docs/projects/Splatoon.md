---
layout: doc
---

<script setup lang="ts">
import { splatoonSlides } from '../.vitepress/theme/data/projectSlides'
</script>

<ProjectHero
  title="2D Movement , Juice & Feel"
  role="Solo Programmer | VFX | Lighting"
  tools="C#,Unity , Visual Studio 2022"
/>

## Overview
::: tip Context
This project was a solo-developed university assignment focused on **game juice & feel**. It builds on my Assessment 1 prototype (forgiveness mechanics), and this version’s goal was to add **new mechanics** and significantly improve **feedback** through particles, lighting, and audio.
:::
<ProjectSlideshow :slides="splatoonSlides" />
This is Assesment 2. Assessment 1 was primarily about making movement feel fair and responsive (forgiveness mechanics). For this version, I kept that foundation and focused on what makes actions feel satisfying and readable: **strong visual/audio feedback**, smoother transitions between states, and mechanics that create distinct “moments” for the player.

This project features a series of systems:

<div class="project-overview">

- **Forgiveness mechanics carried over (Assessment 1 foundation):** variable jump height, coyote time, jump buffering, sticky feet on land, and speedy apex .
- **Splatoon-inspired traversal mechanics:** a squid form that can traverse both ground and walls to open up movement routes and pace changes.
- **8-direction dash system:** responsive directional movement with clear feedback and timing (supports faster traversal and repositioning, available in squid made as well).
- **Afterimage / trail effects using object pooling:** adds impact to fast movement while staying performance-friendly.
- **Particle effects & lighting polish:** gameplay states are reinforced with VFX and scene feedback to improve clarity and “juice”.
- **Audio feedback layer:** All Actions such as walking ,  shooting , squid mode , jumping ( Push off & Land) , dashing and others such as checkpoint enter , destructable object damage.
- **Ink-style ability (prototype):** currently limited in gameplay impact beyond interacting with a specific object type, but acts as a base for expanding paint-driven mechanics later.
</div>

## Highlights

<CollapseSection sectionId="Mechanics-AD" title="Mechanics (Squid | Paint Spray / Shooting | Dash)" icon="▣">
 
### What I added (beyond base movement / jump)
The project focus was on **game feel + readability** , so the mechnaics /  systems I needed to implement needed to be:
- **Reactive** (events drive UI + feedback)
- **Rule-driven** (shooting/dashing obey state restrictions)
- **Animation/VFX synced** (effects triggered from the same gameplay state changes)

---
#### Shooting/Spraying (Energy-gated firing)
To prevent infinittly firing , I made it so spraying / shooting consumes **shooting energy** & Follwed 3 main rules:
- No Shooting while airborne , in squid mode or when energy is depleted 
- drains while shooting, regenerates when not shooting  
- broadcasts `OnShootingEnergyChanged` every update for UI  
- broadcasts `OnShootingEnergyDepleted` when it hits zero (to force stop / feedback)
<CodeCollapseSection title="Shooting Energy drain / regen (snippet)" icon="⌘">

```csharp
// ShootingEnergyController::FixedUpdate (trimmed)
// - drains while shooting
// - regens while not shooting
// - broadcasts % to UI without hard-coupling to a specific UI script
if (m_IsShooting)
{
    m_CurrentEnergy -= energyDrainRate * Time.fixedDeltaTime;
    m_CurrentEnergy = Mathf.Max(m_CurrentEnergy, 0f);

    OnShootingEnergyChanged?.Invoke(ShootingEnergyPercent);

    if (m_CurrentEnergy <= 0f)
    {
      OnShootingEnergyDepleted?.Invoke();
    }
}
else if (m_CurrentEnergy < maxShootingEnergy)
{
    m_CurrentEnergy += energyRegenRate * Time.fixedDeltaTime;
    m_CurrentEnergy = Mathf.Min(m_CurrentEnergy, maxShootingEnergy);

    OnShootingEnergyChanged?.Invoke(ShootingEnergyPercent);
}
```

```csharp
// CharacterMovement::SetShooting (trimmed)
// - prevents invalid states (air / squid)
// - triggers animation + forwards state to the gun controller
if (m_IsShooting == isShooting)
{
  return; 
}

if (isShooting && !m_IsGrounded)
{
  return;  
}
if (isShooting && m_SquidController != null && m_SquidController.IsSquid)
{
  return;
} 

m_IsShooting = isShooting;

if (m_IsShooting)
{
  m_AnimatorController?.TriggerShoot();
}

m_GunController?.SetShooting(isShooting);

```
</CodeCollapseSection>

---

### Squid mode ( Increased speed & wall traversal ability | Energy Limtied)
Squid Mode is a distinct traversal state, not just an energy bar:

- Entering is only allowed if the player is grounded OR near a wall (`IsNearWall()` uses raycasts).

- While active, movement is driven by a coroutine loop (`SquidSwimRoutine`) that:
  - drains energy,
  - applies swim velocity when valid,
  - otherwise falls (gravity-like behaviour).
- It triggers UI offset events so dash/afterimage visuals align with the lower squid body.

<CodeCollapseSection title="Squid Mode: gated entry + coroutine-driven movement" icon="⌘">

```csharp
// SquidController.EnterSquidMode (trimmed)
if (!m_IsInitialized || m_IsSquid || m_SquidEnergy <= 0) 
{
  return;
}

// Only allow entry if grounded OR near a wall (surface rule)
bool isGrounded = m_CharacterMovement.IsGrounded;
bool isNearWall = IsNearWall();
if (!isGrounded && !isNearWall)
{
  return;
}

m_IsSquid = true;

// Pick initial swim direction based on input / context
m_CurrentSwimDirection = (initialDirection.magnitude > 0.1f)
    ? initialDirection.normalized
    : (isGrounded ? Vector2.zero : Vector2.down);

// Visual + UI hooks (keeps this system decoupled from UI)
OnSquidModeChanged?.Invoke(true);
OnSquidAfterimageOffsetRequested?.Invoke(m_SquidAfterimageYOffset);
OnSquidDashOffsetRequested?.Invoke(m_SquidAfterimageYOffset);

StartCoroutine(SquidSwimRoutine());

```
```csharp
// SquidController.SquidSwimRoutine (trimmed)
while (m_IsSquid)
{
    // Energy drain while swimming
    m_SquidEnergy -= squidDrainRate * Time.fixedDeltaTime;

    if (m_SquidEnergy <= 0f)
    {
        m_SquidEnergy = 0f;
        ExitSquidMode();     // forces clean exit when depleted
        yield break;
    }

    // Only move like a squid if grounded OR near wall
    if (CanSwimInCurrentDirection())
    {
         m_RB.linearVelocity = m_CurrentSwimDirection * squidSpeed;
    }
     
    else
    {
      m_RB.linearVelocity = new Vector2(0, m_RB.linearVelocity.y - 9.81f * Time.fixedDeltaTime);
    }

    yield return new WaitForFixedUpdate();
}
```
</CodeCollapseSection>

--- 
- Dash & Afterimage ( 8-driectional) (Explained further in Dash + Afterimage System (pooled))

<!-- Paste your final version here -->
</CollapseSection>

<CollapseSection sectionId="VFX-Lighting" title="VFX + Lighting Readability" icon="✦">

**Destructible wall feedback (impact + state)**
- I used impact VFX to communicate “this surface is interactable / taking hits” and a stronger final response when it breaks.
- This prevents the player from thinking the wall is decorative when they’re repeatedly hitting it.

<ProjectMedia
  type="video"
  src="/Videos/Splatoon/Dropdowns/SplatoonDestructableWall.mp4"
  :autoplayInView="true"
  caption=""
/>

**Checkpoint / respawn readability**
- Checkpoints are deliberately bright and readable so the player can instantly identify safety + progress points.


**Dash readability**
- The dash trail is angled to spray **opposite the dash direction**, so the player instantly reads momentum and direction even in fast movement.
- I rotate the particle system at runtime (using the dash direction), so I didn’t need 8 separate VFX variants for every direction.
- The trail height is adjusted dynamically between normal + squid mode so it stays visually aligned with the character silhouette.

<ProjectMedia
  type="image"
  src="/Images/Splatoon/DashStart.png"
  :autoplayInView="true"
  caption=""
/>

**Shooting readability**
- Shooting is treated as a “feedback stack”: the spray has enough density and timing to show that firing is active, while the sound loop reinforces it.
- Energy drain/regeneration means the player needs clear feedback that they can still shoot — so I keep the visuals consistent and avoid subtle effects that are easy to miss.

<ProjectMedia
  type="image"
  src="/Images/Splatoon/Shooting.png"
  :autoplayInView="true"
  caption=""
/>

**Squid traversal readability**
- Squid mode uses continuous particle feedback to show “I’m swimming / clinging” rather than relying only on animation.
- Particle direction changes based on swim direction (horizontal vs vertical on walls), helping the player read whether they are grounded, wall-attached, or losing contact.

<ProjectMedia
  type="image"
  src="/Images/Splatoon/SquidGround.png"
  :autoplayInView="true"
  caption=""
/>
<ProjectMedia
  type="image"
  src="/Images/Splatoon/SquidWall.png"
  :autoplayInView="true"
  caption=""
/>





<!-- Paste your final version here -->
</CollapseSection>

<CollapseSection sectionId="Dash-AfterImage" title="Dash + Afterimage System (pooled)" icon="⇢">

### Dash readability (without performance spikes)
The dash needs to feel fast *and* readable, so I used an **afterimage trail**.

**Dash rules**
- Dashing supports **8-direction input**.
- If there’s no input, dash defaults to the character’s facing direction (left/right), so it still feels reliable.
<!-- - Dash is time-based (duration) with a cooldown timer so it can be tuned for pacing. -->

<ProjectMedia
  type="video"
  src="/Videos/Splatoon/Slideshow/DashProper.mp4"
  :autoplayInView="true"
  caption=""
/>

**Why the afterimage is pooled**
The afterimages are spawned frequently (every ~0.05s) while dashing. If I instantiated/destroyed objects each dash, it would create unnecessary GC and performance spikes.  

I use a small **queue-based pool** (pre-created objects) and reuse them:

- Dequeue → configure sprite + position → fade → disable → enqueue back into the pool.
- This keeps the effect consistent even when dashing repeatedly.

**Key implementation details**
- Afterimages copy the **current sprite + flipX** from the animator controller, so the trail matches the current animation frame.
- Offsets are adjusted depending on squid mode (events request new Y offsets), keeping the trail aligned even when the player’s silhouette changes.

<CodeCollapseSection title="Code Snippet — 8-direction dash + pooled afterimages" icon="⌘">

```csharp
// DashController.cs (trimmed)
public void TryStartDash(Vector2 inputDirection)
{
    if (!m_IsInitialized || m_IsDashing || m_DashCooldownRemaining > 0)
    {
      return
    }

    // 8-direction input, fallback to facing direction
    m_DashDirection = (inputDirection.magnitude < 0.1f)
        ? (m_AnimatorController.IsFacingRight() ? Vector2.right : Vector2.left)
        : inputDirection.normalized;

    StartCoroutine(DashRoutine());
}

private IEnumerator DashRoutine()
{
    m_IsDashing = true;
    m_DashCooldownRemaining = m_DashCooldown;

    m_AfterimageEffect?.StartAfterimages(); // pooled trail begins

    float elapsed = 0f;
    while (elapsed < m_DashDuration && m_IsDashing)
    {
        m_RB.linearVelocity = m_DashDirection * m_DashSpeed;
        elapsed += Time.fixedDeltaTime;
        yield return new WaitForFixedUpdate();
    }

    m_AfterimageEffect?.StopAfterimages();  // pooled trail stops
    m_IsDashing = false;
}

```
```csharp
// AfterimageEffect.cs (trimmed pool usage)
private void SpawnAfterimage()
{
    if (m_AfterimagePool.Count == 0)
    {
      return
    }

    GameObject img = m_AfterimagePool.Dequeue();
    SetupAfterimage(img);          // copies sprite + flipX, applies offsets
    StartCoroutine(FadeAndReturn(img)); // disables + re-enqueues
}
```
</CodeCollapseSection>
<ProjectMedia
  type="video"
  src="/Videos/Splatoon/Dropdowns/AfterImagePooling.mp4"
  :autoplayInView="true"
  caption=""
/>

</CollapseSection>

<CollapseSection sectionId="Audio" title="Audio" icon="♪">

### Squid
<ProjectMedia
  type="video"
  src="/Videos/Splatoon/Slideshow/SquidWallClimb.mp4"
  :autoplayInView="true"
  caption=""
/>

### Dash

<ProjectMedia
  type="video"
  src="/Videos/Splatoon/Slideshow/DashProper.mp4"
  :autoplayInView="true"
  caption=""
/>


### Shooting
<ProjectMedia
  type="video"
  src="/Videos/Splatoon/Slideshow/SplatoonShootingR.mp4"
  :autoplayInView="true"
  caption=""
/>


### Checkpoint Enter

<ProjectMedia
  type="video"
  src="/Videos/Splatoon/Slideshow/CheckpointInteractSound.mp4"
  :autoplayInView="true"
  caption=""
/>

### Jump | take-off & land
<ProjectMedia
  type="video"
  src="/Videos/Splatoon/Dropdowns/SplatoonJumpActual.mp4"
  :autoplayInView="true"
  caption=""
/>


### Walk
<ProjectMedia
  type="video"
  src="/Videos/Splatoon/Dropdowns/SplatoonActualWalk.mp4"
  :autoplayInView="true"
  caption=""
/>

<!-- Paste your final version here -->
</CollapseSection>

## General

<CollapseSection sectionId="UI" title="UI Toolkit" icon="♪">

- UI created 100% through UIE.elements in code 
- connected with UI Document in hierarchy
- connected to energy & healh events  

<ProjectMedia
  type="video"
  src="/Videos/Splatoon/Dropdowns/UIToolkit.mp4"
  :autoplayInView="true"
  caption=""
/>

<ProjectMedia
  type="image"
  src="/Images/Splatoon/PlayerUI.png"
  :autoplayInView="true"
  caption=""
/>
<!-- Paste your final version here -->
</CollapseSection>

## External Assets Used
<CollapseSection title="External Assets" icon="✎">

- Character Sprite Sheet: https://www.deviantart.com/friendalias/art/Inkling-Girl-Mini-Sprite-Sheet-740153891
- Sounds: https://sounds.spriters-resource.com/wii_u/splatoon/
- City & Sky background: https://free-game-assets.itch.io/free-city-backgrounds-pixel-art

</CollapseSection>

## What I learned
This project helped me understand that “game feel” is not one feature — it’s a **stack of small systems working together**:

- **Feedback layering matters**: the same mechanic feels completely different once it has clear VFX timing, sound cues, and readable lighting.
- **Responsiveness > complexity**: small forgiveness / movement tweaks and consistent feedback made more difference than adding lots of new mechanics.
- **Pooling isn’t just optimisation — it protects feel**: pooling the dash afterimages meant the effect stayed smooth and consistent during repeated dashes instead of risking spikes from instantiate/destroy.
- **Events are great for decoupling**: using events (e.g., squid mode changing offsets / UI energy updates) kept systems modular instead of hard-wiring references everywhere.
- **Iteration workflow**: exposing values (energy drain/regen, dash duration/cooldown, audio pitch/volume) made playtesting + tuning much faster and stopped me “guessing” in code.