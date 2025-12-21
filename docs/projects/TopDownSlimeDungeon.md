---
layout: doc
---
<script setup lang="ts">
import { TopDownSlimeSlides } from '../.vitepress/theme/data/projectSlides'
</script>

<ProjectHero
  title="Top-Down Slime Dungeon"
  role="Solo Programmer"
  tools="C#,Unity Visual Studio 2022"
/>

## Overview
::: tip Context
This project was a university assigment , 8 weeks , we were given a 2D Top-down character framework, and other than some specfics given the freedom to use external assets and create enemies and objectives etc. Using external slime assets I created a 4 room slime dungeon, each room with their own unique slimes ( small , medium , boss)
:::
<ProjectSlideshow :slides="TopDownSlimeSlides" />

<div class="project-overview">

A **4-room top-down dungeon** built around **readable combat pressure** and **simple, distinct enemy mechanics**.

### Core systems
- **Room-based combat loop:** clear a room → manage pressure → defeat the **boss** to progress.
- Enemy tier design:
  - **Small slimes** = *mechanic carriers* via **projectile debuffs**  
  - **Medium slimes** = *pressure amplifiers* with **close-range punish tools**  
  - **Boss slime** = *room controller* via **trap spawning** + keeps encounters active
- Player kit:
  - **Damage projectile** (main DPS)  
  - **Knockback projectile** (space control / reset)  
  - **Heal** (cooldown-based sustain)  
  - **Dash** (enhanced mobility)  
  - **Lure ability** (decoy that **redirects aggro** for repositioning / safe healing)
- **Progression + scoring:** enemies drop **score on kill**, rewarding clean clears and good routing.

### Debuff variety (small slime projectiles)
- **Input Inversion:** 
- **Freeze:** 
- **Slow:** 
- **Poison (DoT):** 
</div>

## Highlights
<!-- <CollapseSection title="Room Design + Slime Progression (4 Rooms)" icon="□">
</CollapseSection> -->

<CollapseSection sectionId = "SmallSlime" title="Small Slime Projectile Debuffs (Freeze / Slow / Poison / Invert)" icon="□">

Each small slime fires a unique projectile that applies a **short, readable debuff**. These are designed to create quick “oh no” moments that force different reactions.

**Debuff types**
- **Input Inversion (Light Green):** briefly flips movement input to disrupt dodging + positioning.
- **Freeze (Dark blue):** locks the player for a short time (strongest effect, shortest window).
- **Slow (Turqoise):** reduces movement speed heavily , making spacing mistakes more punishing.
- **Poison (DoT | Normal Green):** damage over time that pressures healing and safer routing.

Below is the **Poison projectile → DoT coroutine** flow. The projectile script (`SmallSlimeGreenProjectile`) applies the effect, while `HealthManager` owns the ticking damage logic:

<CodeCollapseSection title="Code snippet example from project" icon="□">

```csharp
// SmallSlimeGreenProjectile.cs (Poison)
public class SmallSlimeGreenProjectile : MonoBehaviour
{
    private float m_damage = 5f;
    private float m_dmgTickRate = 0.3f;
    private int m_maxTicks = 4;

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (!collision.CompareTag("Player"))
            return;

        var health = collision.GetComponent<HealthManager>();
        if (health != null)
            health.ApplyDamageOverTime(m_damage, m_dmgTickRate, m_maxTicks);

        Destroy(gameObject);
    }
}
```
```csharp
// HealthManager.cs (DoT owner)
public void ApplyDamageOverTime(float damage, float tickRate, int maxTicks)
{
    StartCoroutine(Damage(damage, tickRate, maxTicks));
}

private IEnumerator Damage(float damage, float tickRate, int maxTicks)
{
    for (int i = 0; i < maxTicks; i++)
    {
        if (this == null) yield break;
        TakeDamage(damage);
        yield return new WaitForSeconds(tickRate);
    }
}
```
</CodeCollapseSection>

  <ProjectMedia
    type="image"
    src="/Images/TopDownSlime/SmallSlimeWithProjectile.png"
    caption=""
  />

  **Why it works**
    - The player is reacting to **different movement problems** (control loss, speed loss, time pressure), not just losing HP.
    - Durations are kept **short**, and effects are made **visually obvious** so the player instantly understands what happened.

</CollapseSection>


