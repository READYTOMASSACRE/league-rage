import { command } from "../../helpers/decorators/command";
import { commandable } from "../../helpers/decorators/commandable";
import { eventable } from "../../helpers/decorators/eventable";
import PermissionError from "./PermissionError";
import PermissionService from "./PermissionService";
import RoundService from "./RoundService";

@eventable
@commandable
export default class TdmService {
  constructor(
    readonly roundService: RoundService,
    readonly permissionService: PermissionService
  ) {}

  @command(['start', 'arena', 'a'], {desc: 'Usage /{{cmdName}} <id> - starts new round in id arena'})
  start(player: PlayerMp, fullText: string, description: string, id?: string) {
    if (!this.permissionService.hasRight(player, 'tdm.start')) {
      throw new PermissionError('tdm.start', player)
    }


    if (!id) {
      return player.outputChatBox(description)
    }

    return this.roundService.start(player, id)
  }

  @command(['stop', 's'], {desc: 'Usage /{{cmdName}} - stop arena'})
  stop(player: PlayerMp, fullText: string, description: string) {
    if (!this.permissionService.hasRight(player, 'tdm.stop')) {
      throw new PermissionError('tdm.stop', player)
    }

    return this.roundService.stop(player)
  }
}