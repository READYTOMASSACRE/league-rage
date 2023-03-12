import { event, eventable, logClient } from "../../../league-core/client";
import { deepclone, toId } from "../../../league-core/src/helpers";
import { Events, tdm } from "../../../league-core/src/types";
import { TeamConfig } from "../../../league-core/src/types/tdm";
import { TeamSelectorConfig } from "../../../league-core/src/types/ui";
import PlayerService from "../PlayerService";

interface TeamSelector extends TeamSelectorConfig {}

@eventable
class TeamSelector implements TeamSelectorConfig {
  private running: boolean = false
  private ids: number[] = []
  private teamPed: Record<string, PedMp[]> = {}
  private camera: CameraMp
  private playerService: PlayerService
  private teamConfig: TeamConfig

  private current = {
    team: 0,
    ped: 0,
  }

  constructor(
    config: TeamSelectorConfig,
    teamConfig: TeamConfig,
    playerService: PlayerService
  ) {
    Object.assign(this, deepclone(config))
    this.playerService = playerService
    this.teamConfig = teamConfig

    this.camera = mp.cameras.new(
      "TeamSelector",
      new mp.Vector3(...this.cam.vector),
      new mp.Vector3(...this.cam.rotation),
      this.cam.fov
    )
    this.camera.pointAtCoord(...config.cam.pointAt)

    for (const [team, data] of Object.entries(teamConfig)) {
      const peds = data.skins.map(skin => mp.peds.new(
        mp.game.joaat(skin),
        new mp.Vector3(...this.ped.vector),
        this.ped.heading,
        this.ped.dimension
      ))

      this.ids.push(...peds.map(toId))
      this.teamPed[team] = peds
    }

    const rightButtons = [0x27, 0x44] // VK_RIGHT, D
    const leftButtons = [0x25, 0x41] // VK_LEFT, A
    const upButtons = [0x26, 0x57] // VK_UP, W
    const downButtons = [0x28, 0x53] // VK_DOWN, S
    const submitButton = 0x0D // VK_RETURN

    rightButtons.map(key => mp.keys.bind(key, false, () => this.turn('right')))
    leftButtons.map(key => mp.keys.bind(key, false, () => this.turn('left')))
    upButtons.map(key => mp.keys.bind(key, false, () => this.turn('up')))
    downButtons.map(key => mp.keys.bind(key, false, () => this.turn('down')))
    mp.keys.bind(submitButton, true, () => this.submit())
  }

  @event('entityStreamIn')
  entityStreamIn(entity: EntityMp) {
    if (!this.running) {
      return
    }
    try {
      if (
        entity.type === 'ped' &&
        this.ids.includes(entity.id) &&
        entity.id !== this.current.ped
      ) {
        (entity as PedMp).setAlpha(0, false)
      }
    } catch (err) {
      this.running = false
      mp.console.logError(err.stack)
    }
  }

  @logClient
  run() {
    this.current = {
      team: 0,
      ped: 0,
    }

    if (this.running) {
      this.stop()
    }

    this.toggle(true)

    this.running = true
    mp.events.call(Events["tdm.team.select_toggle"], { ...this.currentTeamInfo, toggle: true })
  }

  stop() {
    this.toggle(false)
    this.running = false
    mp.events.call(Events["tdm.team.select_toggle"], { ...this.currentTeamInfo, toggle: false })
  }

  private toggle(toggle: boolean) {
    try {
      this.playerService.setInvicible(toggle)
      this.playerService.freezePosition(toggle)
      this.playerService.setAlpha(toggle ? 0 : 255)
  
      if (toggle) {
        const {x, y, z} = this.camera.getCoord()
        this.playerService.local.setCoordsNoOffset(x, y, z, false, false, false)
      }
  
      this.camera.setActive(toggle)
      mp.game.cam.renderScriptCams(toggle, false, 0, true, false, 0)
  
      this.refreshPeds(toggle)
    } catch (err) {
      mp.console.logError(err.stack)
    }
  }

  private refreshPeds(toggle: boolean) {
    for (const [team, peds] of Object.entries(this.teamPed)) {
      let pedIndex = 0

      for (const ped of peds) {
        const current = toggle &&
          this.currentTeam === team &&
          this.current.ped === pedIndex++

        ped.setAlpha(current ? 255 : 0, false)
        ped.setInvincible(!current)
      }
    }
  }

  private turn(s: "left" | "right" | "up" | "down") {
    try {
      if (!this.running) {
        return
      }
  
      const teams = Object.keys(this.teamPed)
      const peds = this.teamPed[this.currentTeam]
  
      const side = {
        left: [this.current.team - 1, teams.length - 1],
        right: [this.current.team + 1, 0],
        up: [this.current.ped + 1, 0],
        down: [this.current.ped - 1, peds?.length - 1],
      }
  
      const [next, last] = side[s]
  
      if (["left", "right"].includes(s)) {
        this.current.team = typeof teams[next] !== 'undefined' ?
          next :
          last
      } else {
        this.current.ped = typeof peds[next] !== 'undefined' ?
          next :
          last
      }
  
      this.refreshPeds(true)
      mp.events.call(Events["tdm.team.select_toggle"], { ...this.currentTeamInfo, toggle: true })
    } catch (err) {
      mp.console.logError(err.stack)
    }
  }

  @logClient
  private submit() {
    try {
      if (!this.running) {
        return
      }

      this.stop()

      this.playerService.local.model = this.currentPed.model
      mp.events.callRemote(Events["tdm.team.select"], this.currentTeam, this.currentPed.model)
    } catch (err) {
      mp.console.logError(err.stack)
    } 
  }

  private get currentTeam(): tdm.Team {
    return <tdm.Team>Object.keys(this.teamPed)[this.current.team]
  }

  private get currentPed(): PedMp {
    return this.teamPed[this.currentTeam][this.current.ped]
  }

  private get currentTeamInfo(): { team: string, color: string } {
    const { name: team, color } = this.teamConfig[this.currentTeam]

    return { team, color }
  }
}

export default TeamSelector