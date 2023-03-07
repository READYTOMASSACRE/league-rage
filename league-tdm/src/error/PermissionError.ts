import { ILanguage, Lang } from "../../../league-lang"
import BroadCastError from "./BroadCastError"

export default class PermissionError extends BroadCastError {
  constructor(permission: string, player?: PlayerMp | number, lang?: ILanguage) {
    super(
      lang ?
        lang.get(Lang["error.permission.invalid"], { permission }) :
        `Invalid permission ${permission}`,
      player
    )
  }
}