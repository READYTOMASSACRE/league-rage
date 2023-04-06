import { event, eventable } from "../../../league-core/client";
import { deepclone, toId } from "../../../league-core/src/helpers";
import { Events, tdm } from "../../../league-core/src/types";
import { TeamSelectorConfig } from "../../../league-core/src/types/ui";
import KeybindService, { key } from "../KeybindService";
import PlayerService from "../PlayerService";
import TeamService from "../TeamService";
import UIService from "../UIService";

interface TeamSelector extends TeamSelectorConfig {}

@eventable
class TeamSelector implements TeamSelectorConfig {
  static key = 'teamselector'

  private running: boolean = false
  private ids: number[] = []
  private teamPed: Record<string, { skin: string, ped: PedMp }[]> = {}
  private camera: CameraMp
  private playerService: PlayerService
  private teamService: TeamService

  private uiService: UIService
  private keybindService: KeybindService

  private current = {
    team: 0,
    ped: 0,
  }

  constructor(
    config: TeamSelectorConfig,
    playerService: PlayerService,
    teamService: TeamService,
    uiService: UIService,
    keybindService: KeybindService,
  ) {
    Object.assign(this, deepclone(config))
    this.playerService = playerService
    this.uiService = uiService
    this.teamService = teamService
    this.keybindService = keybindService

    this.camera = mp.cameras.new(
      "TeamSelector",
      new mp.Vector3(...this.cam.vector),
      new mp.Vector3(...this.cam.rotation),
      this.cam.fov
    )
    this.camera.pointAtCoord(...config.cam.pointAt)

    for (const [team, data] of Object.entries(this.teamService.teams)) {
      const peds = data.skins.map(skin => ({
        skin,
        ped: mp.peds.new(
          mp.game.joaat(skin),
          new mp.Vector3(...this.ped.vector),
          this.ped.heading,
          this.ped.dimension
        )
      }))

      this.ids.push(...peds.map(({ ped }) => toId(ped)))
      this.teamPed[team] = peds
    }
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
        this.bindKeys()
      } else {
        this.unbindKeys()
      }
  
      this.camera.setActive(toggle)
      mp.game.cam.renderScriptCams(toggle, false, 0, true, false, 0)
  
      this.refreshPeds(toggle)
    } catch (err) {
      mp.console.logError(err.stack)
    }
  }

  private unbindKeys() {
    this.keybindService.unbind([key.right, key.d], false, TeamSelector.key)
    this.keybindService.unbind([key.left, key.a], false, TeamSelector.key)
    this.keybindService.unbind([key.up, key.w], false, TeamSelector.key)
    this.keybindService.unbind([key.down, key.s], false, TeamSelector.key)
    this.keybindService.unbind(key.enter, true, TeamSelector.key)
  }

  private bindKeys() {
    this.keybindService.bind([key.right, key.d], false, TeamSelector.key, () => this.turn('right'))
    this.keybindService.bind([key.left, key.a], false, TeamSelector.key, () => this.turn('left'))
    this.keybindService.bind([key.up, key.w], false, TeamSelector.key, () => this.turn('up'))
    this.keybindService.bind([key.down, key.s], false, TeamSelector.key, () => this.turn('down'))
    this.keybindService.bind(key.enter, true, TeamSelector.key, () => this.submit())
  }

  private refreshPeds(toggle: boolean) {
    for (const [team, peds] of Object.entries(this.teamPed)) {
      let pedIndex = 0

      for (const { ped } of peds) {
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
      if (!this.isRunning) {
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

  private submit() {
    try {
      if (!this.isRunning) {
        return
      }

      this.stop()

      mp.events.callRemote(Events["tdm.team.select"], this.currentTeam, this.currentPedSkin)
    } catch (err) {
      mp.console.logError(err.stack)
    } 
  }

  private get currentTeam(): tdm.Team {
    return <tdm.Team>Object.keys(this.teamPed)[this.current.team]
  }

  private get currentPed(): PedMp {
    return this.teamPed[this.currentTeam][this.current.ped].ped
  }

  private get currentPedSkin(): string {
    return this.teamPed[this.currentTeam][this.current.ped].skin
  }

  private get currentTeamInfo(): { team: string, color: string } {
    const { name: team, color } = this.teamService.getTeam(this.currentTeam)

    return { team, color }
  }

  private get isRunning() {
    return this.running &&
      !this.uiService.motd.visible &&
      !this.uiService.chat.visible
  }
}

export default TeamSelector