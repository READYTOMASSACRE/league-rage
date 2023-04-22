import { Language } from "../../../../lang/language";
import LanguageService from '../../../../lang'
import { config } from "../../../../core";
import { Lang } from "../../../../lang/language";
import PermissionError from "./PermissionError";

const lang = new Language(LanguageService.get(config.lang))

export default new class ErrorNotifyHandler {
  catch(err: Error) {
    const player = this.ensurePlayer(err)

    if (player && mp.players.exists(player)) {
      const message = this.getMessage(err)

      player.outputChatBox(message)

      if (typeof player.outputPopup === 'function') {
        player.outputPopup(message, 'error')
      }

      const who = `${err.constructor?.name}`.red + ' ' + `${player.name}[${player.id}]`.yellow + ' ' + err.message.underline

      throw new Error(who)
    }

    throw err
  }

  private ensurePlayer(err: any): PlayerMp | undefined {
    return typeof err?.player === 'number' ? mp.players.at(err.player) : err?.player 
  }

  private getMessage(err: any) {
    if (err instanceof PermissionError) {
      return lang.get(Lang["error.permission.invalid"], { permission: err.message })
    }

    return lang.get(<Lang>err.message, err.bindings ?? {})
  }
}

