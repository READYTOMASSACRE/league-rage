import PermissionError from "./error/PermissionError";
import { log } from "../../league-core";

export default class PermissionService {
  @log
  hasRight(player: PlayerMp, rule: string) {
    if (!rule) {
      throw new PermissionError(rule, player)
    }

    return true
  }
}