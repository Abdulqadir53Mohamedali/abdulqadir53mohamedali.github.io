---
layout: doc
pageClass: wide-doc

---

<script setup lang="ts">
import { AiScenesDebugVisualised,AiContextVideo } from '../.vitepress/theme/data/projectSlides'
</script>

<ProjectHero
  title="Game Artificial Intellignece"
  role="AI Programmer"
  tools="C#, Unity, JetBrains Rider"
/>

## Overview
::: tip Context

This was an individual programming project completed within a university Game AI module using a provided Unity framework with the bare bones. I implemented pathfinding, steering and decision-making systems, culminating in an integrated AI combat scene.

:::




<ProjectSlideshow :slides="AiContextVideo" />

<div class="project-overview">

A collection of focused Unity scenes exploring game AI from its mathematical foundations through to practical agent behaviour. Each scene tested an individual technique before the systems were combined within a final decision making simulation.

The project features:

- **Three grid-based pathfinding algorithms:** A*, Dijkstra’s algorithm & Jump Point Search
- A reusable **steering behaviour framework**, including Seek, Flee, Arrive, Wander, Pursuit, Evade and flocking behaviours
- **Fuzzy scoring** driven by health, ammunition, enemy distance, enemy count and available pickups
- A central **AI Blackboard** that gathers and normalises information for decision making
- A priority based **Finite State Machine** with Explore, Combat, Resupply and Panic behaviours
- **Data-driven AI configuration** using ScriptableObjects, Animation Curves, weights and separate enter/exit thresholds
- Coordinated enemy behaviour that limits simultaneous zombie attacks and prevents unfair swarm damage
</div>

## Highlights

<CollapseSection
  sectionId="PathfindingAlgorithms"
  title="Pathfinding Algorithms and Grid Search"
  icon="◆"
>

I implemented three grid-based pathfinding algorithms: **A\***, **Dijkstra’s algorithm** and **Jump Point Search** - using the same underlying node grid. Separate demonstration scenes allowed me to visualise how each algorithm explored the environment and responded to obstacles.

### Algorithm Comparison

| Algorithm | Node selection | Main characteristic |
|---|---|---|
| **Dijkstra** | Lowest accumulated cost (`gCost`) | Searches uniformly without using knowledge of the destination |
| **A\*** | Lowest combined cost (`gCost + hCost`) | Uses a heuristic to guide the search towards the destination |
| **Jump Point Search** | Lowest combined cost at selected jump points | Prunes unnecessary directions and skips intermediate nodes on uniform grids |


---

### Shared Pathfinding Foundation

All three algorithms inherit from a shared abstract `PathFinding` class. This provides:

- Access to the current `GridNode` collection
- A shared list of generated path positions
- Optional diagonal movement and corner cutting settings
- A maximum search count to prevent infinite searches
- Functions for retrieving and removing completed path points
- A shared location for heuristic calculations
- Optional grid colour debugging

Each algorithm implements its own version of `GeneratePath()`, while using the same grid and output format. Allowing agents to consume a generated path without needing to know which algorithm created it.

---

### A* Pathfinding

A* maintains two collections:

- The **open list** contains discovered nodes that can still be explored
- The **closed list** contains nodes that have already been evaluated

Each node stores:

- `gCost`: the travelled cost from the starting node
- `hCost`: the estimated remaining distance to the destination
- `fCost`: the combined value of `gCost + hCost`
- A parent reference used to reconstruct the final path

The algorithm repeatedly selects the node with the lowest `fCost`, evaluates its walkable neighbours and updates the open list when a cheaper route is found.

<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/L9DFAE0HFRU?autoplay=1&mute=1&playsinline=1&loop=1&playlist=L9DFAE0HFRU"
    title="Flick & Fetch development footage"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    <strong>A* Pathfinding</strong>
  </p>
</div>

<CodeCollapseSection title="A* Node Evaluation" icon="⌘">

