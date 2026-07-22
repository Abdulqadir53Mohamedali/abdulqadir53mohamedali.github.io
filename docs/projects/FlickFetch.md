---
layout: doc
pageClass: wide-doc

---

<script setup lang="ts">
import { FlickFetchSlides, AiCompanionDropdownSlides, DebugCompanionSlides,SubstancePhotoshopVFXSlides,ActualTexturesForVFXBlur} from '../.vitepress/theme/data/projectSlides'
</script>

<ProjectHero
  title="Flick & Fetch"
  role="Tech Team , Gameplay Programmer , AI Programmer , VFX & Texture artist"
  tools="C++, UE5, Substance Designer, Photoshop ,Unreal Blueprints, JetBrains Rider"
/>

   <div class="home-actions">
    <a class="home-btn" href="/Awards/CollabCertificate.pdf">Best Mechanic Award</a>
      <a class="home-btn" href="https://lantern-lit-games.itch.io/flicknfetch">Itch.io Link</a>
  </div>

## Overview
::: tip Context

Flick & Fetch is a team developed cozy fossil mining game featuring environmental hazards, excavation mechanics and a museum progression system. I worked within the technical team and we recieved the **Best Mechanic Award**.

:::




<ProjectSlideshow :slides="FlickFetchSlides" />

<div class="project-overview">

My main responsibility was independently engineering and polishing several gameplay and visual systems:

- **AI companion system** featuring state based movement, hovering, obstacle avoidance, catch-up and recovery behaviour.
- **Companion driven lantern system** with proximity detection, gradual illumination, pulsing light and VFX feedback.
- **Reusable bridge mechanic** built with data-driven configuration and efficient timer based animation, though due to issues with the modelling the bridges were removed from the final build 
- **Fire and smoke VFX**, alongside supporting textures created using Substance Designer and Photoshop.
- Wider collaboration on debugging, gameplay integration and supporting systems including parts of the fossil mining mechanics , other VFX , and player movement .
</div>

## Highlights

<CollapseSection sectionId="core-loop" title="AI Companion Behaviour System" icon="➤">

The **companion** was designed to remain close to the player while still feeling like an independent, floating character rather than an object rigidly attached to them. 

I implemented the movement and behaviour system in C++, with editor exposed values allowing its speed, positioning and hover motion to be tuned without changing code

### State-Based Behaviour

The companion uses a lightweight state system, with each state representing a specific movement or gameplay responsibility:

| State | Responsibility |
|---|---|
| `Follow` | Maintains its normal position beside the player |
| `CatchUp` | Uses a faster movement speed when it falls behind |
| `IdleAnchor` | Settles near the player using a slower, softer movement speed |
| `AvoidObstacle` | Handles alternative target positions when the direct route is obstructed |
| `TeleportRecover` | Safely recovers when the companion becomes too far from the player |
| `LanternLight` | Temporarily leaves the player to travel towards and activate a lantern |

Separating these responsibilities made the companion easier to debug and extend. For example, the lantern behaviour could be added as another state without rewriting its normal following logic.

---

### Priority-Based Transitions

Instead of controlling every state through one large chain of `if` statements or a large `switch`, I created a **priority-based transition table**.

Each transition stores:

- Its starting and destination states.
- The condition required to activate it.
- Its priority.
- Whether it can be triggered from any state.

Emergency recovery is checked first, followed by lantern interaction, obstacle handling and normal movement transitions.

<CodeCollapseSection title="Priority-Based Transition Table" icon="⌘">

```cpp
// Representative rules from ACompanion::BuildTransitionTable()

// Highest priority: recover when too far away or blocked for too long
TransitionTable.Add(FCompanionTransition(
    ECompanionState::Follow,
    ECompanionState::TeleportRecover,
    [this]() { return CheckTeleportRecovery(); },
    0,
    true
));

// Leave the player temporarily to activate a nearby lantern
TransitionTable.Add(FCompanionTransition(
    ECompanionState::Follow,
    ECompanionState::LanternLight,
    [this]()
    {
        return bHasLanternTarget && LanternPositionList.Num() > 0;
    },
    5
));

// Catch up when the moving player becomes too far away
TransitionTable.Add(FCompanionTransition(
    ECompanionState::Follow,
    ECompanionState::CatchUp,
    [this]()
    {
        return bIsPlayerMoving
            && !bPathBlocked
            && GetDistanceToAnchor() > CatchUpDistance;
    },
    30,
    true
));

// Ensure the most important transitions are evaluated first
TransitionTable.Sort(
    [](const FCompanionTransition& A, const FCompanionTransition& B)
    {
        return A.Priority < B.Priority;
    }
);

ECompanionState ACompanion::GetNextState()
{
    for (const FCompanionTransition& Transition : TransitionTable)
    {
        if (!Transition.bAllowAny && Transition.From != CurrentState)
        {
            continue;
        }

        if (Transition.Condition && Transition.Condition())
        {
            return Transition.To;
        }
    }

    return CurrentState;
}
```
</CodeCollapseSection>

