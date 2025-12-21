---
layout: doc
pageClass: wide-doc

---

<script setup lang="ts">
import { paintSlides, DesignPaintSlides ,DesignHealthPaintSlides,LevelInteractionTurretButtonSlides} from '../.vitepress/theme/data/projectSlides'
</script>

<ProjectHero
  title="Paint Training Course"
  role="Sole Programmer"
  tools="C++, Unreal Engine 5, Unreal Blueprints, JetBrains Rider"
/>

## Overview
::: tip Context
This project was a solo developed university assignment, across 8 weeks to create a Testing Environment for a Series of mechanics in C++, while also making it designer friendly & scalable
:::


<ProjectSlideshow :slides="paintSlides" />

<div class="project-overview">

A first-person t training course traversed via paint, (paint gun) , the player is not able to use mechanics manually only through the paint. Due to time constraints, I focused on the core systems, making them designer friendly & efficient.

This Testing Environment features a series of systems

- **Paint Ability System** ( Green,blue,Red,Orange,Purple) , modifying player movment and interact with special surfaces ( jump,speed boost, phasing, destructable,manual jump).
- **Projectile + Collider management systems**, using design patterns such as object pooling and spatial partioning
- **Data-driven content** (Type Object / Data Assets), pickups / collectibles, input actions, paint gun. Making it easy to change specific values or switch out meshes and even change the entire ability setup. Just by switching out the data assets in the blueprints there is no integration issues.
- **UI systems handled through UMG**, via a general HUD class, allowing for easy additions to be made to the players main UI
- **Traversal & interaction Systems** (dash and turret button press)
- A project-wide focus on C++ **decoupling and modularity**, making extensive use of **interfaces, Delegates, actor component, and BlueprintImplementableEvents** for easy extension and customisation in blueprints
</div>

## Highlights

<CollapseSection sectionId="core-loop" title="Core Gameplay Loop & Paint Powers" icon="■">

**Core loop:** pick a paint type → shoot surfaces → the environment + player movement changes → use that change to reach the next Checkpoint / interaction.

### Paint powers (what each one does)
<ProjectMedia
  type="image"
  src="/Images/PaintColoursShow.png"
  :autoplayInView="true"
  caption="True colour of the paints "
/>

- **Green:** enables bounce / wall-jump style traversal on eligible surfaces (changes movement options and routing).
<ProjectMedia
  type="video"
  src="/Videos/Paint/DropDowns/WJR.mp4"
  :autoplayInView="true"
  caption="Green paint : wall jump traversal (movement is driven by surface normal state, not manual ability buttons)."
/>

- **Blue:** speed-focused movement modifier for fast traversal lines.
- **Red:** destructible interaction (breakable surfaces / obstacles are driven by the paint state).
- **Orange:** phasing interaction for phaseable walls/geometry.
- **Purple:** manual jump / vertical option when the level wants controlled height gain (useful for “gated” jumps).

---
<ProjectMedia
  type="video"
  src="/Videos/Paint/DropDowns/PPR.mp4"
  :autoplayInView="true"
  caption="Purple paint: 1 Manual jump charge given to player, as well as minor jump boost from paint surface. "
/>

### How paint becomes gameplay
- Each paint colour maps to an `EPaintType` and is handled via a **polymorphic effect layer** (`UPaintEffect` base + derived classes like `UBluePaintEffect`, `UGreenPaintEffect`, `UPurplePaintEffect`, `UOrangePaintEffect`, `URedPaintEffect`).
- The player owns a `UPlayerPaintReactionComponent`, which acts like an “effect manager”:
  - creates the correct `UPaintEffect` when entering paint,
  - tracks active paint types to prevent duplicates,
  - cleanly removes effects on exit (including small grace rules like “blue linger”).

### Why this is scalable
- Adding a new paint type is mostly **data + one new class**:
  - add to `EPaintType`,
  - implement a new `UPaintEffect` subclass,
  - register it in `PaintEffectClasses` on `UPlayerPaintReactionComponent`.
- The gameplay code stays **designer-friendly** because most tuning values are exposed with `UPROPERTY(EditDefaultsOnly)` (multipliers, cooldowns, allowed behaviours, etc).

<CodeCollapseSection title="Code Snippet" icon="□">

