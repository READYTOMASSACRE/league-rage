import { command, commandable, event, eventable, logClient } from "../../league-core/client";

@eventable
@commandable
export default class UIService {
  constructor(readonly url: string) {}

  public cef: BrowserMp

  @logClient
  @event("playerReady")
  @command('reload')
  loadCef() {
    if (this.cef) {
      this.cef.destroy()
    }

    this.cef = mp.browsers.new(this.url)

    return this.url
  }
}