This structure keeps the decision making readable and makes adding new behaviours much easier: a new state can be introduced by defining its transition conditions and priority

---
### Player Relative Movement & Hovering
The companion follows a dedicated anchor attached to the player. Its offset is calculated using the anchor’s forward, right and up vectors, meaning the desired position remains relative to the player’s orientation.

A sine-based vertical offset creates the floating motion, while VInterpConstantTo moves the companion towards its target at a stable speed.

The following properties are exposed to Unreal Engine for tuning:

Follow, catch-up and idle speeds.
Maximum movement speed.
Catch-up and recovery distances.
Side and vertical positioning.
Hover height, amplitude and speed.
Position tolerance to prevent small amounts of jitter.
Reduced movement speed while affected by geyser hazards.

<ProjectSlideshow :slides="AiCompanionDropdownSlides" />

--- 

### Debugging & Recovery 
During development, I used debug visualisation to inspect the companion’s desired anchor, movement target and candidate positions. This helped identify problems such as wall clipping, movement jitter and the companion becoming separated from the player.

<ProjectSlideshow :slides=" DebugCompanionSlides" />
The system also includes distance-based recovery. If the companion becomes too far from its anchor, it returns to a suitable position near the player and resets its movement state.

<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/NtaDu5a-vHM?autoplay=1&mute=1&playsinline=1"
    title="Companion AI debugging and recovery"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    **First Test Iteration of the Companion** 
  </p>
</div>
This resulted in a companion that could support normal following, environmental hazards and lantern interactions through one extensible behaviour system.
</CollapseSection>


<CollapseSection sectionId="arch-perf" title="Companion and Lantern Interactione" icon="✦">

The lantern mechanic gives the companion an active gameplay purpose. Instead of the player switching lanterns on directly, approaching an unlit lantern causes the companion to leave its normal following position, travel towards it and bring it to life.

<ProjectMedia
  type="video"
  src="/Videos/FLFN/Slideshow/LanternLighted.mp4"
  :autoplayInView="true"
  caption="The player approaches an unlit lantern, prompting the companion to travel towards and activate it."
/>

### Interaction Flow

The complete interaction is divided between the lantern and companion systems:

**Player approaches lantern**  
→ Lantern detects the player  
→ `PlayerEntered` event is broadcast  
→ Companion selects the lantern as its target  
→ Companion enters `LanternLight` state  
→ Companion travels towards the lantern  
→ Lantern detects the companion  
→ Light, audio and VFX activate  
→ Companion returns to its normal following behaviour

This event-driven flow allows the lantern to notify interested systems without directly controlling the companion itself.

---

### Separate Player and Companion Detection

Each lantern uses two trigger areas with different responsibilities:

- **Outer trigger:** detects when the player is close enough to initiate the interaction.
- **Inner trigger:** detects when the companion has reached the lantern and can activate it.

The trigger areas use interfaces to identify valid actors:

- `UPCharacterInterface` identifies the player.
- `UCompanionInterface` identifies the companion.

This avoids requiring the lantern to cast to one specific player or companion class and makes the overlap checks easier to reuse.

<CodeCollapseSection title="Event-Driven Lantern Activation" icon="⌘">

```cpp
// The companion subscribes to each lantern's events
Lantern->PlayerEntered.AddDynamic(
    this,
    &ACompanion::OnPlayerNearLantern
);

Lantern->LanternLit.AddDynamic(
    this,
    &ACompanion::OnLanternLit
);
// ALantern::OnOverlapBegin (trimmed)

if (OverlappedComp == LanternOuterColliderComponent &&
    OtherActor->Implements<UPCharacterInterface>())
{
    // Tell the companion that the player reached this lantern
    PlayerEntered.Broadcast(this);
    bIsPlayerInside = true;
}
else if (OverlappedComp == LanternInnerColliderComponent &&
         OtherActor->Implements<UCompanionInterface>())
{
    bLanternEnabled = true;

    StartLanternBrighten();
    LanternSFX->Play();

    // Tell the companion that activation is complete
    LanternLit.Broadcast(this);

    // Prevent the completed lantern from being triggered again
    LanternOuterColliderComponent->SetCollisionEnabled(
        ECollisionEnabled::NoCollision
    );

    LanternInnerColliderComponent->SetCollisionEnabled(
        ECollisionEnabled::NoCollision
    );
}
```
</CodeCollapseSection>

