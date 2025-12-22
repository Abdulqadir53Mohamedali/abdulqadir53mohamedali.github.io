---
layout: doc
---
<script setup lang="ts">
import { FMSlides } from '../.vitepress/theme/data/projectSlides'
</script>

<ProjectHero
  title="Forgiveness Mechanics"
  role="Sole Programmer"
  tools="C#,Unity , Visual Studio 2022"
/>

## Overview
::: tip Context
This project was a solo developed university assigment focused on implementing player forgivness mechanics , additionally creating a testing envirment to showcase / test each FM individually.
:::

<ProjectSlideshow :slides="FMSlides" />
<div class="project-overview">

The focus wasn’t adding lots of new gameplay systems — it was making *fundamental movement* feel consistent and fair, even when the player inputs slightly early/late or makes small mistakes.

A key constraint was **no Update-driven gameplay logic**. Movement and state are handled using **coroutines** , and **events** broadcast state changes . Input simply forwards intent, movement applies rules, and UI reacts to events rather than polling.

This movement training build Systems/features:

- **Forgiveness Mechanics Stack:** Variable jump height (jump-cut), coyote time, jump buffering, semi-solid platforms,apex gravity tuning and crouch on ledge.
- **Coroutine Movement Loop:** Horizontal movement runs in `C_MoveUpdate()`, while jump state + gravity are evaluated in `C_JumpLoop()` for predictable behaviour.
- **Grounding + Platform Rules:** `GroundCheck` tracks contact count and triggers grounded events; semi-solid platforms support drop-through via a short coroutine (`PassThroughPlatform`).
- **Training Zones:** `LightingTriggerArea` highlights the active section and can modify behaviour per zone (e.g. disabling coyote time for a ledge-focused section).
- **Checkpoint + Respawn Loop:** `CheckpointRegistry` stores the active checkpoint and broadcasts changes; `GameManager` updates spawn and respawns cleanly when the void is entered.
- **Timer + Results UI:** `TimerManager` tracks time + best time (PlayerPrefs) and shows results through `EndPanelController` when the finish line is crossed.
</div>

## Technical Highlights

<CollapseSection sectionId = "FmExplantion" title="Forgiveness Mechanics Movement Stack" icon="↕">

**1. Jump Buffering (early input help)**  
If the player presses jump *just before* landing, I store that input briefly (`jumpBufferTime`) and trigger the jump as soon as grounded. This removes the “my input didn’t register” frustration on fast platforming.

**2. Coyote Time (late input help)**  
After leaving ground, a short grace window (`m_CoyoteTimeThreshold`) still allows jumping. This makes edge-jumps consistent and prevents tiny timing errors from feeling punishing.

**3. Variable Jump Height (jump-cut)**  
Releasing the jump early cuts upward velocity (`velocity.y *= 0.5f`), giving the player control over short hops vs full jumps. This improves precision without adding complexity.

**4. Crouch On Ledge**  
Holding Control and then looking of the side of a ledge / corner without falling off , like **minecrafts** crouch on block.

<CodeCollapseSection title="Crouch on ledge visualised via debug lines of the raycsts" icon="⌘">

<ProjectMedia
  type="video"
  src="/Videos/FM/Dropdown/CrouchDebugLine.mp4"
  :autoplayInView="true"
  caption="Crouching on ledge visualised"
/>

</CodeCollapseSection>

**4. Apex Tuning (float control near the top)**  
Near the jump apex (low vertical velocity), gravity is adjusted so the top of the jump feels readable and controllable. This helps with landing accuracy and makes the arc feel smoother.

**5. Semi Solid Platforms**  
Platforms form whicht he plyer cna jump up from underneath and land on , as well as being able to drop through / down if they wished. This allows for some intresting platforming

<ProjectSlideshow :slides="FMSlides" />

### Why this works as a *stack*
These aren’t independent “features” — they cover different failure cases:
- buffer = **early press**
- coyote = **late press**
- variable height + apex = **control / readability mid-air**
- crouch on ledge = **control on tight areas / platforms / small platforms**
- Semi Solid Platoforms = ****

<CodeCollapseSection title="Code Snippet — Jump buffer + variable jump height" icon="⌘">