```cpp
 
  // UPlayerPaintReactionComponent::OnEnterPaint (trimmed)
  if (ActiveEffects.Contains(PaintType))
  {
      return; // prevents stacking duplicates
  }

  UPaintEffect* NewEffect = CreateEffect(PaintType);
  if (NewEffect)
  {
      NewEffect->SetSurfaceNormal(FPaintSurfaceNormal);
      NewEffect->ApplyEffect(GetOwnerCharacter());

      ActiveEffects.Add(PaintType, NewEffect);
      ActiveEffectNormals.Add(PaintType, FPaintSurfaceNormal);
  }

```
</CodeCollapseSection>

### Feedback & readability
- Paint type changes are reflected through **surface visuals (materials/decals)** and **player response**, so the player learns by doing/progressing.
- Abilities are **surface-driven** , so the surface in which a pain decal is applied determines whether it effeects or helps the player

<!-- Paste your final version we wrote together here (keep your wording). -->
</CollapseSection>

<CollapseSection sectionId="arch-perf" title="Architecture (Design Patterns) & Performance" icon="■">

This project fires a lot of paint projectiles and creates a lot of short-lived “impact” logic, so I focused on performance patterns that keep gameplay smooth and predictable as the level gets larger.

### Performance goals
- Avoid expensive `Tick()` logic where it isn’t needed (most actors/components use `PrimaryActorTick.bCanEverTick = false`).
- Prefer **timers + events** over per-frame polling (e.g. turret fire timers, delayed destruction in `UHealthComponent`).
- Keep systems **loosely coupled** (interfaces, data assets, subsystems) so features can be extended without rewriting core code.



### Object Pooling (why it matters)

<ProjectMedia
  type="video"
  src="/Videos/Paint/DropDowns/OBPR.mp4"
  :autoplayInView="true"
  caption="Object Pooling: paint/impact actors are reused instead of repeatedly spawning and destroying."
/>

When you **spawn and destroy** lots of actors every second, you can cause small stutters (allocation + cleanup overhead).  
- To avoid that, I used **object pooling**: actors are created upfront, then “checked out”, reset, and reused.  
- I used a reusable pool via `APaintPool`, returning either:
  - an inactive decal from `AvailableDecals`, or  
  - recycling the **oldest** one from `ActiveDecals` if the pool is exhausted.

<CodeCollapseSection title="Code Snippet" icon="□">

```cpp
 
// APaintPool::GetDecalActorFromPool (trimmed)
APaintDecalActor* Decal = nullptr;

if (AvailableDecals.Num() > 0)
{
    Decal = AvailableDecals[0];
    AvailableDecals.RemoveAt(0);
}
else if (ActiveDecals.Num() > 0)
{
    Decal = ActiveDecals[0];
    ActiveDecals.RemoveAt(0);
    Decal->ResetForUse(); // clean state before reuse
}

if (Decal)
{
    Decal->SetActorHiddenInGame(false);
    Decal->SetActorEnableCollision(true);
    ActiveDecals.Add(Decal);
}
```
</CodeCollapseSection>

---

### Spatial Partitioning (explained simply)

<ProjectMedia
  type="video"
  src= "/Videos/Paint/Slideshow/SP.mp4"
  :autoplayInView="true"
  caption="Spatial Partitioning / Collider merging: The world is split into **small regions (cells)** so systems only process what’s relevant nearby."
/>

In my case, this is used to keep paint surface collision manageable:
- Without partitioning, lots of painted areas can build up and collision/overlap checks can become “everything vs everything”.
- With partitioning, paint data is stored/processed per cell, so when something needs to query paint, it only checks the **local cell(s)** around it.
- So `APaintZoneManager` partitions decals into grid cells (`FIntPoint`) + `EPaintType`, meaning logic can reason about the  “local” paint zones.
  - This keeps zone tracking scalable and gives a foundation for optimisations like “merge colliders when dense

<CodeCollapseSection title="Code Snippet" icon="□">

```cpp
 
// APaintZoneManager::RegisterDecal 
// Goal: avoid tracking decals in one global list by bucketing into grid-cell + paint-type zones.
void APaintZoneManager::RegisterDecal(APaintDecalActor* Decal)
{
    if (!Decal) return;

    const FIntPoint Cell = WorldToGrid(Decal->GetActorLocation());
    const EPaintType Type = Decal->PaintType;

    // Key is unique per cell + paint type, so zones stay local + predictable
    UPaintZone* Zone = GetOrCreateZone(Cell, Type);
    if (Zone)
    {
        Zone->AddDecal(Decal); // zone can later decide when to merge colliders, etc.
    }ActiveDecals.Add(Decal);
}
```