```csharp
// Selects the open node with the lowest combined cost
current = GetCheapestNode(openList);

openList.Remove(current);
closedList.Add(current);

if (current.node == end)
{
    SetPath(current);
    DrawPath(openList, closedList);
    return;
}

foreach (GridNode neighbour in current.node.Neighbours)
{
    if (neighbour == null ||
        !neighbour.m_Walkable ||
        closedList.Any(x => x.node == neighbour))
    {
        continue;
    }

    float newGCost = current.gCost + Maths.Magnitude(
        (Vector2)neighbour.transform.position -
        (Vector2)current.node.transform.position
    );

    NodeInformation existingNode =
        openList.Find(x => x.node == neighbour);

    // Ignore this route if an equal or cheaper one already exists
    if (existingNode != null &&
        existingNode.gCost <= newGCost)
    {
        continue;
    }

    if (existingNode != null)
    {
        openList.Remove(existingNode);
    }

    openList.Add(new NodeInformation(
        neighbour,
        current,
        newGCost,
        Heuristic_Manhattan(neighbour, end)
    ));
}
```

```csharp
// Reconstructs the route by following parent references
private void SetPath(NodeInformation end)
{
    NodeInformation current = end;

    while (current != null)
    {
        m_Path.Add(current.node.transform.position);
        current = current.parent;
    }

    // Parent traversal produces destination to start order
    m_Path.Reverse();
}
```

</CodeCollapseSection>

---

### Dijkstra’s Algorithm

Dijkstra’s algorithm uses the same parent based path reconstruction but selects nodes using only the accumulated travel cost.

Without a destination heuristic, the search expands uniformly from the starting node. This made it a useful baseline for understanding how A* reduces unnecessary exploration by including an estimated remaining distance


<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/QoE9YsnFUII?autoplay=1&mute=1&playsinline=1&loop=1&playlist=QoE9YsnFUII"
    title="Dijkstra’s Footage"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    <strong>Dijkstra’s Algorithm</strong>
  </p>
</div>

---

### Jump Point Search

Jump Point Search builds on A*-style cost evaluation while reducing the number of nodes added to the open list.

Instead of evaluating every grid position individually, the algorithm:

1. Prunes directions that cannot produce a useful route
2. Continues travelling in each remaining direction
3. Stops when it reaches an obstacle, the destination or a forced neighbour
4. Adds the resulting jump point to the open list
5. Uses `gCost + hCost` to decide which jump point to explore next

A **forced neighbour** appears when an obstacle creates a potential turning opportunity. Detecting these positions is important because they may lead around an obstruction towards the destination.

<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/MqmeSpjs7_k?autoplay=1&mute=1&playsinline=1&loop=1&playlist=MqmeSpjs7_k"
    title="JPS Footage"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    <strong>JPS Algorithm</strong>
  </p>
</div>

<CodeCollapseSection title="Jump Point Search" icon="⌘">

```csharp
private GridNode Jump(
    int direction,
    GridNode currentNode,
    GridNode goal)
{
    while (true)
    {
        GridNode next;

        // Validates diagonal movement and corner cutting rules
        if (direction % 2 == 1)
        {
            if (!DiagonalAllowed(currentNode, direction))
            {
                return null;
            }

            next = currentNode.Neighbours[direction];
        }
        else
        {
            next = currentNode.Neighbours[direction];

            if (!IsWalkable(next))
            {
                return null;
            }
        }

        if (next == null || !next.m_Walkable)
        {
            return null;
        }

        // Main JPS stopping conditions
        if (next == goal ||
            HasForcedNeighbour(next, direction))
        {
            return next;
        }

        // Diagonal searches must also inspect their
        // horizontal and vertical components
        if (m_AllowDiagonal && direction % 2 == 1)
        {
            GetDiagonalComponents(
                direction,
                out int horizontal,
                out int vertical
            );

            if (Jump(horizontal, next, goal) != null ||
                Jump(vertical, next, goal) != null)
            {
                return next;
            }
        }

        currentNode = next;
    }
}
```

</CodeCollapseSection>

---

### Diagonal Movement and Corner Rules

The pathfinding foundation exposes two movement options:

- `m_AllowDiagonal` determines whether diagonal directions can be considered
- `m_CanCutCorners` determines whether a diagonal move can pass beside blocked adjacent tiles

For diagonal movement, the system checks the two neighbouring horizontal and vertical tiles:

- With corner cutting enabled, at least one adjacent side must be open
- With corner cutting disabled, both adjacent sides must be open

This prevents agents from travelling diagonally through solid corners while still allowing the movement rules to be adjusted for different games.

### Debug Visualisation

An optional debugging mode recolours grid nodes using the algorithm’s open and closed collections. Combined with separate algorithm scenes, this made it possible to inspect:

