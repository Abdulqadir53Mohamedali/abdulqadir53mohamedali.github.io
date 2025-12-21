export const paintSlides = [
    {
    type: 'video',
    src: '/Videos/Paint/Slideshow/GPNJ.mp4',
    caption: 'Bouncy green paint effect on player ',
    related: [{ label: 'Core Gameplay Loop & Paint Powers', targetId: 'core-loop' }]
  },
    {
    type: 'video',
    src: '/Videos/Paint/Slideshow/PHWN.mp4',
    caption: 'Orange paint phasing interaction on phaseable surface',
    related: [{ label: 'Core Gameplay Loop & Paint Powers', targetId: 'core-loop' }]
  },
    {
    type: 'video',
    src: '/Videos/Paint/Slideshow/SP.mp4',
    caption: 'Spatial partitioning / collider merging for paint decals.',
    related: [{ label: 'Architecture & Performance', targetId: 'arch-perf' }]
  },
    {
    type: 'video',
    src: '/Videos/Paint/Slideshow/CHPN.mp4',
    caption: 'Checkpoint feedback + VFX timing (muted).',
    related: [{ label: 'Level Interaction', targetId: 'level-interaction' },{ label: 'Materials & VFX', targetId: 'materials-vfx' }]
  },


  {
    type: 'image',
    src: '/Images/PlayerPaint.png',
    caption: 'Designer tuning: paint tags/types/materials, rates, pool size.',
    related: [{ label: 'Designer Friendly & Scalable Systems', targetId: 'designer-scalable' }]
  },

] as const

export const DesignPaintSlides = [
  {
        type: 'image',

    src: '/Images/PaintPics/TopHaldPaintGun.png',
    caption: 'HOVER OVER IMAGE AREA TO ZOOM IN ',
    zoomScale: 2.7,        
    hoverPanZoom: true,
    related: [{ label: 'N/A', targetId: '' }]
  },
    {
          type: 'image',
    zoomScale: 2.7,        
    hoverPanZoom: true,
    src:"/Images/PaintPics/BottomHalfPaintGUn.png",
    caption: '',
    related: [{ label: 'N/A', targetId: '' }]
  }

] as const

export const DesignHealthPaintSlides = [
  {
        type: 'image',

  src:"/Images/PaintPics/DestructableWallEvents.png",
  caption: 'C++ events used to handle flash upon damage taken',

  related: [{ label: 'N/A', targetId: '' }]
  },
    {
          type: 'image',

  src:"/Images/PaintPics/healthComponent.png",
    caption: 'Attachable on to anythingn from player - destructable walls ,never needed to duplicate basic health logic again',
    related: [{ label: 'N/A', targetId: '' }]
  }

] as const

export const LevelInteractionTurretButtonSlides = [
      {
    type: 'video',
    src: "/Videos/Paint/DropDowns/ActiovateTurretRespawn.mp4",
    caption: 'Turret button enable',
    related: [{ label: 'N/A', targetId: '' }]
    }, 
          {
    type: 'video',
    src: "/Videos/Paint/DropDowns/TurretDisbaleViaButton.mp4",
    caption: 'Turret button disable',
    related: [{ label: 'N/A', targetId: '' }]
    }, 

] as const


export const splatoonSlides = [
      {
    type: 'video',
    src: '/Videos/Splatoon/Slideshow/SquidWallClimb.mp4',
    caption: 'Squid transform , increased speed and wall traversal available',
    related: [{ label: 'Mechanics', targetId: 'Mechanics-AD' },{ label: 'VFX + Lighting', targetId: 'VFX-Lighting' },{ label: 'Audio', targetId: 'Audio' }]
    }, 
    {
    type: 'video',
    src: '/Videos/Splatoon/Slideshow/SplatoonShootingR.mp4',
    caption: 'Player paint/ink shooting ability',
    related: [{ label: 'Mechanics', targetId: 'Mechanics-AD' },{ label: 'VFX + Lighting', targetId: 'VFX-Lighting' },{ label: 'Audio', targetId: 'Audio' }]
  },

        {
    type: 'video',
    src: '/Videos/Splatoon/Slideshow/DashProper.mp4',
    caption: 'Dash',
    related: [{ label: 'Mechanics', targetId: 'Mechanics-AD' },{ label: 'VFX + Lighting', targetId: 'VFX-Lighting' },{ label: 'Audio', targetId: 'Audio' }]
    },
     {
    type: 'video',
    src: '/Videos/Splatoon/Slideshow/CheckpointInteractSound.mp4',
    caption: 'Checkpoint Enter',
    related: [{ label: 'VFX + Lighting', targetId: 'VFX-Lighting' },{ label: 'Audio', targetId: 'Audio' }]
    }
    

    

] as const

