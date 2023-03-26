import PermissionError from "./error/PermissionError";
import { ILanguage } from "../../league-lang/language";

export default class PermissionService {
  constructor(readonly lang: ILanguage) {}

  hasRight(player: PlayerMp, rule: string) {
    if (!rule) {
      throw new PermissionError(rule, player, this.lang)
    }

    return true
  }
}