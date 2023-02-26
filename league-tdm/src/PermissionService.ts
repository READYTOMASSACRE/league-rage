import PermissionError from "./error/PermissionError";
import { log } from "../../core/server";

export default class PermissionService {
  @log
  hasRight(player: PlayerMp, rule: string) {
    if (!rule) {
      throw new PermissionError(rule, player)
    }

    return true
  }
}