```cpp
 
// APaintZoneManager::GetOrCreateZone + RegisterDecal
UPaintZone* APaintZoneManager::GetOrCreateZone(FIntPoint Cell, EPaintType Type)
{
    const FString Key = GetZoneKey(Cell, Type);

    if (UPaintZone** Existing = Zones.Find(Key))
        return *Existing;

    UPaintZone* NewZone = NewObject<UPaintZone>(this);
    NewZone->Initialize(Type, GetWorld());
    NewZone->SetGridCell(Cell);

    Zones.Add(Key, NewZone);
    return NewZone;
}
```
</CodeCollapseSection>

The result is a system that scales better as the player paints more of the level.

### Weapon architecture (template-style structure)
I used a **base weapon class** (`AWeaponBase`) (shared firing / input / equip logic(e.g `HandleFire`,`CnaFire()`,`Fire()`)) and then a specialised weapon implementation class for the `APaintGun`.

<CodeCollapseSection title="Code Snippet" icon="□">

```cpp
 
// AWeaponBase::Fire (trimmed)
// Template Method: this high-level flow stays the same for all weapons.
void AWeaponBase::Fire()
{
    if (!CanFire())
        return;

    HandleFire();               // <- variation point (derived weapons override)
    OnWeaponFired.Broadcast();  // <- stable post-fire event (UI/VFX/audio can hook in)
}

// Default rule: only fires when equipped + has valid data
bool AWeaponBase::CanFire() const
{
    return bIsEquipped && WeaponData != nullptr;
}
```

```cpp
 
// APaintGun overrides only what changes, reusing the base Fire() pipeline.
bool APaintGun::CanFire() const
{
    return Super::CanFire() && CurrentPaintType != EPaintType::None;
}

void APaintGun::HandleFire()
{
    // Paint weapon uses trace + pooled decals instead of spawning a normal projectile.
    // (Implementation detail: TracePaintHit -> pool.GetDecalActorFromPool -> SetPaintColor)
}
```


</CodeCollapseSection>

This structure makes it easy to add future weapons (or alternate paint tools) without duplicating core weapon code — the shared behaviour stays in the base class, while each weapon overrides only what it needs (projectile type, fire behaviour, cooldown rules, UI hooks).
<!-- Paste your final version we wrote together here (keep your wording). -->

<CodeCollapseSection title="Other architecture choices that support performance" icon="□">

- `UTurretWorldManage`r is a `UWorldSubsystem` that tracks turrets using `TWeakObjectPtr` to avoid hard ownership and to stay safe if actors are destroyed.

- Data-driven configuration via `UWeaponDataAsset`, `UCollectibleData`, `UPickupData` and `TSubclassOf<>` keeps balancing/tuning out of code and reduces iteration cost.

- Interaction is decoupled through `IInteractableInterface` + `UInteractableComponent` so interactive actors don’t depend on a specific player class
</CodeCollapseSection>

</CollapseSection>

<CollapseSection sectionId="designer-scalable" title="Designer Friendly & Scalable Systems" icon="■">

### Making C++ systems “designer-owned”




Mainly done through:
- **Data Assets** (data-driven configuration)
- **BlueprintAssignable events** (Blueprint hooks into C++ lifecycle)
- **BlueprintImplementableEvent** (BP extends behaviour without subclassing C++)
- Reusable **Actor Components** (attach behaviour to any actor)

---
### Paint Gun — designer tuning without touching code
The paint gun is written in C++ (`APaintGun`), but most gameplay tuning is editor-driven:
- unlocked paint tags/types
- materials/VFX references
- fire rates, range, pool size, cooldowns, limits
<ProjectSlideshow :slides="DesignPaintSlides " />


<CodeCollapseSection title="PaintGun exposes tuning values (designer-friendly C++)" icon="□">

```cpp
// APaintGun.h (trimmed)
UPROPERTY(EditDefaultsOnly, BlueprintReadWrite, Category="Paint")
float PaintRange = 3000.0f;

UPROPERTY(EditDefaultsOnly, Category="Paint")
float SprayFireRate = 0.1f;

UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Paint|Pool")
TSubclassOf<APaintDecalActor> PaintDecalClass;

UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Paint|Pool")
int32 PoolSize = 200;
```
</CodeCollapseSection>

---
### Data Assets

<ProjectMedia
  type="image"
  src="/Images/PaintPics/DataAsstes.png"
  caption="Data Assets , create new ones which inherit from base C++ classes and plug an play in to other blueprints"
/>
<CodeCollapseSection title="Exmaple" icon="□">

