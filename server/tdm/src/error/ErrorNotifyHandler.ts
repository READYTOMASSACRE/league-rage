import { ILanguage, Language } from "../../../../lang/language";
import LanguageService from '../../../../lang'
import { PermissionError, config } from "../../../../core";
import { Lang } from "../../../../lang/language";

export default new class ErrorNotifyHandler {
  lang: ILanguage = new Language(<Record<Lang, string>>{})

  constructor() {
    this.load()
  }
  
  async load() {
    this.lang.change(await LanguageService.get(config.lang))
  }
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
      return this.lang.get(Lang["error.permission.invalid"], { permission: err.message })
    }

    return this.lang.get(<Lang>err.message, err.bindings ?? {})
  }
}

