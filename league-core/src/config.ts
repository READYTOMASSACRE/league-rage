import { IConfig } from "./types"

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
  return {
    lang: 'ru',
    weaponConfig: {
      ammo: 1,
      slotCount: 3,
      category: {
        melee: [],
        handguns: [],
        submachine: [],
        shotguns: [],
        rifles: [],
        light_rifles: [],
        sniper_rifles: [],
      },
      damage: {
        weapon: {},
        category: {
          melee: 0,
          handguns: 0,
          submachine: 0,
          shotguns: 0,
          rifles: 0,
          light_rifles: 0,
          sniper_rifles: 0,
        },
      },
    },
    ...config,
  }
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
