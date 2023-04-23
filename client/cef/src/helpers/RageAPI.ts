import { Enviroment, Events } from "../../../../core/src/types"
import { ListRequest } from "../../../../core/src/types/statistic"
import { ILanguage, Lang, Language } from '../../../../lang/language'
import cefLog from "./cefLog"

export default new class RageAPI {
  private ready: boolean = false
  private events: Map<string, Function> = new Map()
  public lang: ILanguage

  constructor() {
    this.lang = new Language(<Record<Lang, string>>{})
  }

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

  panelClose() {
    mp.trigger(Events["tdm.cef.panel"], false)
  }

  panelRequest(...args: any[]) {
    mp.trigger(Events["tdm.cef.panel"], true, ...args)
  }

  matchRequest({
    limit = 20,
    offset = 0,
    dateFrom,
    dateTo
  }: ListRequest = {}) {
    mp.trigger(Events["tdm.cef.match.request"], limit, offset, dateFrom, dateTo)
  }

  voteArenaRequest(id: string | number) {
    mp.trigger(Events["tdm.cef.vote.arena_request"], id)
  }

  sendReady() {
    if (this.ready) {
      return
    }

    this.ready = true
    mp.trigger(Events["tdm.ui.ready"])
  }
}