- `UCollectibleData` → mesh, points, type, pickup SFX
- `UPickupData` → type, value, mesh, glow, weapon class/data
- `UWeaponDataAsset` → projectile, mesh, fire rate, damage
</CodeCollapseSection>

---

### Health Compoent + Destructable Wall

<ProjectSlideshow :slides="DesignHealthPaintSlides " />
<CodeCollapseSection title="Code View" icon="□">

```cpp
// UHealthComponent.h (trimmed)
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHealthChanged, float, Health);
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnStartFlashing);
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnStopFlashing);

UPROPERTY(BlueprintCallable, Category="Health")
FOnHealthChanged OnHealthChanged;

UPROPERTY(BlueprintAssignable, Category="Destruction")
FOnStartFlashing OnStartFlashing;

UPROPERTY(BlueprintAssignable, Category="Destruction")
FOnStopFlashing OnStopFlashing;
```
</CodeCollapseSection>

---

### Player HUD

<ProjectMedia
  type="image"
  src="/Images/PaintPics/UiComponentOnPlayer.png"
  caption="How easy it is to change the players UI , simply choose another HUD bluepritn made and select."
/>

---

<!-- Paste your final version we wrote together here (keep your wording). -->
</CollapseSection>

<!-- <div class="wavy-divider"></div> -->

## General

<CollapseSection sectionId="level-interaction" title="Level Interaction" icon="■">

### Checkpoint

<ProjectMedia
  type="video"
  src= "/Videos/Paint/Slideshow/CHPN.mp4"
  :autoplayInView="true"
  caption="Checkpoint which sets the players spawn point , logged upon enter , events broadcasted "
/>

**How it works (technical):**
- `ACheckpoint` is a specialised `ABaseInteractable` that triggers via overlap.
- It broadcasts `OnCheckpointReached(Index, this)` which `ATrainingCourseGameMode` listens to (so the checkpoint doesn’t need to know about GameMode logic).
- `ActivateCheckpoint()` handles *feedback* (Niagara + sound) and prevents re-trigger spam.

<CodeCollapseSection title="Checkpoint - broadcast + activate (trimmed)" icon="□">

```cpp
// ACheckpoint::OnPlayerEnterInteractionZone (trimmed)
if (ATrainingCoursePlayerCharacter* Player = Cast<ATrainingCoursePlayerCharacter>(OtherActor))
{
    if (!bIsCurrentCheckpoint)
    {
        OnCheckpointReached.Broadcast(CheckpointIndex, this); // notify GameMode
        IInteractableInterface::Execute_Interact(this, Player); // optional interaction hook
    }
}

// ACheckpoint::ActivateCheckpoint (trimmed)
bIsCurrentCheckpoint = true;
PlayEffectOnActivation(); // Niagara
UGameplayStatics::PlaySoundAtLocation(this, CheckpointSound, GetActorLocation());
```
</CodeCollapseSection>

---

### Turret Button

**How it works**
- `ATurretButton` toggles state when interacted with.
- It talks to a `UWorldSubsystem` (`UTurretWorldManager`) which tracks turrets and can enable/disable them as a group.
-Turrets register/unregister themselves on BeginPlay/EndPlay (no manual wiring per level).

<ProjectSlideshow :slides="LevelInteractionTurretButtonSlides" />
<CodeCollapseSection title="Turret Button Communication Code Snippet" icon="□">

```cpp
// ATurretButton::OnButtonPressed_Implementation (trimmed)
if (UTurretWorldManager* WM = GetWorld()->GetSubsystem<UTurretWorldManager>())
{
    const bool bEnable = !bIsPressed;      // pressed state is handled in base button
    WM->SetAllTurretsActive(bEnable);      // global fan-out
}

// UTurretWorldManager::SetAllTurretsActive (trimmed)
for (TWeakObjectPtr<ABaseTurret> Turret : ActiveTurrets)
{
    if (Turret.IsValid())
    {
              Turret->SetTurretActive(bActive); // starts/stops fire timer
    }
}
```
</CodeCollapseSection>

---

### Collectibles

**How it works**
- Each collectible references a `UCollectibleData` DataAsset (mesh, points, sound).
- On overlap, the collectible finds the active `UCollectibleGameRul`e on the GameMode and broadcasts points.
- GameMode binds to rule delegates at BeginPlay and updates `ATrainingCoursePlayerState`.

<ProjectMedia
  type="video"
  src= "/Videos/Paint/DropDowns/Collectible.mp4"
  :autoplayInView="true"
  caption="Collectible"
/>

