/*
Game Jam mini game
by - blackarck@gmail.com

Libs used: 
-Kontra 
 
=======================================================
INIT KONTRA ENGINE
=======================================================
*/
console.log("Main game starting");
document.addEventListener("DOMContentLoaded", function () {
  //initialize kontra
  let { canvas, context } = kontra.init();
  let {
    init,
    Sprite,
    GameLoop,
    initKeys,
    keyPressed,
    initPointer,
    setImagePath,
    load,
    imageAssets,
    Button,
    collides,
    clamp,
  } = kontra;

  initKeys();
  initPointer();
  setImagePath("assets/img/");
  /* 
=======================================================
ONE TIME VAR INITIALIZATION
=======================================================
*/
  let marioBod;
  let dirx = 0;
  let diry = 0;
  let grid = 3;
  const maxWidth = 500;
  let gravity = 1.5;
  let timer = 0;
  let stairCollission = false;
  //generate the UI

  placeObject();
  /* 
=======================================================
MAIN GAME OBJECT
=======================================================
*/
  let loop = GameLoop({
    fps: 30,
    // create the main game loop
    update: function () {
      timer++;
      checkPlayerJump();
      checkPlayerStairs();
      // update the game state
      if (keyPressed("arrowleft")) {
        // move left
        //console.log("Moving left");
        dirx = -grid;
        diry = 0;
      }
      if (keyPressed("arrowright")) {
        // move left
        // console.log("Moving right");
        dirx = grid;
        diry = 0;
      }
      if (keyPressed("arrowup") && marioBod.is_landed && !stairCollission) {
        // move left
        // console.log("Moving up");

        marioBod.y = marioBod.y - marioBod.speedY;
        marioBod.is_landed = false;
      }

      if (keyPressed("arrowdown") && marioBod.is_landed && !stairCollission) {
        // move left
        //console.log("Moving down");
        marioBod.y = marioBod.y + marioBod.speedY;
        marioBod.is_landed = false;
        dirx = 0;
        diry = grid;
      }

      marioBod.x = marioBod.x + dirx;
      dirx = 0;

      updateKongAnim();
    }, //end of update function
    render: function () {
      //stairs
      stair1.render();
      //platforms
      platforms1.render();
      platforms2.render();
      platforms3.render();
      platforms4.render();
      platforms5.render();

      // render the game state
      marioBod.render();
      kongBoy.render();
    },
  }); //end of game loop
  loop.start(); // start the game

  /* 
=======================================================
Set Started position
=======================================================
*/
  function placeObject() {
    kongBoy = Sprite({
      x: 70, //start pos
      y: 70,
      anchor: { x: 1, y: 1 },
      // required for a rectangle sprite
      width: 40,
      height: 50,
      color: "red",
    });

    marioBod = Sprite({
      x: 50, //start pos
      y: 400,
      anchor: { x: 1, y: 1 },
      ypos: 400,
      // required for a rectangle sprite
      width: 20,
      height: 30,
      color: "blue",
      is_landed: true,
      rotation: 0,
      speedY: 30,
      playerGrav: 1.5,
    });

    clamp(30, 100, marioBod.x);
  }

  platforms1 = Sprite({
    x: 20,
    y: 400,
    width: 500,
    height: 15,
    color: "green",
  });
  platforms2 = Sprite({
    x: 20,
    y: 70,
    width: 500,
    height: 15,
    color: "green",
  });
  platforms3 = Sprite({
    x: 20,
    y: 150,
    width: 500,
    height: 15,
    color: "green",
  });
  platforms4 = Sprite({
    x: 20,
    y: 230,
    width: 500,
    height: 15,
    color: "green",
  });
  platforms5 = Sprite({
    x: 20,
    y: 310,
    width: 500,
    height: 15,
    color: "green",
  });

  stair1 = Sprite({
    x: 400,
    y: 320,
    width: 20,
    height: 80,
    color: "aqua",
  });

  function checkPlatformLand(mariocl, platformcl) {
    if (
      collides(mariocl, platformcl) &&
      (mariocl.y > platformcl.y || mariocl.y < platformcl.y) &&
      !stairCollission
    ) {
      console.log(
        "Collission with platform-" +
          JSON.stringify(platformcl) +
          ", marY-" +
          mariocl.y +
          ",platformy-" +
          platformcl.y
      );
      mariocl.y = platformcl.y;
      mariocl.is_landed = true;
      mariocl.playerGrav = gravity;
    }
  } //end of checkPlatformLand

  function checkPlayerJump() {
    if (marioBod.is_landed == false) {
      //mario boy is in air
      //console.log("Adding gravity");
      marioBod.y += marioBod.playerGrav;
      marioBod.playerGrav += 0.3;
    }
    checkPlatformLand(marioBod, platforms1);
    checkPlatformLand(marioBod, platforms5);

    /*
  if(collides(marioBod, platforms1) && marioBod.y > platforms1.y){
    marioBod.y = marioBod.ypos;
    marioBod.is_landed = true;
    marioBod.playerGrav = gravity;
    // console.log("Marking landing");
  }
 */
    if (marioBod.x < 40) {
      marioBod.x = 40;
      //console.log("Mariobox x is "+ marioBod.x);
    }

    if (marioBod.x > maxWidth) {
      marioBod.x = maxWidth;
      //console.log("Mariobox x is "+ marioBod.x);
    }
  } //end of checkPlayerJump

  function checkPlayerStairs() {
    if (
      collides(marioBod, stair1) &&
      (keyPressed("arrowup") || keyPressed("arrowdown"))
    ) {
      // console.log("collission");
      stairCollission = true;
      marioBod.y = marioBod.y - 1;
      console.log("climbing");
    } else {
      stairCollission = false;
    }
  } //end of function checkPlayerStairs

  function updateKongAnim() {
    // kong animation
    if (timer % 20 == 0) {
      //console.log("every tenth frame "+timer);
      kongBoy.height = 45;
    }
    if (timer % 30 == 0) {
      //console.log("every tenth frame "+timer);
      kongBoy.height = 50;
    }
  }

  /************
 End of document onload
 *************/
});

/* 
=======================================================
Helper functions 
=======================================================
*/

function generateRandomColor() {
  // Generate random values for RGB components (0 to 255)
  var red = Math.floor(Math.random() * 256);
  var green = Math.floor(Math.random() * 256);
  var blue = Math.floor(Math.random() * 256);
  // Combine RGB values into a CSS color string
  var color = "rgb(" + red + "," + green + "," + blue + ")";
  return color;
}