- Which nodes were discovered.
- Which nodes were fully evaluated.
- The order and direction of search expansion.
- How obstacles changed the resulting route.
- How JPS pruning differed from standard A* exploration.

These visualisations were essential for debugging the algorithms and understanding the practical differences between them beyond the theory.

</CollapseSection>

<CollapseSection
  sectionId="FuzzyBlackboard"
  title="Fuzzy Logic and AI Blackboard"
  icon="◈"
>


**Environment and agent data**  
→ `HeroBlackboard` gathers and normalises information  → `HeroFuzzyEval` evaluates membership curves and weights  → Explore, Combat, Resupply and Panic receive `0–1` scores  → The FSM uses those scores to select a stable behaviour

---

### Centralised AI Blackboard

`HeroBlackboard` provides one location for the information required by the Hero AI, no repeated component or world info search 

It stores:

- Current health & ammunition ratios
- Nearest enemy & its distance
- Number of detected enemies
- Health and ammunition PU positions & whtaher one still exisits
- Cached references to movement, combat and health components
- References to the AI configuration and fuzzy decision profile

---

### Normalising Gameplay Information

Inputs with different units cannot be compared directly. Health, enemy distance and enemy count therefore need to be converted into a consistent `0–1` range.

| Input | Normalised representation | Meaning |
|---|---|---|
| Health | `CurrentHealth / MaxHealth` | `0` is empty; `1` is full health |
| Ammunition | `CurrentAmmo / MaxAmmo` | `0` is empty; `1` is full ammunition |
| Enemy distance | `InverseLerp(minDistance, maxDistance, distance)` | `0` is close; `1` is far away |
| Enemy count | `EnemyCount / MaximumThreatCount` | Approaches `1` as the group becomes more dangerous |
| Pickups | Available or unavailable | Determines whether resupplying is currently possible |

Normalisation allowed the same fuzzy profiles to operate consistently even when the underlying health, ammunition or distance values changed

---

### Membership Curves and Data-Driven Tuning

A `FuzzyDecisionSO` ScriptableObject stores the system’s membership curves, weights and transition thresholds.

The Animation Curves determine how strongly each input belongs to a fuzzy concept:

- **Need Health:** becomes stronger as health decreases
- **Need Ammo:** becomes stronger as ammunition decreases
- **Threat by Distance:** becomes stronger as enemies move closer
- **Threat by Count:** becomes stronger as more enemies are detected

The curves avoid relying entirely on rigid conditions such as "health below exactly 30%." Instead, the importance of a need can increase gradually as the situation changes.

<ProjectMedia
  type="Image"
  src="/Images/AiScenes/FuzzyDecisionSO.png"
  :autoplayInView="true"
  caption="Fuzzy Decision Scriptable Object"
/>

Weights exposed through the ScriptableObject control how strongly each input influences the result. This made it possible to adjust the Hero’s personality and priorities through the Inspector rather than rewriting the evaluation code.

---

### Behaviour Scores

The evaluator produces four competing scores:

| Score | Becomes stronger when |
|---|---|
| **Explore** | Threat is low and the Hero does not urgently need health or ammunition |
| **Combat** | A meaningful threat exists and the Hero is healthy enough to fight |
| **Resupply** | Health or ammunition is low, a relevant pickup exists and the current threat is manageable |
| **Panic** | The Hero has a strong health need while facing a significant threat |

Threat is calculated from both **enemy proximity** and **enemy count**. This allows the Hero to respond differently to one distant enemy, one nearby enemy or a surrounding group.

Resupply is also reduced when threat becomes high, preventing the Hero from blindly moving towards a pickup while in immediate danger.

<CodeCollapseSection title="Fuzzy Behaviour Scoring" icon="⌘">

