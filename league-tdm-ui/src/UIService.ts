import { event, eventable, logClient } from "../../league-core/client";

@eventable
export default class UIService {
  constructor(readonly url: string) {}

  public cef: BrowserMp

  @logClient
  @event("playerReady")
  loadCef() {
    if (this.cef) {
      this.cef.destroy()
    }

    this.cef = mp.browsers.new(this.url)
  }
}