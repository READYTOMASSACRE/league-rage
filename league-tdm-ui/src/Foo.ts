import {eventable, event, commandable, command} from '../../league-core/client'

@eventable
@commandable
export default class Foo {
  @event("playerSpawn")
  playerJoin(player: PlayerMp) {
    mp.gui.chat.push('Вы зашли на сервер, круто')
  }

  @command("/zxc")
  zxc() {
    mp.gui.chat.push('Typing zxc')
  }
}