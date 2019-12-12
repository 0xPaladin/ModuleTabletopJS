//Basic Board Game entities
const COLORS = {
  "aliceblue": "#f0f8ff",
  "antiquewhite": "#faebd7",
  "aqua": "#00ffff",
  "aquamarine": "#7fffd4",
  "azure": "#f0ffff",
  "beige": "#f5f5dc",
  "bisque": "#ffe4c4",
  "black": "#000000",
  "blanchedalmond": "#ffebcd",
  "blue": "#0000ff",
  "blueviolet": "#8a2be2",
  "brown": "#a52a2a",
  "burlywood": "#deb887",
  "cadetblue": "#5f9ea0",
  "chartreuse": "#7fff00",
  "chocolate": "#d2691e",
  "coral": "#ff7f50",
  "cornflowerblue": "#6495ed",
  "cornsilk": "#fff8dc",
  "crimson": "#dc143c",
  "cyan": "#00ffff",
  "darkblue": "#00008b",
  "darkcyan": "#008b8b",
  "darkgoldenrod": "#b8860b",
  "darkgray": "#a9a9a9",
  "darkgreen": "#006400",
  "darkgrey": "#a9a9a9",
  "darkkhaki": "#bdb76b",
  "darkmagenta": "#8b008b",
  "darkolivegreen": "#556b2f",
  "darkorange": "#ff8c00",
  "darkorchid": "#9932cc",
  "darkred": "#8b0000",
  "darksalmon": "#e9967a",
  "darkseagreen": "#8fbc8f",
  "darkslateblue": "#483d8b",
  "darkslategray": "#2f4f4f",
  "darkslategrey": "#2f4f4f",
  "darkturquoise": "#00ced1",
  "darkviolet": "#9400d3",
  "deeppink": "#ff1493",
  "deepskyblue": "#00bfff",
  "dimgray": "#696969",
  "dimgrey": "#696969",
  "dodgerblue": "#1e90ff",
  "firebrick": "#b22222",
  "floralwhite": "#fffaf0",
  "forestgreen": "#228b22",
  "fuchsia": "#ff00ff",
  "gainsboro": "#dcdcdc",
  "ghostwhite": "#f8f8ff",
  "goldenrod": "#daa520",
  "gold": "#ffd700",
  "gray": "#808080",
  "green": "#008000",
  "greenyellow": "#adff2f",
  "grey": "#808080",
  "honeydew": "#f0fff0",
  "hotpink": "#ff69b4",
  "indianred": "#cd5c5c",
  "indigo": "#4b0082",
  "ivory": "#fffff0",
  "khaki": "#f0e68c",
  "lavenderblush": "#fff0f5",
  "lavender": "#e6e6fa",
  "lawngreen": "#7cfc00",
  "lemonchiffon": "#fffacd",
  "lightblue": "#add8e6",
  "lightcoral": "#f08080",
  "lightcyan": "#e0ffff",
  "lightgoldenrodyellow": "#fafad2",
  "lightgray": "#d3d3d3",
  "lightgreen": "#90ee90",
  "lightgrey": "#d3d3d3",
  "lightpink": "#ffb6c1",
  "lightsalmon": "#ffa07a",
  "lightseagreen": "#20b2aa",
  "lightskyblue": "#87cefa",
  "lightslategray": "#778899",
  "lightslategrey": "#778899",
  "lightsteelblue": "#b0c4de",
  "lightyellow": "#ffffe0",
  "lime": "#00ff00",
  "limegreen": "#32cd32",
  "linen": "#faf0e6",
  "magenta": "#ff00ff",
  "maroon": "#800000",
  "mediumaquamarine": "#66cdaa",
  "mediumblue": "#0000cd",
  "mediumorchid": "#ba55d3",
  "mediumpurple": "#9370db",
  "mediumseagreen": "#3cb371",
  "mediumslateblue": "#7b68ee",
  "mediumspringgreen": "#00fa9a",
  "mediumturquoise": "#48d1cc",
  "mediumvioletred": "#c71585",
  "midnightblue": "#191970",
  "mintcream": "#f5fffa",
  "mistyrose": "#ffe4e1",
  "moccasin": "#ffe4b5",
  "navajowhite": "#ffdead",
  "navy": "#000080",
  "oldlace": "#fdf5e6",
  "olive": "#808000",
  "olivedrab": "#6b8e23",
  "orange": "#ffa500",
  "orangered": "#ff4500",
  "orchid": "#da70d6",
  "palegoldenrod": "#eee8aa",
  "palegreen": "#98fb98",
  "paleturquoise": "#afeeee",
  "palevioletred": "#db7093",
  "papayawhip": "#ffefd5",
  "peachpuff": "#ffdab9",
  "peru": "#cd853f",
  "pink": "#ffc0cb",
  "plum": "#dda0dd",
  "powderblue": "#b0e0e6",
  "purple": "#800080",
  "rebeccapurple": "#663399",
  "red": "#ff0000",
  "rosybrown": "#bc8f8f",
  "royalblue": "#4169e1",
  "saddlebrown": "#8b4513",
  "salmon": "#fa8072",
  "sandybrown": "#f4a460",
  "seagreen": "#2e8b57",
  "seashell": "#fff5ee",
  "sienna": "#a0522d",
  "silver": "#c0c0c0",
  "skyblue": "#87ceeb",
  "slateblue": "#6a5acd",
  "slategray": "#708090",
  "slategrey": "#708090",
  "snow": "#fffafa",
  "springgreen": "#00ff7f",
  "steelblue": "#4682b4",
  "tan": "#d2b48c",
  "teal": "#008080",
  "thistle": "#d8bfd8",
  "tomato": "#ff6347",
  "turquoise": "#40e0d0",
  "violet": "#ee82ee",
  "wheat": "#f5deb3",
  "white": "#ffffff",
  "whitesmoke": "#f5f5f5",
  "yellow": "#ffff00",
  "yellowgreen": "#9acd32"
}