export const FMSlides = [
    {
    type: 'video',
    src: '/Videos/FM/Slideshow/VJH.mp4',
    caption: 'Variable Jump height',
    related: [{ label: 'Forgiveness Mechanics Movement Stack', targetId: 'FmExplantion' },{ label: 'All', targetId: 'M' },]
    }, 

      {
    type: 'video',
    src: '/Videos/FM/Slideshow/JMBF.mp4',
    caption: 'Jump Buffering',
    related: [{ label: 'Forgiveness Mechanics Movement Stack', targetId: 'FmExplantion' },{ label: 'All', targetId: 'M' },]
    }, 

          {
    type: 'video',
    src: '/Videos/FM/Slideshow/SMSOPL.mp4',
    caption: 'Semi-Solid Platforms',
    related: [{ label: 'Forgiveness Mechanics Movement Stack', targetId: 'FmExplantion' },{ label: 'All', targetId: 'M' },]
    }, 
              {
    type: 'video',
    src: '/Videos/FM/Slideshow/CYT.mp4',
    caption: 'Coyote Time',
    related: [{ label: 'Forgiveness Mechanics Movement Stack', targetId: 'FmExplantion' },{ label: 'All', targetId: 'M' },]
    }, 
              {
    type: 'video',
    src: '/Videos/FM/Slideshow/CROL.mp4',
    caption: 'Crouch off ledge',
    related: [{ label: 'Forgiveness Mechanics Movement Stack', targetId: 'FmExplantion' },{ label: 'All', targetId: 'M' },]
    }, 
              {
    type: 'video',
    src: '/Videos/FM/Slideshow/SPAX.mp4',
    caption: 'Speedy Apex',
    related: [{ label: 'Forgiveness Mechanics Movement Stack', targetId: 'FmExplantion' },{ label: 'All', targetId: 'M' },]
    }, 

] as const


export const TopDownSlimeSlides = [
    {
    type: 'video',
    src: '/Videos/TopDownSlime/SlideShow/FirstRoom.mp4',
    caption: 'Light Green Slime Room',
    related: [{ label: 'Small Slime Projectile Debuffs', targetId: 'SmallSlime' },{ label: 'Medium + Boss Combat Loop', targetId: 'Medium&Boss' }]
    }, 

        {
    type: 'video',
    src: '/Videos/TopDownSlime/SlideShow/SecondRoom.mp4',
    caption: 'Dark Blue Slime Room',
    related: [{ label: 'Small Slime Projectile Debuffs', targetId: 'SmallSlime' },{ label: 'Medium + Boss Combat Loop', targetId: 'Medium&Boss' }]
    }, 
        {
    type: 'video',
    src: '/Videos/TopDownSlime/SlideShow/ThirdRoom.mp4',
    caption: 'Turqoise Slime Room',
    related: [{ label: 'Small Slime Projectile Debuffs', targetId: 'SmallSlime' },{ label: 'Medium + Boss Combat Loop', targetId: 'Medium&Boss' }]
    }, 
        {
    type: 'video',
    src: '/Videos/TopDownSlime/SlideShow/FourthRoom.mp4',
    caption: 'Normal Green Slime Room',
    related: [{ label: 'Small Slime Projectile Debuffs', targetId: 'SmallSlime' },{ label: 'Medium + Boss Combat Loop', targetId: 'Medium&Boss' }]
    }

      

] as const