```csharp
public static HeroFuzzyScores Evaluate(HeroBlackboard bb)
{
    FuzzyDecisionSO profile = bb.m_FuzzyProfile;

    // Convert health and ammo into fuzzy needs
    float healthRatio = Mathf.Clamp01(bb.m_HealthRatio);
    float ammoRatio = Mathf.Clamp01(bb.m_AmmoRatio);

    float needHealth = Mathf.Clamp01(
        profile.needHealthCurve.Evaluate(healthRatio) *
        profile.wHealthNeed
    );

    float needAmmo = Mathf.Clamp01(
        profile.needAmmoCurve.Evaluate(ammoRatio) *
        profile.wAmmoNeed
    );

    // Combine threat from enemy proximity and enemy count
    float distance = bb.m_NearestEnemy != null
        ? bb.m_NearestEnemyDist
        : profile.threatDistMax;

    float distanceT = Mathf.InverseLerp(
        profile.threatDistMin,
        profile.threatDistMax,
        distance
    );

    float threatByDistance = Mathf.Clamp01(
        profile.threatByDistanceCurve.Evaluate(distanceT) *
        profile.wThreatDist
    );

    float countT = Mathf.Clamp01(
        bb.m_EnemyCount / (float)profile.threatCountMax
    );

    float threatByCount = Mathf.Clamp01(
        profile.threatByCountCurve.Evaluate(countT) *
        profile.wThreatCount
    );

    float threat = Mathf.Clamp01(
        threatByDistance + threatByCount
    );

    // Produce the four competing behavioural scores
    float relevantNeed = Mathf.Max(
        bb.m_HasHealthPickup ? needHealth : 0f,
        bb.m_HasAmmoPickup ? needAmmo : 0f
    );

    float resupplySafety =
        1f - threat * profile.resupplyThreatPenalty;

    return new HeroFuzzyScores
    {
        Panic = Mathf.Clamp01(
            needHealth * threat * profile.wPanic
        ),

        Resupply = Mathf.Clamp01(
            relevantNeed * resupplySafety * profile.wResupply
        ),

        Combat = Mathf.Clamp01(
            threat * (1f - needHealth) * profile.wCombat
        ),

        Explore = Mathf.Clamp01(
            (1f - threat) *
            (1f - Mathf.Max(needHealth, needAmmo)) *
            profile.wExplore
        )
    };
}
```

</CodeCollapseSection>

---

### Pickup Tracking and Validation

The Blackboard subscribes to pickup events to receive the current health and ammunition pickup positions. Because the provided event did not identify which pickup had later been removed, I added validation using `Physics2D.OverlapCircle`.

Before the Hero chooses to resupply, the Blackboard confirms that the target pickup still exists. It then prioritises health or ammunition based on the Hero’s current ratios and the configured resource thresholds

---

### Live Score Debugging

During development, I logged the active state alongside all four fuzzy scores and the Blackboard’s current values:

- Explore, Combat, Resupply and Panic scores
- Health and ammunition ratios
- Nearest enemy distance
- Detected enemy count
- Currently selected FSM state


<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/f3_kTxNLUbI?autoplay=1&mute=1&playsinline=1&loop=1&playlist=f3_kTxNLUbI"
    title="Flick & Fetch development footage"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    <strong>Live Fuzzy logic tweaking & it's effect on the AI</strong>
  </p>
</div>

This made it possible to understand why the Hero selected a behaviour and to tune the curves, weights and thresholds using evidence from the running simulation.

The result was a configurable decision layer that could evaluate several changing needs before passing those scores into the Hero’s finite state machine.

</CollapseSection>

<CollapseSection
  sectionId="IntegratedDecisionMaking"
  title="Integrated Decision-Making and Combat AI"
  icon="◆"
>

The final scene combined the individual AI techniques developed throughout the module into a complete combat simulation. The Hero evaluates its current situation, selects a behaviour and activates the appropriate steering and combat systems, while Zombies independently roam, chase and coordinate their attacks.

**Blackboard data**  
→ Fuzzy behaviour scores  
→ Priority-based FSM transitions  
→ State-specific steering and combat  
→ Agent movement and actions

<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/Gjv7jzrydk8?autoplay=1&mute=1&playsinline=1&loop=1&playlist=Gjv7jzrydk8"
    title="Flick & Fetch development footage"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    <strong>Decision Making Scen</strong>
  </p>
</div>

---

### Hero Behaviour States

The Hero’s decision-making is divided into four states:

| State | Purpose | Resulting behaviour |
|---|---|---|
| `Explore` | No immediate threat or urgent resource need | Wanders through the environment |
| `Combat` | A viable enemy threat is present | Approaches, retreats, strafes and fires at the nearest enemy |
| `Resupply` | Health or ammunition is becoming low | Selects and travels towards the most appropriate available pickup |
| `Panic` | Low health is combined with significant danger | Flees from the nearest threat until the situation becomes safer |

