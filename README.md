[![League](https://i.imgur.com/VHQz6bz.png)](https://discord.gg/5RBfSc3hvE) 
# **League TDM 0.6a**
### Team deathmatch with arenas based on rage.mp multiplayer

---

### Config
**Path: _(%ragefolder%/server-files/conf.json)_**
If parameters doesn't set it will set automatically by **default values**
```js
var c = {
  "welcomeText": "string", // Welcome text is showing when player enter to server
  "motd": "string", // Motd window is showing when player enter to server, available html 
  "lang": "string", // Default language, available: [ru, en, ua], to add new: add new <lang>json file to ./server-files/packages/league-lang/lang folder
  "lobby": [-1026.7474365234375, -364.5588073730469, 36.930908203125], // Lobby with coordinates [x, y, z]
  "cef": "string", // UI cef package, default value: package://league-tdm-cef/index.html
  "team": { // Teams config
    "attackers": {
      "name": "Scourge", // name of team
      "skins": ["u_m_m_jesus_01", "s_m_m_movspace_01"], // skins
      "color": "#f64041", // team color
      "blipColor": 1, // blip color on map
    },
    "defenders": {
      "name": "Sentinel",
      "skins": ["u_m_y_imporage", "s_m_y_mime"],
      "color": "#85abce",
      "blipColor": 2,
    },
    "spectators": {
      "name": "Spectators",
      "skins": ["cs_priest", "csb_vagspeak"],
      "color": "#ffffff",
      "blipColor": 0,
    },
  },
  "weapon": {
    "ammo": 360, // ammo value which been given to player
    "friendlyfire": false, // enable/disable friendlyfire
    "selectTime": 25, // time in seconds when players are available to choose weapon
    "slot": { // slots and categories which can be equipped to slots
      "melee": ["melee"],
      "secondary": ["pistols"],
      "primary": [
        "submachine_guns",
        "shotguns",
        "assault_rifles",
        "light_rifles",
        "sniper_rifles"
      ],
    },
    "category": { // weapon categories
      "melee": ["dagger", "bat", "bottle", "crowbar", "flashlight", "golfclub", "nightstick", "knuckle"],
      "handguns": ["pistol", "combatpistol", "pistol50", "heavypistol", "revolver_mk2"],
      "submachine_guns": ["smg"],
      "shotguns": ["pumpshotgun"],
      "assault_rifles": ["assaultrifle", "carbinerifle", "bullpuprifle", "compactrifle", "gusenberg"],
      "light_rifles": ["musket"],
      "sniper_rifles": ["sniperrifle"],
    },
    "damage": { // custom damage by weapon or category
      "weapon": { // damage by weapon
        "revolver_mk2": 46,
        "musket": 37,
      },
      "category": { // damage by category
        "pistols": 23,
        "submachine_guns": 9,
        "shotguns": 5,
        "assaultrifles": 10,
        "light_rifles": 37,
        "sniper_rifles": 41,
      },
    },
  },
  "round": {
    "prepare": 5, // prepare timer before round starts in seconds
    "timeleft": 300, // round timeleft in seconds
    "watcher": {
      "alive": true, // watcher alive players
    }
  },
  "vote": {
    "arena": 30 // vote timer in seconds for arenas
  },
  "interaction": { // interaction configs
    "selector": { // team selector config
      "cam": {
        "vector": [502.24664306640625, 5611.33544921875, 799.14], // cam position
        "rotation": [0, 0, 0], // rotation
        "fov": 40, // fov distance
        "pointAt": [501.0116271972656, 5593.58935546875, 795.4794921875], // cam looking at
      },
      "ped": {
        "vector": [501.6931457519531, 5603.701171875, 797.9105224609375], // ped position
        "heading": 0, // ped heading
        "dance": "", // not uset at this moment
        "dimension": 0, // ped dimension
      }
    },
  },
  "db": {
    "adapter": "lokijs", // db adapter, available: "lokijs", "mongodb"
    "lokijs": {
      "database": 'league.db', // database name
      "autoload": true,
      "autosave": true,
      "autosaveInterval": 4000,
    },
    "mongodb": {
      "host": "localhost",
      "port": "27017",
      "username": "",
      "password": "",
      "database": "league", // database name
      "logging": true,
      "opts": {
        "tls": boolean,
        "ssl": boolean,
        "connectTimeoutMS": number,
        "socketTimeoutMS": number,
        "maxPoolSize": number,
        "maxConnecting": number,
      }
    }
  },
  "statistic": { // statistic config
    "exp": { // how much exp will be given when
      "kill": 30, 
      "death": 5, 
      "assist": 20,
      "win": 70,
      "hit": 1,
      "damageRecieved": 0,
      "damageDone": 1,
      "expToLvl": 1000, // how much exp need to lvl up
    },
  },
  "effects": {
    "death": 5, // death timer in seconds
  },
  "prefix": "Server", // server prefix name in chat, default "Server"
  "rcon": "", // server rcon password to logging as root, default empty
}
```

***

### Arenas
**Path: _(%ragefolder%/server-files/packages/arenas.json)_**
Example
```js
[
  {
    "id": 0, // arena id by number
    "code": "zero_arena", // arena id by code
    "area": [[-1389.8885498046875, 165.0953826904297], [-1386.8018798828125, 7.266519546508789],
             [-1299.7457275390625, 16.754438400268555], [-1309.6605224609375, 174.69664001464844]], // arena polygon
    "attackers": [[-1367.40576171875, 150.63015747070312, 55.960227966308594]], // spawn attackers points
    "defenders": [[-1350.4813232421875, 17.191625595092773, 53.26210403442383]] // spawn defenders points
  }
]
```