var loadPromise = async(root, file, scene)=>{
    return new Promise((res,rej)=>{
        BABYLON.SceneLoader.LoadAssetContainer(root, file, scene, function (container) {
            res(container)
        });
    })
}

const Entities = (app) => {
  let DATA = app.data
  let AC = app.activeComponents = {}
  app.entities = {}
  let scene = app.scene

  var intersection = function (mesh) {
      return Object.values(app.activeComponents).filter(m => {
        return m.id != mesh.id && mesh.intersectsMesh(m)
      }) 
    }

  //dispose of an entity - remove the 3D object and the data 
  app.dispose = (id) => {
    let m = AC[id]
    //dispose 
    m.dispose()
    //delete
    delete AC[id]
    if(DATA[id]) {
      delete DATA[id]
    }
  }

  //Class Structure
  class Motile {
    constructor(id) {
      //for tracking
      this.id = id || chance.hash()
      this._save = ["id","type","cid"]
    }
    get component () { return this.cid != null ? app.UI.main.components[this.cid] : {}}
    get title () { return this.component.title || ""}
    get color () { return this.component.color || "gray"}
    get UI () { return this.component.UI || null}
    get gen () { return this.component.gen || null}
    get size () { return this.component.size || 10}
    get height () { return this.component.height || (this.type =="Standee" ? 20 : 10)}
    get width () { return this.component.width || (this.type =="Standee" ? 20 : 10)}
    get depth () { return this.component.depth || 10}
    get isHex () { return this.component.isHex || false }
    get img () { return this.component.img || null }
    get file () { return this.component.file || null }
    get uv () { return this.component.uv || [0,1,1,0] }
    get cardSize () { return this.component.cardSize || [10,10]}
    get cardImg () { return this.component.cardImg || null}
    get cards () { return this.component.cards || []}
    add () {}
    dispose () {
      app.dispose(this.id)
    }
    save () {
      let d = {}
      //loop through
      this._save.forEach(id => d[id] = this[id])
      //add position / rotation
      d.p = this.mesh.position
      d.rotation = this.mesh.rotation
      //add gen data 
      if(this.gen && this.tmp){
        this.tmp.forEach(id => d[id] = this[id])
      } 
      return d 
    }
  }

  class Cube extends Motile {
    constructor(data) {
      // Call super
      super(data.id)
      this.cid = data.cid
      //set cube specific 
      this.type = "Cube"
      this.baseHeight = this.size/2
      //if gen 
      if(this.gen) app.gen[this.gen](this)
      //what data to save / load 
      this._save.forEach(did => {
        if(did=="id" && !data.id) return
        if(Object.keys(data).includes(did)) this[did] = data[did]
      })
      //add 
      this.add()
    }
    add() {
      let color = COLORS[this.color]
      let material = new BABYLON.StandardMaterial("matl-"+this.id,scene)
      material.diffuseColor = new BABYLON.Color3.FromHexString(color)
      material.specularColor = new BABYLON.Color3.FromHexString(color)
      material.emissiveColor = BABYLON.Color3.FromHexString(color)
      //mesh
      let mesh = BABYLON.Mesh.CreateBox("cube-"+this.id, this.size, scene)
      mesh.material = material
      mesh.position.x = 0
      mesh.position.y += this.baseHeight
      //metadata 
      this.mesh = mesh
      mesh.metadata = this 
      //add to active mesh
      app.activeComponents[this.id] = mesh
    }
  }
  app.entities.Cube = Cube

  class Token extends Motile {
    constructor(data) {
      // Call super
      super(data.id)
      this.cid = data.cid
      //set token specific 
      this.type = "Token"
      this.baseHeight = 1
      //if gen 
      if(data.gen) app.gen[data.gen](this)
      //what data to save / load 
      this._save.forEach(did => {
        if(did=="id" && !data.id) return
        if(Object.keys(data).includes(did)) this[did] = data[did]
      })
      //add 
      this.add()
    }
    add() {
      //setup material 
      //material 
      let material = new BABYLON.StandardMaterial("matl-"+this.id,scene)
      material.diffuseTexture = new BABYLON.Texture("./tokens/"+this.img, scene)
      //faces 
      var faceUV = [];
      faceUV[0] =	new BABYLON.Vector4(0, 0, 0, 0) // bottom
      faceUV[1] =	new BABYLON.Vector4(0, 0, 0, 0) // sides
      faceUV[2] = new BABYLON.Vector4(...this.uv) // top
      //mesh 
      let tessellation = this.isHex ? 6 : 24
      let token = BABYLON.MeshBuilder.CreateCylinder("token-"+this.id, {height:0.2, tessellation, diameter: this.size, faceUV}, scene)
      token.material = material
      token.position.x = 0
      token.position.y += this.baseHeight
      //metadata 
      this.mesh = token 
      token.metadata = this 
      //add to active mesh
      app.activeComponents[this.id] = token
    }
  }
  app.entities.Token = Token

  class Standee extends Motile {
    constructor(data) {
      // Call super
      super(data.id)
      this.cid = data.cid
      //set specific 
      this.type = "Standee"
      //sizing is different 
      this.baseHeight = this.height/2
      // flip V for back 
      this.uvf = this.uv
      let uvb = this.uvf.slice()   
      this.uvb = [uvb[0],uvb[3],uvb[2],uvb[1]]
      //if gen 
      if(data.gen) app.gen[data.gen](this)
      //what data to save / load 
      this._save.forEach(did => {
        if(did=="id" && !data.id) return
        if(Object.keys(data).includes(did)) this[did] = data[did]
      })
      //add 
      this.add()
    }
    add() {
      //setup material 
      //material - get the image
      let material = new BABYLON.StandardMaterial("matl-"+this.id,scene)
      material.diffuseTexture = new BABYLON.Texture("./standee/"+this.img, scene)
      //faces 
      // front / back are 1 and 0, the rest will be unused 
      var faceUV = new Array(6)
      for (var i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(0,0,0,0)
      }
      faceUV[0] = new BABYLON.Vector4(...this.uvf) // front
      faceUV[1] = new BABYLON.Vector4(...this.uvb) // back
      //mesh 
      let standee = BABYLON.MeshBuilder.CreateBox("standee-"+this.id, {height:this.height, width:this.width, faceUV}, scene)
      standee.material = material
      standee.position.x = 0
      standee.position.y += this.baseHeight
      //metadata 
      this.mesh = standee 
      standee.metadata = this 
      //add to active mesh
      app.activeComponents[this.id] = standee
    }
  }
  app.entities.Standee = Standee

  class Board extends Motile {
    constructor(data) {
      // Call super
      super(data.id)
      this.cid = data.cid
      //set specific 
      this.type = "Board"
      //sizing is different 
      this.baseHeight = 1/2
      //uv is different 
      this._uv = data.uv || [0,0,1,1] 
      //if gen 
      if(data.gen) app.gen[data.gen](this)
      //what data to save / load 
      this._save.forEach(did => {
        if(did=="id" && !data.id) return
        if(Object.keys(data).includes(did)) this[did] = data[did]
      })
      //add 
      this.add()
    }
    add() {
      //setup material 
      //material - get the image
      let material = new BABYLON.StandardMaterial("matl-"+this.id,scene)
      material.diffuseTexture = new BABYLON.Texture("./boards/"+this.img, scene)
      //faces 
      // top is 4, the rest will be unused 
      var faceUV = new Array(6)
      for (var i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(0,0,0,0)
      }
      faceUV[4] = new BABYLON.Vector4(...this._uv)
      //mesh 
      let mesh = BABYLON.MeshBuilder.CreateBox("board-"+this.id, {height:1,depth:this.depth, width:this.width, faceUV}, scene)
      mesh.material = material
      mesh.position.x = 0
      mesh.position.y += this.baseHeight
      //rotate 
      mesh.rotation.y -= Math.PI/2
      //metadata 
      this.mesh = mesh 
      mesh.metadata = this 
      //add to active mesh
      app.activeComponents[this.id] = mesh
      //check for intersection 
      intersection(mesh).forEach(m => {
        //check for tokens 
        if(["Token","Card"].includes(m.metadata.type)) m.position.y += 1
      })
    }
  }
  app.entities.Board = Board

  class Card extends Motile {
    constructor(data) {
      // Call super
      super(data.id)
      this.cid = data.cid
      //set specific 
      this.type = "Card"
      this.baseHeight = 1
      this.deck = null
      //if gen 
      if(data.gen) app.gen[data.gen](this)
      //what data to save / load 
      this._save.push("deck")
      this._save.forEach(did => {
        if(did=="id" && !data.id) return
        if(Object.keys(data).includes(did)) this[did] = data[did]
      })
      //add 
      this.add()
    }
    get deckData () {
      if(!this.deck) return null
      let di = this.deck.split(".")
      let deck = app.activeComponents[di[0]].metadata
      return {
        ci : di[1],
        deck,
        card : deck.cards[di[1]]
      }
    }
    get title () {
      return this.deck ? this.deckData.card.title : this.component.title
    }
    get _depth () {
      return this.deck ? this.deckData.deck.cardSize[0] : this.component.depth
    }
    get _width () {
      return this.deck ? this.deckData.deck.cardSize[1] : this.component.width
    }
    get _img () {
      return this.deck ? this.deckData.card.img || this.deckData.deck.cardImg : this.img
    }
    get _uv () {
      return this.deck ? this.deckData.card.uv || [0,0,1,1] : this.uv || [0,0,1,1]
    }
    discard () {
      let DD = this.deckData
      DD.deck.discard.push(DD.ci)
    }
    add() {
      //setup material 
      //material - get the image
      let material = new BABYLON.StandardMaterial("matl-"+this.id,scene)
      material.diffuseTexture = new BABYLON.Texture("./cards/"+this._img, scene)
      //faces 
      // top is 4, the rest will be unused 
      var faceUV = new Array(6)
      for (var i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(0,0,0,0)
      }
      faceUV[4] = new BABYLON.Vector4(...this._uv)
      //mesh 
      let mesh = BABYLON.MeshBuilder.CreateBox("board-"+this.id, {height:0.2,depth:this._depth, width:this._width, faceUV}, scene)
      mesh.material = material
      mesh.position.x = 0
      mesh.position.y += this.baseHeight
      //rotate 
      mesh.rotation.y -= Math.PI/2
      //metadata 
      this.mesh = mesh 
      mesh.metadata = this 
      //add to active mesh
      app.activeComponents[this.id] = mesh
    }
  }
  app.entities.Card = Card

  class Deck extends Motile {
    constructor(data) {
      // Call super
      super(data.id)
      this.cid = data.cid
      //set specific 
      this.type = "Deck"
      //sizing is different 
      this._depth = this.cardSize[0]  // x
      this._width = this.cardSize[1] //y
      this.baseHeight = 15
      //insure uv
      this._uv = data.uv || [0,0,1,1] 
      //create deck based on cards
      this.deck = this.cards.reduce((deck,c,j)=>{
        for(let i =0; i < c.n; i++){
          deck.push(j)
        }
        return deck 
      },[])
      //shuffle 
      this.deck = chance.shuffle(this.deck)
      //discard 
      this.discard = []
      //if gen 
      if(data.gen) app.gen[data.gen](this)
      //what data to load / save 
      this._save.push("deck","discard")
      this._save.forEach(did => {
        if(did=="id" && !data.id) return
        if(Object.keys(data).includes(did)) this[did] = data[did]
      })
      //add 
      this.add()
    }
    add() {
      //setup material 
      //material - get the image
      let material = new BABYLON.StandardMaterial("matl-"+this.id,scene)
      material.diffuseTexture = new BABYLON.Texture("./cards/"+this.img, scene)
      //faces 
      // top is 4, the rest will be unused 
      var faceUV = new Array(6)
      for (var i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(0,0,0,0)
      }
      faceUV[4] = new BABYLON.Vector4(...this._uv)
      //mesh 
      let mesh = BABYLON.MeshBuilder.CreateBox("deck-"+this.id, {height:this.baseHeight*2,depth:this._depth, width:this._width, faceUV}, scene)
      mesh.material = material
      mesh.position.x = 0
      mesh.position.y += this.baseHeight
      //rotate 
      mesh.rotation.y -= Math.PI/2
      //metadata 
      this.mesh = mesh 
      mesh.metadata = this 
      //add to active mesh
      app.activeComponents[this.id] = mesh
    }
    shuffle () {
      let discard = this.discard.map(Number)
      let all = this.deck.concat(discard)
      this.deck = chance.shuffle(all)
    }
    draw () {
      let deck = this.id+"."+this.deck[0]
      //load card 
      new app.entities.Card({deck})
      //remove 
      this.deck.shift()
    }
  }
  app.entities.Deck = Deck

  class Mesh extends Motile {
    constructor(data) {
      // Call super
      super(data.id)
      this.cid = data.cid
      //set specific 
      this.type = "Mesh"
      //sizing is different 
      this.baseHeight = 0
      //if gen 
      if(data.gen) app.gen[data.gen](this)
      //what data to load / save 
      this._save.forEach(did => {
        if(did=="id" && !data.id) return
        if(Object.keys(data).includes(did)) this[did] = data[did]
      })
      //add 
      this.add(data)
    }
    add(data) {
      let color = COLORS[this.color]
      let material = new BABYLON.StandardMaterial("matl-"+this.id,scene)
      material.diffuseColor = new BABYLON.Color3.FromHexString(color)
      material.specularColor = new BABYLON.Color3.FromHexString(color)
      material.emissiveColor = BABYLON.Color3.FromHexString(color)
      // The first parameter can be used to specify which mesh to import. Here we import all meshes
      BABYLON.SceneLoader.LoadAssetContainer("./mesh/", this.file, scene, (container) => {
        let mesh = container.meshes[0]
        var materials = container.materials
        mesh.material = material
        //position
        mesh.position.x = 0
        mesh.position.y += this.baseHeight
        //rotate 
        mesh.rotation.y -= Math.PI/2
        //see if data exists
        if(data.p){
          mesh.position = new BABYLON.Vector3(data.p.x,data.p.y,data.p.z)
          mesh.rotation = new BABYLON.Vector3(data.rotation.x,data.rotation.y,data.rotation.z) 
        }
        //metadata 
        this.mesh = mesh 
        mesh.metadata = this 
        //add to active mesh
        app.activeComponents[this.id] = mesh
        // Adds all elements to the scene
        container.addAllToScene();
      })
    }
  }
  app.entities.Mesh = Mesh 
}

export {Entities}