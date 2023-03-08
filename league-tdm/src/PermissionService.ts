import PermissionError from "./error/PermissionError";
import { log } from "../../league-core";
import { ILanguage } from "../../league-lang/language";

export default class PermissionService {
  constructor(readonly lang: ILanguage) {}

  @log
  hasRight(player: PlayerMp, rule: string) {
    if (!rule) {
      throw new PermissionError(rule, player, this.lang)
    }

    return true
  }
}