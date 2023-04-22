import { console } from "../../core/client"
import { ClientConfig, Procs } from "../../core/src/types"
import Fly from "./src/Fly"
import WaypointService from "./src/WaypointService"

const main = async () => {
  try {
    const fly = new Fly()
    const config: ClientConfig = await mp.events.callRemoteProc(Procs["tdm.config.get"])

    if (config.mapeditor) {
      new WaypointService(fly)
    }

    console.log('league-mapeditor-ui package initialized')
  } catch (err) {
    mp.console.logInfo(err)
  }
}

main()