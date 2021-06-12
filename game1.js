let config={
    type: Phaser.CANVAS,
    physics:{
        default: 'arcade',
        arcade:{
            gravity:{
                y: 1000,
            },
            debug:false,
        },
    },
    scale:{
        mode: Phaser.Scale.FIT,
        width: 900,
        height: 500,
    },
    backgroundColor: 0x4CBDBD,
    scene:{
        preload: preload,
        create: create,
        update: update,
    }
};

let game =  new Phaser.Game(config);
let player_config={
    player_speed: 150,
    player_jump: -500,
}

function preload(){
    this.load.image("ground","assets/img_ground_top.png");
    this.load.image("background","assets/img_background.png");
    this.load.image("fruit","assets/img_fruit.png");
    this.load.image("ray","assets/img_ray.png");
    this.load.image("tree","assets/img_tree.png");

    this.load.image("fullscreen","assets/img_fullscreen.png");
    //this.load.image("player","assets/img_face.png");
    this.load.spritesheet("player","assets/img_player.png",{frameWidth: 32, frameHeight: 48});
}

function create(){
      W= game.config.width;
      H= game.config.height;
      // Background of the game.
      let background=this.add.sprite(0,0,"background");
      background.displayWidth=W;
      background.setOrigin(0,0);

      let rays=[];
      for(let i=-10;i<=10;i++)
      {
          let ray=this.add.sprite(W/2,H-100,'ray');
           ray.displayHeight=1.2*H;
           ray.setOrigin(0.5,1);
           ray.alpha=0.2;
           ray.angle=i*20;
         //  ray.depth=-1;
           rays.push(ray);
      }
      this.tweens.add({
          targets: rays,
          props: {
              angle:{
                  value: "+=20"
              },
          },
          duration: 8000,
          repeat: -1,
      });


      let tree=this.add.sprite(100,H-139,"tree");
      tree.setScale(0.2);


      let tree1=this.add.sprite(350,H-154,"tree");
      tree1.setScale(0.35);

      let tree2=this.add.sprite(800,H-145,"tree");
      tree2.setScale(0.3);

      // shifted below background statements as it was overlapping with the background.
      // Or we can put up a statement background.depth=-1 this will keep the background to the back only.
      let ground=this.add.tileSprite(0,H-100,W,100,"ground");
      ground.setOrigin(0,0);
      // adding physics to the ground
      this.physics.add.existing(ground);
      ground.body.allowGravity=false;
      ground.body.immovable=true;  // more like adding mass to the ground
      //console.log(ground);   
      




      // putting up the player on canvas.
      this.player=this.physics.add.sprite(100,100,"player",4);
      //this.player.setScale(0.1);
      this.player.setOrigin(0,0);
      this.player.setBounce(0.5);  // 0.5 means everytime the bounce would be reduced by 0.5 so if we keep 1 it'll keep on jumping infinite times.
      // adding a collision detector
      this.physics.add.collider(ground,this.player);
      this.cursors = this.input.keyboard.createCursorKeys();
      this.anims.create({
          key: 'left',
          frames: this.anims.generateFrameNumbers('player',{start:0,end:3}),
          frameRate: 10,
          repeat: -1,
      });
      this.anims.create({
        key: 'center',
        frames: this.anims.generateFrameNumbers('player',{start:4,end:4}),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player',{start:5,end:8}),
        frameRate: 10,
        repeat: -1,
    });

    let fruits= this.physics.add.group({
          key: "fruit",
          repeat: 7,
          setScale:{x:0.2,y:0.2},
          setXY: {x:50,y:0,stepX:100}
      });
      this.physics.add.collider(ground,fruits);
        //fruits.setBounce(0.5);
    fruits.children.iterate(function (f){
        f.setBounce(Phaser.Math.FloatBetween(0.4,0.7))
    });


    let other_ground= this.physics.add.staticGroup();
    other_ground.create(600,310,"ground").setScale(2,0.5).refreshBody();
    other_ground.create(-40,310,"ground").setScale(2,0.5).refreshBody();
    other_ground.create(300,210,"ground").setScale(2,0.4).refreshBody();
    this.physics.add.collider(other_ground,fruits);
    //other_ground.add(fruits);
    // ALTERNATE: -
    // let other_ground= this.physics.add.staticGroup({
    //     key: "ground",
    //     repeat: 4,
    //     setScale:{x:0.6,y:0.6},
    //     setXY: {x:580,y:300,stepX:50,}
    // });
    // ALTERNATE : -
    // let other_ground= this.physics.add.Group({
    //     key: "ground",
    //     repeat: 4,
    //     setScale:{x:0.6,y:0.6},
    //     setXY: {x:580,y:300,stepX:50,}
    // });
    // other_ground.children.iterate(function (f){
    //     f.body.allowGravity=false,
    //     f.body.immovable=true;
    // });

    this.physics.add.collider(other_ground,this.player);

    this.physics.add.overlap(this.player,fruits,eat_fruit,null,this);
    this.player.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);

    this.cameras.main.startFollow(this.player,true,true);
    //this.cameras.main.setZoom(1.5);
    
    font={
		font: "bold 15px roboto",
		align: "center",
		color: "yellow",
	}
	this.gametext=this.add.text(W-100,10,"by Teletubby",font);
    //console.log(this.gametext);
    
    var button = this.add.image(800-16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();

        button.on('pointerup', function () {

            if (this.scale.isFullscreen)
            {
                button.setFrame(0);

                this.scale.stopFullscreen();
            }
            else
            {
                button.setFrame(1);

                this.scale.startFullscreen();
            }

        }, this);
        button.setScale(0.1);
        button.setPosition(65,10);
}

function update(){

    if(this.cursors.left.isDown)
    {
        this.player.setVelocityX(-player_config.player_speed);
        this.player.anims.play('left',true);
    }
    else if(this.cursors.right.isDown)
    {
        this.player.setVelocityX(player_config.player_speed);
        this.player.anims.play('right',true);
    }
    else 
    {
        this.player.setVelocityX(0);
        this.player.anims.play('center',true);
    }
    if(this.cursors.up.isDown && this.player.body.touching.down)
    this.player.setVelocityY(player_config.player_jump);
}


function eat_fruit(player,fruits)
{
    fruits.disableBody(true,true);
}