When the first event is received, the companion stores the lantern as its current target and enters its LanternLight state. Once LanternLit is broadcast, the target is cleared and the companion returns to following the player.

---

### Gradual Illumination and Light Pulse

The lantern does not instantly jump from dark to fully illuminated. Activation begins a temporary timer that gradually increases the point light’s intensity.

SmoothStep eases the transition at the beginning and end, producing a more natural result than linear interpolation.

<CodeCollapseSection title="Lantern Brightness Interpolation" icon="⌘">

```cpp
void ALantern::UpdateLanternBrightness()
{
    CurrentBrightenTime += BrightenTickInterval;

    const float Alpha = FMath::Clamp(
        CurrentBrightenTime / BrightenDuration,
        0.0f,
        1.0f
    );

    const float SmoothedAlpha = FMath::SmoothStep(
        0.0f,
        1.0f,
        Alpha
    );

    const float NewIntensity = FMath::Lerp(
        0.0f,
        LanternLightIntensity,
        SmoothedAlpha
    );

    LanternLight->SetIntensity(NewIntensity);

    if (Alpha >= 1.0f)
    {
        GetWorldTimerManager().ClearTimer(
            LanternBrightenTimerHandle
        );

        bLanternPulseActive = bEnableLightPulse;
    }
}
```

</CodeCollapseSection>



After reaching full brightness, the lantern begins a continuous pulse. A sine wave adjusts both the light intensity and attenuation radius between configurable minimum and maximum values. This adds subtle motion to the environment and prevents the activated lantern from appearing visually static

<ProjectMedia type="video" src="/Videos/FLFN/Dropdowns/PulsingLantern.mp4" :autoplayInView="true" caption="Close-up of illumination, pulsing point light and accompanying lantern VFX." />
 
--- 
### Data-Driven Configuration

Each lantern can reference a ULanternDataConfig Data Asset containing its:

Static mesh.
Activation sound.
Base light intensity.
Inner and outer detection-radius values.

Additional properties expose the brighten duration, pulse speed, pulse strength and attenuation radius directly in Unreal Engine, allowing the effect to be adjusted without changing the underlying C++.

<ProjectMedia type="image" src="/Images/FLFN/Dropdowns/LanternDataAsset.png" caption="Lantern Data Asset and exposed lighting properties which can be used to cusotmise it " />

By combining AI states, interfaces, delegates, collision triggers, audio and lighting feedback, the lantern became a complete environmental interaction rather than a simple switch.


</CollapseSection>

<CollapseSection
  sectionId="textures-vfx"
  title="Fire, Smoke, Textures and VFX"
  icon="✧"
>

Alongside my programming responsibilities, I created textures and visual effects for the game’s environmental hazards, companion and lantern interactions. This allowed me to contribute to both the technical implementation and visual presentation of the project.

### Environmental Fire and Smoke

I created the fire and smoke effects used to communicate dangerous areas within the environment. The main challenge was making it recognisable while keeping them consistent with the game’s cosy visual style.

I adjusted properties including:

- Colour and brightness.
- Particle movement and direction.
- Scale and opacity over time.
- Effect intensity and spawn timing.
- The balance between the fire and surrounding smoke.

in total I made 4 Niagara emitters : Fire | Static Fire | Smoke | Sparks


---

### Texture Creation Workflow

The supporting textures were created in **Substance Designer**, where I used a node-based workflow to build and adjust their shapes and patterns. This gave me non-destructive control over the texture and allowed individual values to be refined throughout development.

The resulting textures were then adjusted and prepared in **Photoshop** before being imported into Unreal Engine and used within the final effects.

**Workflow:** Substance Designer → Photoshop refinement → Unreal Engine implementation → gameplay testing and adjustment.

<ProjectSlideshow :slides="SubstancePhotoshopVFXSlides" />


<ProjectSlideshow :slides="ActualTexturesForVFXBlur" />


<!-- Keep this comparison only if you have suitable before-and-after images. -->
<ProjectMedia
  type="video"
  src="/Images/FLFN/Dropdowns/OriginalFlamePriorToTextures.mp4"
  caption="Original Fire , prior to offical VFX & Textures"