export const TankGameSlides = [
          {
    type: 'video',
    src: '/Videos/TankGame/Slideshow/WeaponShowcase.mp4',
    caption: 'Player Weapon Showcase',
    related: [{ label: 'Weapon Pickups + Firing Feel', targetId: 'Weapons' }]
    },   
  {
    type: 'video',
    src: '/Videos/TankGame/Slideshow/BossEncounter.mp4',
    caption: 'Final Boss Encounter',
    related: [{ label: 'Boss + Commander Design', targetId: 'Boss&Command' }]
    }, 

    {
    type: 'video',
    src: '/Videos/TankGame/Slideshow/RadialBarrel.mp4',
    caption: 'AOE explosive barrels',
    related: [{ label: 'Enviroment Interactables + Hazards', targetId: 'Enviroment&Interactables' }]
    }, 
        {
    type: 'video',
    src: '/Videos/TankGame/lava&Respawn&Turret.mp4',
    caption: 'Checkpoint | Lava | Speed Boost | Damage Taken',
    related: [{ label: 'Enviroment Interactables + Hazards', targetId: 'Enviroment&Interactables' }]
    }, 




      

] as const

export const TankGameDropdownBossSlides = [
          {
    type: 'image',
    src: '/Images/TankGame/Boss1.png',
    caption: 'Boss Player Detect| Hover over image To Zoom',
    zoomScale: 2.3,       
    hoverPanZoom: true, 
    related: [{ label: 'N/A', targetId: '' }]
    },   
              {
    type: 'image',
    src: '/Images/TankGame/Boss2.png',
    caption: 'Boss projectiles & Damage Application | Hover over image To Zoom ',
        zoomScale: 2.9,       
    hoverPanZoom: true, 
    related: [{ label: 'N/A', targetId: '' }]
    },  
              {
    type: 'image',
    src: '/Images/TankGame/Boss3.png',
    caption: 'Boss Attack timers | Aura | Normal | Hover over image To Zoom',
      zoomScale: 2.7,       
    hoverPanZoom: true, 
    related: [{ label: 'N/A', targetId: '' }]
    }


] as const


export const StarWarsDungeonSlides = [
          
            {
    type: 'video',
    src: '/Videos/StarWarsDungeon/Slideshow/ShopCloseUp.mp4',
    caption: 'Dungeon Shop | Re-stock on power ups and Weapons | Start of game purchase first set',
    related: [{ label: 'Shop + Inventory', targetId: 'ShopInventory' }]
    },  
  {
    type: 'video',
    src: '/Videos/StarWarsDungeon/Slideshow/DungeonTraversalSmall.mp4',
    caption: 'Player Movment in Dungeon | Enemies revealed for example purposes ',
    related: [{ label: 'Procedural Dungeon Grid + Encounters', targetId: 'DungeonGrid' }]
    },   
      {
    type: 'image',
    src: '/Images/StarWarsDungeon/DungeonShowcase1.png',
    caption: 'Enemy Postions & enemies within each wave / positon & the coins wworth are procedurally generated for every new run | 1',
    related: [{ label: 'Procedural Dungeon Grid + Encounters', targetId: 'DungeonGrid' },{ label: 'Wave Combat System (Turn-Based + Randomised Enemies)', targetId: 'WaveSystem' }]
    },       {
    type: 'image',
    src: '/Images/StarWarsDungeon/DungeonShowcase.png',
    caption: 'Enemy Postions & enemies within each wave / positon & the coins wworth are procedurally generated for every new run | 1',
    related: [{ label: 'Procedural Dungeon Grid + Encounters', targetId: 'DungeonGrid' },{ label: 'Wave Combat System (Turn-Based + Randomised Enemies)', targetId: 'WaveSystem' }]
    },  
      {
    type: 'video',
    src: '/Videos/StarWarsDungeon/Slideshow/EnemyCombatWave.mp4',
    caption: 'Short exmaple of how combat / enemy encounters look',
    related: [{ label: 'Procedural Dungeon Grid + Encounters', targetId: 'DungeonGrid' }]
    },   
] as const

