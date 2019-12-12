//chance
import "../lib/chance.min.js"
//localforage 
import "../lib/localforage.1.7.1.min.js";
//Save db for Indexed DB - localforage
const DB = localforage.createInstance({
  name: "ModuleTabletopDB",
  storeName: "ModuleTabletopDB"
})
//Entities
import {Entities} from "./entities.js"
//UI 
import {UI} from "./UI.js"

//generic application 
const app = {
  DB,
  UI: {},
  gen : {},
  _components: {},
  get components () { return this._components },
  set components (c) { 
    this._components = c 
    this.UI.main.components = Object.entries(this._components).slice()
  },
  addComponent (id,c) {
    this._components[id] = c 
    //add to UI
    this.UI.main.components = Object.entries(this._components).slice()
  },
  data : {},
  games: {},
  save() {
    DB.setItem('games', this.games)
    let id = this.games.current
    //cycle through all components and save
    let AC = this.activeComponents
    let d = []
    for(let x in AC){
      d.push(AC[x].metadata.save())
    }
    DB.setItem("data."+id, d)
  },
  newGame(id) {
    app.games.current = id
    app.games.all = [id]
  },
  load() {
    let UI = this.UI.main
    let id = this.games.current
    DB.getItem('data.'+id).then(data => {
      if(!data) return
      data.forEach(d => {
        //create & add 
        let e = new app.entities[d.type](d)
        if(e.mesh) {
          e.mesh.position = new BABYLON.Vector3(d.p.x,d.p.y,d.p.z)
          e.mesh.rotation = new BABYLON.Vector3(d.rotation.x,d.rotation.y,d.rotation.z) 
        }
        //check for tmp 
        if(e.tmp){
          e.tmp.forEach(did => e[did] = d[did])
        }
        //apply state 
      })
    })
  },
  reset() {
    let id = this.games.current
    let i = this.games.all.indexOf(id)
    this.games.all.splice(i, 1)
    this.games.current = null
    DB.setItem('games', this.games)
    DB.removeItem("data."+id).then(()=>{
      window.location = ""
    })
  }
}
Entities(app)
UI(app)

//games 
DB.getItem('games').then(val=>{
  //create
  if (!val) {
    let id = chance.hash()
    app.newGame(id)
  }//load the game 
  else {
    app.games = val
    if (!app.games.current) {
      //no current game - try to load 
      if (app.games.all.length > 0) {
        app.games.current = app.games.all[0]
      } else {
        let id = chance.hash()
        app.games.current = id
        app.games.all = [id]
      }
    }
    app.load()
  }
}
)

//Timer
let step = 0
setInterval(()=>{
  let UI = app.UI.main
  //step 
  step++
  //save every second
  if(step%5==0) {
    //app.save()
  }
}
, 200)

export {app as moduleTabletop}