Each state is responsible for a clear high level intention. The fuzzy system decides how desirable those intentions are, while the FSM provides stable state changes and the steering system handles movement.

---

### Priority Based Transition Table

I used a transition table instead of placing all state changes inside one large conditional statement.

Each transition contains:

- A starting state | Destination state | Condition Function | Priority | Any State

Transitions are sorted by priority, ensuring that emergency behaviour such as entering `Panic` is evaluated before lower priority decisions.

<CodeCollapseSection title="FSM Transition Table" icon="⌘">

```csharp
private void BuildTransitionTable()
{
    transitions.Clear();

    FuzzyDecisionSO profile = m_Bb.m_FuzzyProfile;

    // Highest priority: Panic may be entered from any state
    transitions.Add(new Transition(
        ANY,
        Mode.Panic,
        () => scores.Panic >= profile.enterPanic,
        0
    ));

    // Leave Panic only after reaching its lower exit threshold
    transitions.Add(new Transition(
        Mode.Panic,
        Mode.Resupply,
        () => scores.Panic <= profile.exitPanic &&
              scores.Resupply >= profile.enterResupply,
        10
    ));

    transitions.Add(new Transition(
        Mode.Panic,
        Mode.Explore,
        () => scores.Panic <= profile.exitPanic &&
              scores.Combat < profile.enterCombat &&
              scores.Resupply < profile.enterResupply,
        12
    ));

    // Normal Explore and Combat transitions
    transitions.Add(new Transition(
        Mode.Explore,
        Mode.Combat,
        () => scores.Combat >= profile.enterCombat,
        21
    ));

    transitions.Add(new Transition(
        Mode.Combat,
        Mode.Explore,
        () => scores.Combat <= profile.exitCombat,
        30
    ));

    transitions.Sort(
        (a, b) => a.Priority.CompareTo(b.Priority)
    );
}
```

```csharp
private Mode GetNextStateFromTable()
{
    for (int i = 0; i < transitions.Count; i++)
    {
        Transition transition = transitions[i];

        if (transition.From != ANY &&
            transition.From != mode)
        {
            continue;
        }

        if (transition.When != null &&
            transition.When())
        {
            return transition.To;
        }
    }

    return mode;
}
```

</CodeCollapseSection>

This structure made transition rules easier to inspect, reprioritise and extend without rewriting the state execution logic

---

### Hysteresis and Stable Decisions

Each behaviour has separate **enter** & **exit** thresholds exposed via `FuzzyDecisionSO` . For example, the Hero might enter Combat when its score reaches `0.45`, but it will not leave until the score falls below `0.30`.

This gap is called **hysteresis**. It prevents the Hero from rapidly switching between states when a score repeatedly moves just above and below one boundary.

<ProjectMedia
  type="Image"
  src="/Images/AiScenes/FuzzyDecisionSO.png"
  :autoplayInView="true"
  caption="Fuzzy Decision Scriptable Object"
/>

---

### Combat Positioning

The Hero calculates its distance from the target and compares it against configurable combat ranges:

- When **too far away**, it approaches the enemy
- When **too close**, it retreats towards its preferred distance
- When near its **optimal range**, it calculates a perpendicular target and strafes around the enemy
- Its Cannon receives the nearest enemy as a target and only fires while the Hero is in Combat

A buffer around the distance boundaries prevents movement from rapidly alternating between approach and retreat.

<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/Gjv7jzrydk8?start=8&autoplay=1&mute=1&playsinline=1&loop=1&playlist=Gjv7jzrydk8"
    title="Flick & Fetch development footage"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    <strong>0:08 - 0:16</strong>
  </p>
</div>

This gives the Hero more believable combat movement than continuously travelling directly towards its opponent.

---

### Resupply and Panic Behaviour

When `Resupply` is selected, the Blackboard chooses a destination based on the Hero’s current needs:

- Health pickups are prioritised when health is low.
- Ammunition pickups are prioritised when ammunition is low.
- The target is validated before movement begins.
- If both resources are available, the more urgent need determines the destination.

The fuzzy evaluator also applies a threat penalty to Resupply. This reduces the chance of the Hero attempting to collect resources while surrounded by enemies.

`Panic` represents a more urgent survival response. When low health and threat produce a high Panic score, the Hero activates its Flee behaviour and moves away from the nearest enemy until the danger score falls below the configured exit threshold.

