import { console } from "../league-core/client"
import Fly from "./src/Fly"
import WaypointService from "./src/WaypointService"

const main = async () => {
  try {
    const fly = new Fly()

    new WaypointService(fly)

    console.log('league-mapeditor-ui package initialized')
  } catch (err) {
    mp.console.logInfo(err)
  }
}

main()