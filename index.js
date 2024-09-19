const FLOOR_HEIGHT = 20;
const FLOOR_WIDTH = 20;
const JUMP_FORCE = 850;
const SPEED = 480;

// initialize context
kaboom({
    width:1000,
    height:500,
});

// load assets
loadSprite("hero", "sprites/soldier.png", {
    sliceX: 3,  // Number of frames in the sprite sheet horizontally
    sliceY: 5,  // Number of frames in the sprite sheet vertically
    anims: {
        idle: { from: 9, to: 12 , loop:true },          // Single frame for idle (frame 0)
        run: { from: 1, to: 7, loop: true },  // Running animation (frames 1 to 3)
        jump: { from: 2, to: 2 },
        shoot : {from:0, to :12 , loop : false}        // Single frame for jumping (frame 2)
    },
});

loadSprite("monster","sprites/monster.png",{
    sliceX:2,
    sliceY:2,
    anims : {
        run: {from:0 , to : 3 , loop : true}
    }
});
loadSprite("explosion", "sprites/explosion.png", {
    sliceX: 3,  // number of frames in the sprite sheet horizontally
    sliceY: 3,  // number of frames in the sprite sheet vertically (usually 1)
    anims: {
        explode: {
            from: 0,
            to: 7,   // adjust according to the number of frames
            speed: 10,  // speed of the animation
            loop: false,
        }
    }
});

loadSprite("bullet","sprites/bullet.png")

loadSound("explosion" ,"sounds/explosion.mp3")
loadSound("swordhit" , "sounds/sword-hit.mp3")
loadSound("youlose" , "sounds/you-lose.mp3")
loadSprite("background", "sprites/ourbackground.png");
/*loadSprite("cloud","sprites/cloud.png")

 */
scene("game", () => {
    // define gravity
    setGravity(1600);  
    // adding background
    add([
        sprite("background"),
        pos(0, 0),
        scale(width()/800, height()/400) // Adjust the scale as needed
    ]); 
    // add a game object to screen
    const player = add([
        // list of components
        sprite("hero"),
        pos(50, 400),
        scale(.2),
        area(),
        body(),
        "hero",
    ]);
    player.play("idle")
/*     player.play('run')
 */    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);

    add([
        rect(FLOOR_WIDTH, height()),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);



    onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump(400);
        }
    });
    
    // Move left
    onKeyDown("left", () => {
        player.move(-SPEED, 0);
        if (player.isGrounded()) {
            player.scale.x = -.2  // Flip the sprite to face left
        }
    });
    
    // Move right
    onKeyDown("right", () => {
        player.move(SPEED, 0);
        if (player.isGrounded()) {
            player.scale.x = .2; // Face the sprite to the right
        }
    }) 
    // shooting bullets

    onKeyPress("s" , () => {
        player.play("shoot")
        ShootBullets(1000)
    })
    onClick(() => {
        player.play("shoot")
        ShootBullets(1000)
    })

    function spawnMonsters() {
        const monster = add([
            sprite('monster' , {anim : "run"}),
            area(),
            opacity(1),
            scale(rand(0.1 , 0.2)),
            outline(1),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            move(LEFT, rand(SPEED , SPEED+500)),
            "monsters",
        ]);
        // wait a random amount of time to spawn next tree
        wait(rand(0.5, 1), spawnMonsters);

    }
    spawnMonsters()

    function ShootBullets(bulletspeed) {
        const bullet = add([
            sprite('bullet'),
            area(),
            opacity(1),
            scale(0.05),
            outline(1),
            color(255,255,255),
            pos(player.pos.x+50 , player.pos.y+40),
            anchor("botright"),
            move(RIGHT, bulletspeed),
            "bullet",
        ]);
        // wait a random amount of time to spawn next tree
        /* wait(rand(0.1, 0.2), ShootBullets); */

    }

    
    onCollide("bullet", "monsters", (bullet, monster) => {
        destroy(bullet);
        destroy(monster);
    
        // Use the custom kaboom
        shake(6)
        play("explosion");
    });
    onCollide("monsters" , "hero" , (monster, hero) =>{
        score-=500;
        player.color = rgb(255,0,0)
        play("swordhit")
        wait(0.5, () => {
            player.color = rgb(255, 255, 255); // Revert to original color after 1 second
        });
        shake(30);
        if (score < 0) {
            play("youlose")
            go("lose",score)
        }
    })

    
    // start spawning trees

    // spawning dogs

    // lose if player collides with any game obj with tag "tree"
    // keep track of score
    add([
        text("health is :"),
        pos(24,24)
    ])
    add([
        text("press S or click to shoot"),
        pos(24 , 72),
        scale(0.5)
    ])
    let score = 0;

    const scoreLabel = add([
        text(score),
        pos(240, 24),
    ]);
        // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    }); 

    

});

scene("lose", (score) => {

    add([
        sprite("hero",{anim:"shoot"}),
        pos(width() / 1-400, height() / 1 - 200),
        scale(1),
        anchor("center"),
    ]);

    // display score
    add([
        text("YOU LOSE "),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

    add([
        text("CLICK AT SPACE TO RESART"),
        pos(width() / 2, height() / 2 + 140),
        scale(1),
        anchor("center"),
    ]);
    add([
        rect(500, 50), // Rectangle size (width, height)
        pos(width() / 4, height() / 2 + 170),
        color(0, 0, 0), 
    ])
    add([
        text("made by @radhouaneblilita"),
        pos(width() / 2, height() / 2 + 200),
        scale(.9),
        anchor("center"),
    ]);

    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

}); 

go("game");

