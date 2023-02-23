import { log } from "../helpers/decorators/log";

export default class PermissionService {
  @log
  hasRight(player: PlayerMp, rule: string) {
    return true
  }
}