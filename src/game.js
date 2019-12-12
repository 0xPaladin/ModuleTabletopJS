//boardgame app
import {moduleTabletop as app} from "./moduleTabletop.js"
//main UI
let UI = app.UI.main
UI.title = "Module.Tabletop JS"
//Generators
let GEN = app.gen
//Data 
let DATA = app.data

// TROUBLE ******************************************** 
const TROUBLEACTIONS = ["Build","Convince","Discover","Endure","Fight","Prowl","Research"]
const TROUBLE = {
  rank: 1,
  clock: [4, 0],
  actions: [],
  extras: []
}
GEN.trouble = (T) => {
  T.tmp = Object.keys(TROUBLE)
  Object.assign(T,JSON.parse(JSON.stringify(TROUBLE)))
  //save 
  DATA[T.id] = T
  T.actions = [chance.pickone(TROUBLEACTIONS)]
}

// UI  ********************************************
Vue.component('ui-trouble', {
  props: ['data'],
  template: '#ui-trouble',
  mounted() {
    //console.log(this.data)
  },
  computed: {},
  methods: {
    //controll tick of clock 
    tick (n) {
      let c = this.data.clock
      c[1] += n 
      if(n == 0 && c[1]==1) c[1]=0
      this.data.clock = c.slice()
    },
    //Game logic 
    AI () {
      let R = this.data.rank
      let c = this.data.clock.slice()
      let d = [4,6,8,10,12][R-1]
      let r = chance.rpg("1d"+d)[0]
      let eo = chance.d6()
      //rank
      if(r == d && eo%2 == 1 && R < 5) {
        this.data.rank++
        //give action 
        this.data.actions.push(chance.pickone(TROUBLEACTIONS))
      }
      //split
      if(r == d && eo%2 == 0) {
        //create & add 
        let nT = new app.entities.Cube(UI.components[0])
        //now set rank 
        this.data.rank = nT.rank = R-1 == 0 ? 1 : R-1
        //split time 
        let halfC = c[0]/2 < 3 ? 3 : Math.round(c[0]/2)
        this.data.clock = [halfC,c[1]]
        nT.clock = [c[0]-halfC < 3 ? 3 : c[0]-halfC,0]
      }
      //tick
      if(r == d-1) {
        c[0]++
        this.data.clock = c.slice()
      }
      //reduce 
      if(r == 1) {
        if(c[0]>3 && eo%2 == 1) {
          c[0]--
          this.data.clock = c.slice()
        }
        if(R>1 && eo%2 == 0) this.data.rank--
      }
    },
  }
})

UI.components = [
{
  cid : 0,
  type: "Board",
  title: "Main Map",
  depth: 800,
  width : 528,
  img: "GenMap.png",
},
{
  cid : 1,
  type: "Cube",
  title: "Trouble",
  color: "gray",
  UI: "ui-trouble",
  gen : "trouble"
}, {
  cid : 2,
  type: "Cube",
  title: "Hero",
  color: "darkgreen",
},{
  cid : 3,
  type: "Token",
  title: "Sword",
  img: "winged-sword.png"
},{
  cid : 4,
  type: "Token",
  isHex: true,
  size: 20,
  title: "Green Sword",
  img: "winged-sword-green.png"
},{
  cid : 5,
  type: "Standee",
  title: "Overlord",
  img: "overlord-helm.png"
},
{
  cid : 6,
  type: "Card",
  title: "Ace of Spades",
  depth: 73.1,
  width : 98.5,
  img: "playing-cards.png",
  uv : [0,1/4,1/13,2/4]
},
{
  cid : 7,
  type: "Deck",
  title: "Playing Cards",
  img : "overlord-helm.png",
  cardSize : [73.1,98.5],
  cardImg: "playing-cards.png",
  cards : [
    {
      n : 4,
      title : "Ace of Spades",
      uv : [0,1/4,1/13,2/4]
    },
    {
      n: 5,
      title : "Ace of Diamonds",
      uv : [0,0,1/13,1/4]
    },
    {
      n: 3,
      title : "Jack of Hearts",
      uv : [10/13,2/4,11/13,3/4]
    },
  ]
},
{
  cid : 8,
  type: "Mesh",
  title: "Chess Knight",
  file : "Horse.STL"
},
]