```csharp
// CharacterMovement (trimmed)
// Goal: forgiving inputs (buffer/coyote) + controllable jump height (jump-cut).

public void JumpPerformed()
{
    m_JumpHeld = true;

    // Buffer early input so "press slightly before landing" still jumps
    if (jumpBufferCoroutine != null)
    {
      StopCoroutine(jumpBufferCoroutine);
    }

    jumpBufferCoroutine = StartCoroutine(JumpBufferRoutine());
}

public void JumpCancelled()
{
    m_JumpHeld = false;

    // Jump-cut: releasing early reduces upward velocity → smaller jump
    if (m_RB.linearVelocity.y > 0f)
    {
       m_RB.linearVelocity = new Vector2(m_RB.linearVelocity.x, m_RB.linearVelocity.y * 0.5f);
    }
}

private IEnumerator JumpBufferRoutine()
{
    float end = Time.time + jumpBufferTime;

    // If we become allowed-to-jump within the window, jump immediately
    while (Time.time < end)
    {
        if (GroundCheck.m_IsGrounded || m_CoyoteTimeCounter > 0f)
        {
            Jump();      // actual jump happens in one place
            yield break; // consume buffered input
        }
        yield return null;
    }
}

```
</CodeCollapseSection> 
<!-- Optional tiny snippet: keep it short + readable -->


</CollapseSection>

<CollapseSection title="Coroutine-Driven Architecture (No Update)" icon="⟳">

**Fixed-step movement loop (horizontal)**  
Horizontal movement runs in a dedicated coroutine (`C_MoveUpdate()`), applying acceleration/deceleration in **FixedUpdate timing** via `WaitForFixedUpdate()`. This keeps movement consistent and avoids scattered “if input then…” checks across scripts.

**Fixed-step jump + gravity loop (vertical)**  
Jump state + gravity tuning runs in a second coroutine (`C_JumpLoop()`), also driven by `WaitForFixedUpdate()`. This means the jump phases (ascending → apex → falling) and gravity multipliers are applied from *one place*, making the forgiveness stack much easier to tune.

**Event-driven communication (no polling)**  
Instead of constantly checking conditions, systems broadcast events and listeners react:
- `GroundCheck` → `OnGrounded` / `OnLeftGround`
- `FinishLineTrigger` → `OnLevelCompleted`
- `CheckpointRegistry` → `OnCheckpointActivated`
- `PlayerInitializer` → `OnPlayerReady` (safe setup after respawn)

That separation keeps responsibilities clean: **input forwards intent → movement applies rules → UI/game systems react to events**.

<CodeCollapseSection title="Code Snippet — Coroutines + event wiring (no Update loops)" icon="⌘">

```csharp
// PlayerCamera (trimmed)
// Goal: follow using a coroutine on fixed-step timing (no Update polling)
private Coroutine followCoroutine;

private void OnEnable()
{
    PlayerInitializer.OnPlayerReady += AttachToPlayer; // event-driven hookup
}

private void AttachToPlayer(GameObject player)
{
    m_Target = player.transform;

    if (followCoroutine != null) StopCoroutine(followCoroutine);
    followCoroutine = StartCoroutine(FollowPlayerRoutine());
}

private IEnumerator FollowPlayerRoutine()
{
    yield return new WaitUntil(() => m_Target != null);

    while (m_Target != null)
    {
        yield return new WaitForFixedUpdate(); // fixed-step loop

        Vector3 desiredPos = m_Target.position + m_Offset;
        transform.position = Vector3.Lerp(
            transform.position,
            desiredPos,
            m_SmoothSpeed * Time.fixedDeltaTime
        );
    }
}


// TimerManager (trimmed)
// Goal: timing lives in one coroutine, started/stopped by events (no Update needed)
private void OnEnable()
{
    FinishLineTrigger.OnLevelCompleted += StopTimer; // event stops the loop
}

private IEnumerator TimerLoop()
{
    while (IsRunning)
    {
        CurrentTime += Time.deltaTime;
        yield return null; // lightweight frame loop, not an Update method
    }
}
```
</CodeCollapseSection>
</CollapseSection>

<CollapseSection title="Event-Driven Game Loop (Respawn / Timer / Checkpoints)" icon="⇆">

**Player spawn → safe setup (no race conditions)**  
`GameManager` spawns the player, then immediately broadcasts `PlayerInitializer.BroadcastPlayerReady(player)`. Any script that needs references (input, movement, camera, UI listeners) waits for `OnPlayerReady`, so respawns don’t break wiring.