export const StarWarsDungeonProceduralSlides = [
          
    {
    type: 'image',
    src: '/Images/StarWarsDungeon/DungeonShowcaseNoEnemyDisplayed.png',
    caption: 'When enemies positions not displayed',
    related: [{ label: 'N/A', targetId: '' }]
    },  

        {
    type: 'image',
    src: '/Images/StarWarsDungeon/DungeonShowcase1.png',
    caption: 'When enemies positions displayed',
    related: [{ label: 'N/A', targetId: '' }]
    },  
            {
    type: 'image',
    src: '/Images/StarWarsDungeon/FinisheGame.png',
    caption: 'Upong Reaching Goal / Exit',
    related: [{ label: 'N/A', targetId: '' }]
    },  
  
  
] as const

export const StarWarsDungeonEnemyCombatSlides = [
          
    {
    type: 'image',
    src: '/Images/StarWarsDungeon/UponCombatEnter.png',
    caption: 'Upon Entering Combat',
    related: [{ label: 'N/A', targetId: '' }]
    },  

        {
    type: 'image',
    src: '/Images/StarWarsDungeon/PlayerSelectionOnWeaponAndEnemy.png',
    caption: 'Player Inventory weapon selection & fire',
    related: [{ label: 'N/A', targetId: '' }]
    }, 
                {
    type: 'image',
    src: '/Images/StarWarsDungeon/EnemiesAttacking.png',
    caption: 'Enemy Attacks',
    related: [{ label: 'N/A', targetId: '' }]
    },  
            {
    type: 'image',
    src: '/Images/StarWarsDungeon/EnemyWaveFinished.png',
    caption: 'Enemy Wave Completion',
    related: [{ label: 'N/A', targetId: '' }]
    },  
  
  
] as const
export const StarWarsDungeonShopSlides = [
          
    {
    type: 'image',
    src: '/Images/StarWarsDungeon/ShopStart.png',
    caption: 'Dungeon Shop',
    related: [{ label: 'N/A', targetId: '' }]
    },  

        {
    type: 'image',
    src: '/Images/StarWarsDungeon/Shop1WeaponShowcase.png',
    caption: 'Item Purchase',
    related: [{ label: 'N/A', targetId: '' }]
    }, 
    
        {
    type: 'image',
    src: '/Images/StarWarsDungeon/ItemRefunded.png',
    caption: 'Item Refunded',
    related: [{ label: 'N/A', targetId: '' }]
    }, 
  
] as const


export const OneButtonPrototypeSlides = [
          
    {
    type: 'video',
    src: '/Videos/OneButtonChallenge/Slideshow/WebSling.mp4',
    caption: 'Grapple point swing | Hold space down when close to grapply points in the air',
    related: [{ label: 'One-button Design (Spacebar Rules)', targetId: 'SpacebarRules' },{ label: 'Traversal Toolkit (Double Jump / Swing / Wall Jump)', targetId: 'PlayerToolkit' }]
    },  
    {
    type: 'video',
    src: '/Videos/OneButtonChallenge/Slideshow/EnemyKillMushroom.mp4',
    caption: 'Enemy interaction & Kill',
    related: [{ label: 'Enemy Prototype ( Stomp Kill + Simple PAtrol AI)', targetId: 'EnemyStomp' }]
    },
    {
    type: 'video',
    src: '/Videos/OneButtonChallenge/Slideshow/WallSideToSideJump.mp4',
    caption: 'Wall Jump & Side to Side Jump',
    related: [{ label: 'One-button Design (Spacebar Rules)', targetId: 'SpacebarRules' },{ label: 'Traversal Toolkit (Double Jump / Swing / Wall Jump)', targetId: 'PlayerToolkit' }]
    },      
     {
    type: 'video',
    src: '/Videos/OneButtonChallenge/Slideshow/DoubleJump.mp4',
    caption: 'Double Jump',
    related: [{ label: 'One-button Design (Spacebar Rules)', targetId: 'SpacebarRules' },{ label: 'Traversal Toolkit (Double Jump / Swing / Wall Jump)', targetId: 'PlayerToolkit' }]
    },
] as const