/>

---

Creating these effects gave me experience moving between texture creation, visual development and gameplay implementation while considering both presentation and player readability.

</CollapseSection>

## General

<CollapseSection
  sectionId="additional-contributions"
  title="Additional Gameplay and Team Contributions"
  icon="⚙"
>

### Reusable Bridge System

I independently developed a reusable bridge interaction that allows the player to lower environmental bridges into a walkable position.

The system was designed to support different bridge meshes, sizes and placements without requiring a separate animation for every bridge. A `SnapTarget` scene component defines the final rotation, allowing a designer to position the bridge’s destination directly inside the Unreal Editor.

<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/vjpLLC_8XPk?autoplay=1&mute=1&playsinline=1"
    title="Bridge Testing"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    <strong>Bridge Testing</strong>
  </p>
</div>

<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/aWtKP24_tCY?autoplay=1&mute=1&playsinline=1"
    title="Companion development footage"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    <strong>Gradual Issue Fix Showcase</strong>
  </p>
</div>

Each bridge references a `UBridgeDataConfig` Data Asset containing its:

- Bridge mesh.
- Activation sound.
- Player interaction radius.
- Fall duration.

These values are applied during `OnConstruction()`, allowing changes to be previewed and adjusted within the editor.

The bridge does not use a permanent `Tick()`. When activated, it temporarily starts a timer and uses `FQuat::Slerp` with `SmoothStep` easing to rotate between its starting position and the designer-defined `SnapTarget`.

<CodeCollapseSection title="Timer-Driven Bridge Movement" icon="⌘">

```cpp
ABridge::ABridge()
{
    // The bridge does not require permanent per-frame updates
    PrimaryActorTick.bCanEverTick = false;
}

void ABridge::StartFalling()
{
    if (bIsFalling)
    {
        return;
    }

    bIsFalling = true;
    FallElapsed = 0.0f;

    StartPivotRotation = BridgePivot->GetComponentRotation();
    TargetPivotRotation = SnapTarget->GetComponentRotation();

    // Only update while the bridge is moving
    GetWorldTimerManager().SetTimer(
        FallTimerHandle,
        this,
        &ABridge::UpdateFalling,
        0.016f,
        true
    );
}

void ABridge::UpdateFalling()
{
    FallElapsed += GetWorld()->GetDeltaSeconds();

    float Alpha = FMath::Clamp(
        FallElapsed / FMath::Max(FallDuration, 0.01f),
        0.0f,
        1.0f
    );

    Alpha = FMath::SmoothStep(0.0f, 1.0f, Alpha);

    const FQuat NewRotation = FQuat::Slerp(
        StartPivotRotation.Quaternion(),
        TargetPivotRotation.Quaternion(),
        Alpha
    );

    BridgePivot->SetWorldRotation(NewRotation);

    if (Alpha >= 1.0f)
    {
        FinishFalling();
    }
}
```

</CodeCollapseSection>

Once the movement finishes, the bridge snaps precisely to its target rotation, becomes walkable and disables its interaction trigger to prevent repeated activation.

---

### Technical Team Collaboration

Alongside my independently developed **companion, lantern, bridge, texture and VFX work**, I contributed to the project as part of the wider technical team.

My collaborative contributions included:

- Assisting with gameplay debugging and integration.
- Supporting elements of the fossil-mining minigame.
- Helping team members investigate technical and visual issues.
- Integrating work across C++, Unreal Blueprints and shared gameplay systems.
- Working with programmers, artists and designers to improve the consistency and polish of the final game.

Working across both independently owned and shared systems gave me experience communicating technical requirements, adapting my work around other disciplines and supporting features beyond my assigned responsibilities.

</CollapseSection>

## Lessons Learned

This project taught me how much **iteration and debugging** are required to make an AI companion feel natural. Features such as hovering, catching up, recovering and interacting with lanterns needed repeated testing and tuning. I also learned how **VFX timing, colour and intensity** can communicate hazards and successful interactions more clearly to the player.

Working within a multidisciplinary team reinforced the importance of **clear ownership, communication and integration**. Using **states, interfaces, delegates and Data Assets** helped my independently developed systems connect with the wider project, while supporting shared mechanics taught me how to adapt and contribute beyond my assigned tasks.

<!-- ---

<div class="home-actions">
    <a class="home-btn" href="/Awards/CollabCertificate.pdf">Best Mechanic Award</a>
</div> -->
