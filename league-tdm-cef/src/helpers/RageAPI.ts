import { Enviroment, Events } from "../../../league-core/src/types"

export default new class RageAPI {
  private events: Map<string, Function> = new Map()

  subscribe(event: string, component: string, handler: Function) {
    const key = `${event}.${component}`

    if (this.events.has(key)) {
      return
    }

    this.events.set(key, handler)
    mp.events.add(event, handler)
  }

  unsubscribe(event: string, component: string) {
    const key = `${event}.${component}`

    mp.events.remove(event)
    this.events.delete(key)
  }

  chatPush(input: string) {
    mp.trigger(Events['tdm.chat.push'], input, Enviroment.cef)
  }

  chatToggle(toggle: boolean, forceClose?: boolean) {
    mp.trigger(Events['tdm.chat.toggle'], toggle, forceClose)
  }

  weaponSubmit(weapon?: string) {
    mp.trigger(Events['tdm.weapon.submit'], weapon)
  }
}