**Checkpoint → respawn position (data-driven)**  
Checkpoints write into a `CheckpointRegistry` ScriptableObject, which stores the active checkpoint id/position and broadcasts `OnCheckpointActivated(id, pos)`. `GameManager` listens and updates the respawn point without needing direct checkpoint references.

**Void / death → clean respawn + re-subscribe**  
When the player hits the void, `GroundCheck` triggers `PlayerEnteredVoid`, and `GameManager.RespawnPlayer()` destroys the old instance, instantiates a new one at the current checkpoint, and re-hooks any required subscriptions safely.

<ProjectMedia
  type="video"
  src="/Videos/FM/Dropdown/CleanRespawnReset.mp4"
  :autoplayInView="true"
  caption="Checkpoint | Void | Respawn wokring cleanly"
/>

---

**Level completion → timer + end panel**  
`FinishLineTrigger` broadcasts `OnLevelCompleted`, `TimerManager` stops and saves best time (PlayerPrefs), then `EndPanelController` displays final/best time. UI updates are driven by state changes, not constant polling.

<ProjectMedia
  type="video"
  src="/Videos/FM/Dropdown/EndScreen.mp4"
  :autoplayInView="true"
  caption="Level Completion"
/>

---

**Why this matters:**  
This setup makes the project robust under respawns: systems don’t rely on fragile scene references, and the “test loop” (fail → respawn → retry) stays stable while tuning movement.

<CodeCollapseSection title="Code Snippet — Spawn → broadcast → checkpoint → respawn (event-driven)" icon="⌘">

```csharp
// GameManager (trimmed)
// Goal: respawn loop that survives destruction/re-instantiation (no broken references)

private void OnEnable()
{
    if (m_CheckpointRegistry != null)
        m_CheckpointRegistry.OnCheckpointActivated += HandleCheckpointActivated;
}

private void Start()
{
    // Use saved checkpoint if one exists
    if (m_CheckpointRegistry != null && m_CheckpointRegistry.activeCheckpointId != -1)
        m_PlayerCurrentSpawn = m_CheckpointRegistry.activeCheckpointPos;

    SpawnPlayer(m_PlayerPrefab);
}

private void HandleCheckpointActivated(int id, Vector3 pos)
{
    m_PlayerCurrentSpawn = pos; // GameManager becomes the single source of respawn position
}

private void SetupPlayer(GameObject player)
{
    // 1) hook void/death trigger
    var groundCheck = player.GetComponentInChildren<GroundCheck>();
    if (groundCheck != null)
        groundCheck.PlayerEnteredVoid += RespawnPlayer;

    // 2) broadcast "player is ready" so other systems can safely bind
    PlayerInitializer.BroadcastPlayerReady(player);
}

public void RespawnPlayer()
{
    // clean unsubscribe from the old instance before destroying it
    var groundCheck = m_playerRef?.GetComponentInChildren<GroundCheck>();
    if (groundCheck != null)
        groundCheck.PlayerEnteredVoid -= RespawnPlayer;

    if (m_playerRef != null)
        Destroy(m_playerRef);

    // respawn at latest checkpoint position
    m_playerRef = Instantiate(m_PlayerPrefab, m_PlayerCurrentSpawn, Quaternion.identity);
    SetupPlayer(m_playerRef);
}
```
</CodeCollapseSection> 
</CollapseSection>

## General

<CollapseSection title="Input System + Interaction Layer" icon="⌨">

**How it’s structured**
- **Move / Jump / Crouch:** `InputHandler` calls into `CharacterMovement` (`SetInMove`, `JumpPerformed`, `JumpCancelled`, `CrouchPerformed`).
- **Pause:** the input event is raised via `OnPausePressed`, then `PauseManager` listens and toggles the pause panel + `Time.timeScale`.
- **Drop-through platforms:** downward input triggers `OnDropThrough`, and `PassThroughPlatform` temporarily disables its collider using a coroutine.

**Interaction layer (simple + decoupled)**
Interaction uses a small interface so any object can opt-in:
- `InputHandler` does a `Physics2D.OverlapCircle(...)` against an interact layer.
- If the hit object implements `IInteractable`, it calls `Interact()`.
- Example: `SignPost : IInteractable` shows a message (and hides the prompt UI) without the player needing to know anything about signpost logic.

