import { event, eventable, logClient } from "../../league-core/client"
import { Events } from "../../league-core/src/types"
import UIService from "./UIService"

@eventable
export default class ChatService {
    constructor(readonly uiService: UIService) {
        mp.gui.chat.activate(false)
        mp.gui.chat.show(false)

        // RageEnums.Controls.INPUT_MP_TEXT_CHAT_ALL
        mp.keys.bind(245, true, () => {
            this.uiService.cef.call(Events["tdm.chat.toggle"])
        })
    }

    @logClient
    @event(Events["tdm.chat.push"])
    push(msg: string, fromCef?: boolean) {
        fromCef ?
            mp.events.callRemote(Events["tdm.chat.push"], msg) :
            this.uiService.cef.call(Events["tdm.chat.push"], msg)
    }
}