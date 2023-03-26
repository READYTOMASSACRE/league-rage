import { Enviroment, Events } from "../../../league-core/src/types"

export default new class RageAPI {
  private ready: boolean = false
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

  motdClose() {
    mp.trigger(Events["tdm.cef.motd"], false)
  }

  weaponSubmit(weapon?: string) {
    mp.trigger(Events['tdm.weapon.submit'], weapon)
  }

  weaponToggle() {
    mp.trigger(Events['tdm.weapon.toggle'])
  }

  sendReady() {
    if (this.ready) {
      return
    }

    this.ready = true
    mp.trigger(Events["tdm.ui.ready"])
  }
}