<ProjectMedia
  type="video"
  src="/Videos/FM/Dropdown/InteractShowcase.mp4"
  :autoplayInView="true"
  caption="Signpost Interact"
/>

---

This keeps the project clean: **input reads controls → broadcasts/forwards intent → gameplay systems decide the rules.**

<CodeCollapseSection title="Code Snippet — Interaction via interface (no hard references)" icon="⌘">

```csharp
// InputHandler (trimmed)
// Goal: player checks nearby interactables, calls Interact() via interface (decoupled)

private void Handle_InteractPerformed(InputAction.CallbackContext context)
{
    // small radius check keeps it simple and avoids per-frame scanning
    Collider2D hit = Physics2D.OverlapCircle(transform.position, 1f, m_InteractLayer);
    if (hit == null) return;

    // no dependency on specific object types (signs, doors, buttons, etc.)
    if (hit.transform.TryGetComponent<IInteractable>(out var interactable))
    {
        interactable.Interact();
    }
}
```
</CodeCollapseSection>
</CollapseSection>

<CollapseSection title="Grounding & Platform Rules (GroundCheck / Drop-through / Void)" icon="▣">

**GroundCheck (reliable grounding)**
- Tracks `groundContacts` so ground state doesn’t flicker.
- Raises:
  - `OnGrounded` when contacts go from **0 → 1**
  - `OnLeftGround` when contacts go from **1 → 0**
- Stores the last ground collider (useful for semi-solid logic if needed).

**Drop-through platforms (semi-solids)**
- `PassThroughPlatform` listens to the player’s `InputHandler.OnDropThrough` **only while the player is standing on the platform**.
- When triggered, it runs a short coroutine to disable the platform collider briefly:
  - `m_Collider.enabled = false;`
  - wait ~0.5s
  - `m_Collider.enabled = true;`

<ProjectMedia
  type="video"
  src="/Videos/FM/Dropdown/SemSolid.mp4"
  :autoplayInView="true"
  caption="Signpost Interact"
/>

This keeps the behaviour local to the platform, not hardcoded into the player.

---

**Void / respawn safety**
- `GroundCheck` also detects the void layer and triggers `PlayerEnteredVoid` (delayed by 1 frame so checkpoint updates can process first).
- `GameManager` listens and respawns the player at the current checkpoint position, then re-wires subscriptions cleanly for the new spawned instance.

<CodeCollapseSection title="Code Snippet — Ground contacts + delayed void event" icon="⌘">

```csharp
// GroundCheck (trimmed)
// Goal: stable grounded state + safe void trigger (wait 1 frame)

private int groundContacts = 0;
public bool m_IsGrounded { get; private set; }

private void OnTriggerEnter2D(Collider2D other)
{
    if (IsVoidLayer(other))
        StartCoroutine(DelayedVoidInvoke()); // lets checkpoint update first

    if (IsGroundedLayer(other))
    {
        groundContacts++;
        if (groundContacts == 1)
        {
            m_IsGrounded = true;
            OnGrounded?.Invoke();
        }
    }
}

private void OnTriggerExit2D(Collider2D other)
{
    if (!IsGroundedLayer(other)) return;

    groundContacts--;
    if (groundContacts <= 0)
    {
        groundContacts = 0;
        m_IsGrounded = false;
        OnLeftGround?.Invoke();
    }
}

private IEnumerator DelayedVoidInvoke()
{
    yield return null;          // 1 frame grace
    PlayerEnteredVoid?.Invoke();
}
```
</CodeCollapseSection>
</CollapseSection>

<CollapseSection title="UI Systems (Timer / End Screen / Pause)" icon="»">

**Timer (live + best time)**
- `TimerManager` (persistent singleton) tracks `CurrentTime` and saves `BestTime` using `PlayerPrefs`.
- Started in `GameManager`, stopped by `FinishLineTrigger.OnLevelCompleted`.

**End screen**
- On finish: `TimerManager.StopTimer()` → updates best time → `EndPanelController.ShowEndPanel(current, best)`.
- `EndPanelController` pauses the game (`Time.timeScale = 0`) and shows final + best time.

**Pause**
- `PauseManager` listens to `InputHandler.OnPausePressed` and toggles the pause panel + `Time.timeScale`.
- Buttons: resume / restart / return to menu.
</CollapseSection>

