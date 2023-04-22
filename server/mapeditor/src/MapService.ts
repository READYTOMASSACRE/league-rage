import { eventable, event, log } from '../../../core'
import { Events } from '../../../core/src/types'

@eventable
export default class MapService {
  @log
  @event(Events['tdm.mapeditor.save'])
  onSave(player: PlayerMp, coords: Array2d[]) {}
}