import { DbAdapter, IConfig } from "./types"
import deepmerge from 'deepmerge'
import { Category as WeaponCategory } from "./types/weapon"
import { TextStyle } from "./types/ui"

class Config {
  constructor(readonly _c: Partial<IConfig>) {}

  get(_path: string, o: any = {}, first: boolean = true): any {
    o = first ? this._c : o

    const [key, ...path] = _path.split('.')
    const target = o?.[key]

    if (!path.length) {
        return target        
    }

    return this.get(path.join(''), target, false)
  }
}

const prepareConfig = (config: Partial<IConfig>): IConfig => {
  const defaultTextStyle: TextStyle = {
    font: 4,
    centre: false,
    scale: [0.5, 0.5],
    color: [255, 255, 255, 255],
    outline: false
  }

  const defaultConfig: IConfig = {
    name: '',
    gamemode: '',
    lang: 'ru',
    lobby: [-1026.7474365234375, -364.5588073730469, 36.930908203125],
    cef: "package://league-tdm-cef/index.html",
    team: {
      attackers: {
        name: "Scourge",
        skins: ["u_m_m_jesus_01", "s_m_m_movspace_01"],
        color: "#f64041",
      },
      defenders: {
        name: "Sentinel",
        skins: ["u_m_y_imporage", "s_m_y_mime"],
        color: "#85abce",
      },
      spectators: {
        name: "Spectators",
        skins: ["cs_priest", "csb_vagspeak"],
        color: "#ffffff"
      },
    },
    weapon: {
      ammo: 360,
      friendlyfire: true,
      selectTime: 25,
      slot: {
        melee: [WeaponCategory.melee],
        secondary: [WeaponCategory.handguns],
        primary: [
          WeaponCategory.submachine,
          WeaponCategory.shotguns,
          WeaponCategory.rifles,
          WeaponCategory.light_rifles,
          WeaponCategory.sniper_rifles
        ],
      },
      category: {
        [WeaponCategory.melee]: ["dagger", "bat", "bottle", "crowbar", "flashlight", "golfclub", "nightstick", "knuckle"],
        [WeaponCategory.handguns]: ["pistol", "combatpistol", "pistol50", "heavypistol", "revolver_mk2"],
        [WeaponCategory.submachine]: ["smg"],
        [WeaponCategory.shotguns]: ["pumpshotgun", "musket"],
        [WeaponCategory.rifles]: ["assaultrifle", "carbinerifle", "bullpuprifle", "compactrifle"],
        [WeaponCategory.light_rifles]: ["gusenberg"],
        [WeaponCategory.sniper_rifles]: ["sniperrifle"],
      },
      damage: {
        weapon: {
          revolver_mk2: 46,
          musket: 37,
        },
        category: {
          handguns: 13,
          submachine: 9,
          shotguns: 5,
          rifles: 10,
          light_rifles: 10,
          sniper_rifles: 41,
        },
      },
    },
    round: {
      prepare: 5,
      timeleft: 300,
      watcher: {
        alive: false,
      }
    },
    vote: {
      arena: 30
    },
    hud: {
      roundStart: {
        textElement: {
          text: 'Arena is starting',
          position: [0.5, 0.5],
          style: {
            ...defaultTextStyle,
            scale: [0.6, 0.6],
          }
        },
        alive: 5,
        radius: { current: 0, step: 0.1, max: 50 },
        angle: { current: 0, step: 0.25 },
        zOffset: { current: 0, step: 0.05, max: 50 }
      },
      damage: {
        alive: 3,
        textElement: {
          text: '',
          style: {...defaultTextStyle}
        },
      },
      nametag: {
        alive: 0,
        textElement: {
          text: '',
          style: {...defaultTextStyle},
        },
        health: {
          width: 0.06,
          height: 0.0105,
          border: 0.0030,
          gradient: {
            full: [69, 243, 25],
            empty: [226, 14, 15],
          },
        },
      }
    },
    interaction: {
      selector: {
        cam: {
          vector: [502.24664306640625, 5611.33544921875, 799.14],
          rotation: [0, 0, 0],
          fov: 40,
          pointAt: [501.0116271972656, 5593.58935546875, 795.4794921875],
        },
        ped: {
          vector: [501.6931457519531, 5603.701171875, 797.9105224609375],
          heading: 0,
          dance: "",
          dimension: 0,
        }
      },
    },
    db: {
      adapter: DbAdapter.lowdb,
    },
  }

  return deepmerge(defaultConfig, config, {arrayMerge: (_, source) => source})
}
const createConfig = () => {
  return new Proxy(new Config(prepareConfig((mp as any).config)), {
      get<C extends Config, K extends keyof IConfig>(target: C, key: K) {
          if (target._c?.[key]) {
              return target._c?.[key]
          }

          return target[key as keyof IConfig]
      }
  }) as Config & IConfig
}

export default createConfig()