<CollapseSection title="Player Kit + Lure Ability (Crowd Control)" icon="□">

**Player tools**
- **Fire Damage projectile:** main attack for normal slimes & boss damage.
- **Knockback projectile:** creates space when the player gets too crowded.
- **Heal:** cooldown-controlled in `HealthManager`.
- **Dash:** limited by stamina to prevent infinite disengage.

**Standout mechanic — Lure**
- Spawns a **mushroom decoy** with particle VFX that **pulls enemy aggro**.
- While active, enemies focus the lure instead of the player, giving a **tactical reset** to heal, reposition, or burst down priority targets.



<ProjectMedia
  type="image"
  src="/Images/TopDownSlime/PlayerArsenal.png"
  caption=""
/>
<ProjectMedia
  type="video"
  src="/Videos/TopDownSlime/KnockbackProjectile.mp4"
  :autoplayInView="true"
  caption="Knockback Projectile"
/>
<CodeCollapseSection title="Knockback Code snippet" icon="□">

```csharp
// KnockbackProjectile.cs (core idea)
private void OnTriggerEnter2D(Collider2D collision)
{
    if (collision.CompareTag("Wall")) { Destroy(gameObject); return; }

    Slime slime = collision.GetComponent<Slime>();
    if (slime == null) { Destroy(gameObject, 2f); return; }

    Vector2 dir = (slime.transform.position - transform.position).normalized;
    slime.Knockback(dir, m_KnockbackForce);
    Destroy(gameObject);
}
```
</CodeCollapseSection>

<ProjectMedia
  type="image"
  src="/Images/TopDownSlime/EnemyLure.png"
  caption=""
/>

**The lure is split into two responsibilities:**
- `LureSpawner`: cooldown + spawn + waypoint assignment
- `LureMonster`: movement between waypoints + lifetime + collision damage

<CodeCollapseSection title="Lure code snippet" icon="□">

```csharp
// LureSpawner.cs
public class LureSpawner : MonoBehaviour
{
    public GameObject m_lurePrefab;
    public Transform m_waypointA, m_waypointB;
    public float m_spawnCooldown = 30f;

    private bool m_isCooldownActive = false;
    private GameObject m_activeLure;

    void Update()
    {
        if (!m_isCooldownActive && Input.GetKeyDown(KeyCode.Alpha4))
            SpawnLure();
    }

    void SpawnLure()
    {
        Vector2 spawnPos = Vector2.Lerp(m_waypointA.position, m_waypointB.position, Random.Range(0f, 1f));
        if (m_activeLure != null) Destroy(m_activeLure);

        m_activeLure = Instantiate(m_lurePrefab, spawnPos, Quaternion.identity);

        var lure = m_activeLure.GetComponent<LureMonster>();
        if (lure == null) { Destroy(m_activeLure); return; }

        lure.m_waypointA = m_waypointA;
        lure.m_waypointB = m_waypointB;

        StartCoroutine(StartCooldown());
    }

    IEnumerator StartCooldown()
    {
        m_isCooldownActive = true;
        yield return new WaitForSeconds(m_spawnCooldown);
        m_isCooldownActive = false;
    }
}
```
**Why it’s good technically**

- A Clear split between “ability ownership” (LureSpawner) and “actor behaviour” (LureMonster).

- It is using a coroutine for cooldown so timing isn’t scattered across logic.

- Defensive checks prevent broken prefabs from lingering.
</CodeCollapseSection>

</CollapseSection>

<CollapseSection sectionId = "Medium&Boss"title="Medium + Boss Combat Loop" icon="□">

- **Medium slimes:**  
  **Spin** applies continuous damage pressure, while **Chomp** punishes close-range mistakes with burst damage.
<ProjectMedia
  type="image"
  src="/Images/TopDownSlime/MediumSlimeAttacks.png"
  caption=""
/>

- **Boss slimes:**  
  Bosses Stationary with a large health bar, focused on **trap spawning** and keeping the room dangerous until the boss is defeated.

<ProjectMedia
  type="image"
  src="/Images/TopDownSlime/BossSlimeTraps.png"
  caption=""
/>

- **Pressure rule:**  
`RoomSpawner` keeps a target population alive and uses `m_kingSlime.OnBossDeath` event to shut everything down cleanly.
</CollapseSection>
<!-- npm run docs:dev -->