---

### Zombie Behaviour and Attack Coordination

Zombies use a separate, more direct decision system:

1. Wander when no Hero is inside their chase range.
2. Seek the nearest Hero once one is detected.
3. Attempt a melee attack when within attack range.
4. Use Separation to reduce crowding while chasing.

A shared `ZombieAttackCoordinator` limits how many Zombies can perform an attack simultaneously. Zombies must reserve an attack slot before starting their melee action and release it when the action finishes

<CodeCollapseSection title="Coordinated Zombie Attacks" icon="⌘">

```csharp
// ZombieDecisionMaking (trimmed)
if (distanceToHero <= attackRange &&
    m_Melee != null &&
    m_Coordinator != null)
{
    if (m_Coordinator.TryAcquireAttackSlot())
    {
        m_Melee.TryAttack(
            () => m_Coordinator.ReleaseAttackSlot()
        );
    }

    return;
}
```

```csharp
public bool TryAcquireAttackSlot()
{
    if (m_CurrentAttackers >= maxConcurrentAttackers)
    {
        return false;
    }

    m_CurrentAttackers++;
    return true;
}

public void ReleaseAttackSlot()
{
    m_CurrentAttackers = Mathf.Max(
        0,
        m_CurrentAttackers - 1
    );
}
```

</CodeCollapseSection>

<ProjectMedia
  type="Image"
  src="/Images/AiScenes/ZombieConcurrentATtackers.png"
  :autoplayInView="true"
  caption="Coordinator values in Inspector"
/>

Limiting simultaneous attackers prevented a surrounding group from applying all of its damage at once and created a more controllable combat encounter.

---

### Bringing the Systems Together

The final scene demonstrates how several focused AI systems can combine into more complex behaviour:

- The **Blackboard** gathers the Hero’s current context
- **Fuzzy scoring** measures its competing behavioural needs
- The **FSM** converts those scores into a stable decision
- **Steering behaviours** perform the required movement
- The **Cannon and melee systems** execute combat actions
- The **Zombie coordinator** controls group attack pressure
- **ScriptableObjects** expose the important balancing values

This separation kept sensing, evaluation, decision making and execution understandable while still allowing them to operate as one complete AI system.

</CollapseSection>

## General

<CollapseSection
  sectionId="SteeringMaths"
  title="Steering Behaviours and AI Mathematics"
  icon=""
>

Before building the final decision making system, I implemented a reusable collection of steering behaviours. Each behaviour converts a movement intention into a steering force, allowing multiple behaviours to be activated, weighted and combined by the same movement framework.

### Reusable Steering Framework

Every behaviour inherits from the abstract `SteeringBehaviour` class, which provides:

- An active or inactive state
- A configurable behaviour weight
- Access to the agent’s `MovingEntity`
- Desired velocity and steering-force values
- A shared `CalculateForce()` interface
- Runtime Gizmo debugging

This allowed different movement techniques to be added to an agent as components while sharing the same force generation pipeline

<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/aqc_O2luao8?start=38&autoplay=1&mute=1&playsinline=1&loop=1&playlist=aqc_O2luao8"
    title="Steering Bheaviours full Showcase"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    <strong>0:38 - 2:10 steering beahviour showcase</strong>
  </p>
</div>

| Behaviour | Movement result |
|---|---|
| **Seek** | Accelerates towards a target position |
| **Flee** | Moves away when a threat enters a configurable radius |
| **Arrive** | Approaches a destination and gradually slows inside a stopping radius |
| **Wander** | Selects changing targets on a projected circle to create natural roaming |
| **Pursuit** | Predicts where a moving target will be and travels towards that future position |
| **Evade** | Predicts a threat’s future position and moves away from it |
| **Collision Avoidance** | Uses raycast feelers to detect obstacles and generate an avoidance force |

The behaviours calculate a desired velocity before subtracting the agent’s current velocity. This produces a steering force rather than directly setting the agent’s position.

---

### Predictive Movement and Collision Avoidance

Pursuit and Evade use the distance and combined speeds of the two agents to estimate a prediction time. The target’s velocity is then used to calculate where it is likely to be in the future.

This produces more believable behaviour than moving towards or away from the target’s current position.

