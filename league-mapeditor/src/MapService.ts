import { eventable, event, log } from '../../league-core'
import { Events } from '../../league-core/src/types'

@eventable
export default class MapService {
  @log
  @event(Events['tdm.mapeditor.save'])
  onSave(player: PlayerMp, coords: Array2d[]) {}
}