/* 
UI 
*/
const UI = (app)=>{
  // Get the canvas element 
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas,true);
  // Generate the BABYLON 3D engine

  /******* Add the create scene function ******/
  var createScene = function() {
    app.activeMesh = []

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    // Parameters: alpha, beta, radius, target position, scene
    var camera = new BABYLON.ArcRotateCamera("Camera",0,0,10,new BABYLON.Vector3(0,0,0),scene);
    camera.setPosition(new BABYLON.Vector3(20,200,400));

    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.lowerRadiusLimit = 150;

    // Light
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, -1, 0), scene);
    light1.intensity = 0.5;

    var pl = new BABYLON.PointLight("pl", BABYLON.Vector3.Zero(), scene);
    pl.intensity = 0.5;
    // Ground
    var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene, false);
    var groundMaterial = new BABYLON.StandardMaterial("ground",scene);
    groundMaterial.specularColor = BABYLON.Color3.Gray();
    ground.material = groundMaterial;

    var startingPoint;
    var currentMesh;

    var getGroundPosition = function(evt) {
      // Use a predicate to get position on the ground
      var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function(mesh) {
        return mesh == ground;
      });
      if (pickinfo.hit) {
        return pickinfo.pickedPoint;
      }

      return null;
    }

    var intersectHeight = function (mesh) {
      return Object.values(app.activeComponents).filter(m => {
        return m.id != mesh.id && mesh.intersectsMesh(m)
      }).reduce((max,m)=>{
        let bb = m.getBoundingInfo();
        let delta = bb.maximum.y - bb.minimum.y
        if(delta>max) max = delta
        return max
      },0) 
    }

    var onPointerDown = function(evt) {
      if (evt.button !== 0) {
        return;
      }

      // check if we are under a mesh
      var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function(mesh) {
        return mesh !== ground;
      });
      if (pickInfo.hit) {
        app.UI.main.motile = null 
        currentMesh = pickInfo.pickedMesh;
        startingPoint = getGroundPosition(evt);

        if (startingPoint) {
          // we need to disconnect camera from canvas
          setTimeout(function() {
            camera.detachControl(canvas);
          }, 0);
        }
      }
    }

    var onPointerUp = function() {
      if (startingPoint) {
        camera.attachControl(canvas);
        startingPoint = null;
        
        //check for UI 
        if(currentMesh.metadata) {
          app.UI.main.motile = currentMesh.metadata
        }

        //check for intersection - increase height
        let newHeight = intersectHeight(currentMesh)
        let baseHeight = currentMesh.metadata.baseHeight
        if(currentMesh.metadata.type != "Board"){
          currentMesh.position.y = baseHeight + newHeight
        }
        else {
          currentMesh.position.y = baseHeight
        }

        return;
      }
    }

    var onPointerMove = function(evt) {
      if (!startingPoint) {
        return;
      }

      var current = getGroundPosition(evt);

      if (!current) {
        return;
      }

      var diff = current.subtract(startingPoint);
      currentMesh.position.addInPlace(diff);
            
      startingPoint = current;

    }

    canvas.addEventListener("pointerdown", onPointerDown, false);
    canvas.addEventListener("pointerup", onPointerUp, false);
    canvas.addEventListener("pointermove", onPointerMove, false);

    scene.onDispose = function() {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointermove", onPointerMove);
    }

    return scene;
  };
  /******* End of the create scene function ******/

  var scene = app.sceen = createScene();
  //Call the createScene function
  const clearMesh = ()=>{
    app.activeMesh.forEach(m=>{
      m.dispose()
    }
    )
  }

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function() {
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function() {
    engine.resize();
  });

  //Download function for export 
  function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  //creates the VUE js instance
  app.UI.main = new Vue({
    el: '#ui-main',
    data: {
      title :"BoardgameEngine",
      components : [],
      cid : 0,
      motile : null,
      showInfo : false,
      showMove : false,
      move : {
        y:0,
        r:0,
      },
      dice : "",
      roll : [],
    },
    mounted() {
      this.now = Date.now() / 1000
    },
    computed: {
      cTitles () {
        return this.components.map(c => c.type+" - "+c.title)
      },
      canDiscard () {
        if(this.motile.type == "Card" && this.motile.deck) return true
        return false 
      },
      motileUI () {  
        if(!this.motile || !this.motile.UI) return null
        return this.motile.UI
      },
      sum () {
        return this.roll.reduce((sum,val) => val+=sum,0)
      }
    },
    methods: {
      addComponent () {
        let C = this.components[this.cid]
        //create & add 
        return new app.entities[C.type](C)
      },
      doMove(what){
        let radians = Math.PI/180 
        if(what == "r") this.motile.mesh.rotation.y += this.move.r * radians  
      },
      rollDice () {
        if(this.dice.length == 0 || !this.dice.includes("d")) return
        let dS = this.dice.split(",") 
        let r = dS.reduce((all,d)=> {
          all.push(...chance.rpg(d))
          return all 
        },[])
        //sort 
        this.roll = r.sort().slice()
      },
      //discard from deck
      discard () {
        this.motile.discard()
        this.dispose()
      },
      closeMotile () {
        this.motile = null
      },
      //remove the trouble from board 
      dispose() {
        this.motile.dispose()
        this.motile = null
      },
      //save
      save () {
        app.save()
      },
      //export
      exportData () {
        let id = app.games.current
        //cycle through all components and save
        let AC = app.activeComponents
        let d = []
        for(let x in AC){
          d.push(AC[x].metadata.save())
        }
        download(id+"-save.txt",JSON.stringify(d))
      },
      //reset all data 
      reset() {
        app.reset()
      }
    }
  })

}

export {UI}