Collision Avoidance uses multiple configurable **feelers** projected around the agent’s movement direction. Their lengths increase with the agent’s speed, allowing faster agents to detect obstacles earlier.

When a feeler detects an obstacle, the system selects the closest collision point and generates a force away from it.

<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/aqc_O2luao8?start=88&autoplay=1&mute=1&playsinline=1&loop=1&playlist=aqc_O2luao8"
    title="Flick & Fetch development footage"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    <strong>Collision Avoidance 1:29 - 1:50</strong>
  </p>
</div>

---

### Group and Flocking Behaviours

I also implemented the three core flocking behaviours:

- **Separation:** produces a repulsion force from nearby agents to prevent crowding
- **Cohesion:** calculates the group’s centre and steers towards it
- **Alignment:** averages neighbouring velocities so agents travel in a similar direction

Each behaviour evaluates nearby agents within a configurable radius and field of view. Their forces can then be combined to produce group movement rather than relying on one monolithic flocking script.

<div style="width: 100%; margin: 1.25rem 0;">
  <iframe
    src="https://www.youtube.com/embed/aqc_O2luao8?start=110&autoplay=1&mute=1&playsinline=1&loop=1&playlist=aqc_O2luao8"
    title="Flick & Fetch development footage"
    loading="lazy"
    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px;"
  ></iframe>

  <p style="text-align: center; opacity: 0.8; margin-top: 0.5rem;">
    <strong>Group Movement 1:50 - 2:02</strong>
  </p>
</div>

Because each behaviour has its own weight, the group’s character can be changed through tuning. Stronger Separation creates a loose formation, while stronger Cohesion keeps the group closer together.

---

### Prioritised Force Management

`SteeringBehaviour_Manager` processes active behaviours in list order using a limited force budget.

Each behaviour contributes its force until the configured maximum is reached. If the next force exceeds the remaining budget, it is normalised and truncated to use only the remaining amount.

This allows important behaviours - such as Collision Avoidance - to be placed before lower priority behaviours such as Wander.

<CodeCollapseSection title="Steering Force Accumulation" icon="⌘">

```csharp
public Vector2 GenerateSteeringForce()
{
    Vector2 accumulatedForce = Vector2.zero;
    float remainingForce = m_MaxForce;

    foreach (SteeringBehaviour behaviour
             in m_SteeringBehaviours)
    {
        if (!behaviour.m_Active)
        {
            continue;
        }

        // Each behaviour applies its configured weight
        Vector2 behaviourForce =
            behaviour.CalculateForce();

        float magnitude =
            Maths.Magnitude(behaviourForce);

        if (magnitude > remainingForce)
        {
            behaviourForce =
                Maths.Normalise(behaviourForce) *
                remainingForce;

            accumulatedForce += behaviourForce;
            break;
        }

        accumulatedForce += behaviourForce;
        remainingForce -= magnitude;
    }

    return accumulatedForce;
}
```

</CodeCollapseSection>

The manager can also enable one behaviour exclusively or disable all behaviours, which is used by the higher level decision making system when switching between movement intentions.

---

### AI Mathematics and Debug Visualisation

The steering systems use reusable vector operations including:

- Magnitude and normalisation
- Dot products for directional and field-of-view checks
- Vector rotation for Wander targets, strafing and collision feelers
- Velocity prediction
- Weighted force accumulation

Runtime Gizmos display:

- Desired velocity
- Current velocity
- Final steering direction
- Detection and slowing radii
- Wander circles and selected targets
- Collision avoidance feelers

<ProjectSlideshow :slides="AiScenesDebugVisualised" />


These visualisations made abstract vector calculations visible inside the scene, making it much easier to identify incorrect directions, unsuitable weights and any conflicts between active behaviours.

</CollapseSection>


## Lessons Learned

This project gave me a much deeper understanding of how game AI develops from **vector mathematics and search algorithms** into believable agent behaviour. Implementing A*, Dijkstra and Jump Point Search showed me how algorithm choice, heuristics and movement rules affect both path quality and the amount of work required to find it.

My biggest takeaway was that complex behaviour can emerge by combining focused systems. The **Blackboard gathers context**, **fuzzy logic evaluates competing needs**, the **FSM provides stable decisions**, and **steering behaviours execute them through movement**. Debug visualisation and data driven tuning were essential because believable AI depended as much on iteration & balancing as the underlying code.

