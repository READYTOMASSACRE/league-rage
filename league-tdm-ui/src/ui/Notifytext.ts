import { event, eventable, logClient } from "../../../league-core/client";
import { toMs } from "../../../league-core/src/helpers";
import { Events } from "../../../league-core/src/types";
import { RoundConfig } from "../../../league-core/src/types/tdm";
import { ILanguage, Lang } from "../../../league-lang/language";
import RoundService from "../RoundService";
import UIService from "../UIService";

@eventable
export default class NotifyText {
  private items: Record<string, [string, string, number]> = {}
  private timeout: number = 0
  private tickMs = 500

  constructor(
    readonly config: RoundConfig,
    readonly uiService: UIService,
    readonly roundService: RoundService,
    readonly lang: ILanguage
  ) {}

  @logClient
  @event(Events["tdm.round.prepare"])
  roundPrepare(id: number) {
    const arena = this.roundService.getArenaById(id)

    this.show(
      this.lang.get(Lang["tdm.round.arena_prepare_timer"], { arena: arena.code }),
      this.config.prepare,
      'arena'
    )
  }

  @event([Events["tdm.round.start"], Events["tdm.round.end"]])
  roundEnd() {
    this.hide('arena')
  }

  @event(Events["tdm.notify.text"])
  text(message: string, alive: number, component: string, template: string = 'default', keepAlive: boolean = false) {
    const [,,end] = this.items[component] || []

    this.show(
      message,
      alive,
      component,
      template,
      keepAlive ? end : undefined
    )
  }

  @event(Events["tdm.notify.stop"])
  stop(component: string) {
    this.hide(component)
  }

  @logClient
  private show(text: string, alive: number, component: string, template: string = 'default', end?: number) {
    this.items[component] = [text, template, typeof end !== 'undefined' ? end : toMs(alive) + Date.now() + this.tickMs]
    this.tick()
  }

  private hide(component: string) {
    if (component) {
      delete this.items[component]
      this.tick()
    }
  }

  private get data(): [string, string, number, string][] {
    return Object
      .entries(this.items)
      .map(([component, [text, template, end]]) => {
        const timeleft = end - Date.now()
        const seconds = timeleft > 0 ? Math.floor(timeleft / 1000) : 0

        return [text.replace('%s', String(seconds)), template, end, component]
      })
  }

  private broadcast() {
    this.uiService.cef.call(Events["tdm.notify.text"], this.data)
  }

  private tick() {
    clearTimeout(this.timeout)

    if (!this.data.length) {
      return this.broadcast()
    }

    for (const [,, end, component] of this.data) {
      if (end - Date.now() < 0) {
        delete this.items[component]
      }
    }

    this.broadcast()
    this.timeout = setTimeout(() => this.tick(), this.tickMs)
  }
}