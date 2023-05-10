import { event, eventable } from "../../../../core/client";
import { toMs } from "../../../../core/src/helpers";
import { Events } from "../../../../core/src/types";
import { Arena, RoundConfig } from "../../../../core/src/types/tdm";
import { ILanguage, Lang } from "../../../../lang/language";
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
    readonly lang: ILanguage
  ) {}

  roundPrepare(arena: Arena) {
    this.show(
      this.lang.get(Lang["tdm.round.arena_prepare_timer"], { arena: arena.code }),
      this.config.prepare,
      'round'
    )
  }

  @event([Events["tdm.round.start"], Events["tdm.round.end"]])
  roundEnd() {
    this.hide('round')
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