<CodeCollapseSection title="Collectible Code Snippet" icon="□">

```cpp
// ADataDrivenBaseCollectible::OnPlayerEnterInteractionZone (trimmed)
if (CollectibleData->PickupSound)
{
    UGameplayStatics::PlaySoundAtLocation(this, CollectibleData->PickupSound, GetActorLocation());
}

if (ATrainingCourseGameMode* GM = Cast<ATrainingCourseGameMode>(UGameplayStatics::GetGameMode(this)))
{
    if (UCollectibleGameRule* Rule = GM->FindComponentByClass<UCollectibleGameRule>())
    {
                Rule->BroadcastPoints(PC, CollectibleData->Points); // decoupled scoring
    }
}

Destroy();
```
</CodeCollapseSection>

---

### Health Pick up

**Why this is scaleable**
- Pickups don’t need to know “player class details” — they just look for a UHealthComponent.

<ProjectMedia
  type="video"
  src= "/Videos/Paint/DropDowns/HealthPickup.mp4"
  :autoplayInView="true"
  caption="Health Pickup"
/>

<!-- Paste your final version here -->
</CollapseSection>

<CollapseSection sectionId="interfaces-abstraction" title="Interfaces / Abstraction Choices" icon="■">

### IIAInterface
- Input Action interface 
### InteractableInterface
- Provides base interaction , something simple as opening a door , add this interface to the class and when player presses 'E' whaever is in the doors interact impelmentation will be called, player doesnt even have to knwo what it is just  checking if it has the interface
<!-- Paste your final version here -->
</CollapseSection>

<CollapseSection sectionId="materials-vfx" title="Materials & VFX" icon="■">

### Paint Decal Materials
<ProjectMedia
  type="image"
  src="/Images/PaintPics/PaintMaterialInstances.png"
  caption="All 5 Paint Materials"
/>

<ProjectMedia
  type="image"
  src="/Images/PaintPics/PaintMasterMaterial.png"
  caption="Node layout of the Master Material"
/>

### VFX

<ProjectMedia
  type="video"
  src= "/Videos/Paint/Slideshow/DEW.mp4"
  :autoplayInView="true"
  caption="Destructable Wall Flash "
/>



<ProjectMedia
  type="video"
  src= "/Videos/Paint/Slideshow/CHPN.mp4"
  :autoplayInView="true"
  caption="Checkpoint Upwards particle burst to visually communicate to the player they habe entered / set the checkpoint"
/>

<!-- Short section: 1 master material screenshot + 1–2 gifs for VFX (checkpoint, flashing destructible). -->
</CollapseSection>

<CollapseSection sectionId="audio" title="Audio (Click Unmute)" icon="■">

---
### Collectible

<ProjectMedia
  type="video"
  src= "/Videos/Paint/DropDowns/Collectible.mp4"
  :autoplayInView="true"
  caption="Video game coin collection sound"
/>

---
### Checkpoint

<ProjectMedia
  type="video"
  src= "/Videos/Paint/Slideshow/CHPN.mp4"
  :autoplayInView="true"
  caption="Checkpoint subtle wavy paino like audio"
/>

---
### Jump (Same for purple & manual jump)
<ProjectMedia
  type= 'video',
  src= '/Videos/Paint/Slideshow/GPNJ.mp4'
  :autoplayInView="true"
  caption= 'Bouncy green paint effect on player'
/>

---
### turret & Turret Button
<ProjectMedia
  type= 'video',
  src= '/Videos/Paint/DropDowns/ActiovateTurretRespawn.mp4'
  :autoplayInView="true"
  caption= 'Button interact sound & Turret firing sound'
/>

<!-- Keep short. Mention: green paint bounce, checkpoint, collectibles, turret + button. -->
</CollapseSection>

---


## Lessons Learned

This project reinforced how important it is to balance **scope vs. polish**. The core mechanics (**paint effects**, **object pooling**, **modular components**, **UI feedback**) came together quickly, but I learned that traversal/puzzle gameplay lives or dies on **iteration** — **clear visual communication**, **consistent rules**, and repeated **playtesting + tuning** often take longer than implementing the mechanics themselves.

My biggest technical takeaway was the value of **building for extension early**. By structuring paint behaviour as **data-driven effects** + **reusable components** (rather than hardcoding per-actor logic), I ended up with systems that are easy to **scale**: new **paint types**, **surface rules**, **interactables**, or **reactions** can be added by creating a new **class/data asset** and wiring it up, without rewriting the existing **gameplay loop**.

