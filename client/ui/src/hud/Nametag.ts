import { colorGradient, deepclone, hex2rgba } from "../../../../core/src/helpers"
import { NametagConfig } from "../../../../core/src/types/hud"
import PlayerService from "../PlayerService"
import TeamService from "../TeamService"
import Hud from "./Hud"

interface Nametag extends NametagConfig {}

class Nametag extends Hud implements NametagConfig {
  static IK_Head = 12844

  readonly maxDistance = 2625
  readonly visibleBitMap = 1 | 16 | 256
  
  private camera: CameraMp
  private teamService: TeamService
  private playerService: PlayerService
  private interval: number = 0

  constructor(
    config: NametagConfig,
    teamService: TeamService,
    playerService: PlayerService,
  ) {
    super(config)
    Object.assign(this, deepclone(config))

    this.teamService = teamService
    this.playerService = playerService
    this.camera = mp.cameras.new('gameplay')
  }

  render(nametags: [PlayerMp, number, number, number][] = []) {
    try {
      for (const [ player, x, y, distance ] of nametags) {
        const health = this.playerService.getVariable(player, 'health')
        if (
          distance <= this.maxDistance &&
          this.isVisible(player)
        ) {
          this.drawNickname(player, x, y)
          this.drawHealth(x, y, typeof health === 'number' ? health : player.getHealth())
        }
      }
    } catch (err) {
      mp.console.logError('nametag destroyed')
      this.destroy(err)
    }
  }

  destroy(err?: Error) {
    this.camera.destroy()
    clearInterval(this.interval)
    super.destroy(err)
  }

  private isVisible(player: PlayerMp) {
    const vector = this.camera.getCoord()
    const playerVector = player.getBoneCoords(Nametag.IK_Head, 0, 0, 0)

    return !mp.raycasting.testPointToPoint(vector, playerVector, undefined, this.visibleBitMap)
  }

  private drawNickname(player: PlayerMp, x: number, y: number) {
    const team = this.playerService.getTeam(player)
    let color: Array4d = [255, 255, 255, 255]

    try {
      color = hex2rgba(this.teamService.getTeam(team).color)
    } catch (err) {}

    const { scale: [scaleX, scaleY] } = this.textElement.style

    mp.game.graphics.drawText("id: " + player.remoteId, [x, y-0.02], {
      ...this.textElement.style,
      color,
      scale: [scaleX - 0.14, scaleY - 0.14],
    })
    mp.game.graphics.drawText(player.name, [x, y], { ...this.textElement.style, color })
  }

  private drawHealth(x: number, y: number, health: number) {
    y += 0.042

    const { width, height, border }   = this.health
    const healthWidth                 = this.calculateHealthWidth(health, width)
    const healthOffsetx               = this.calculateHealthOffsetX(health, width)
    const [r, g, b]                   = this.getColorHealth(health)

    mp.game.graphics.drawRect(x, y, width + border * 2, height + border * 2, 0, 0, 0, 200, false)
    mp.game.graphics.drawRect(x, y, width, height, 150, 150, 150, 50, false)
    mp.game.graphics.drawRect(x - healthOffsetx, y, healthWidth, height, r, g, b, 255, false)
  }

  private calculateHealthOffsetX(health: number, width: number): number {
    return width / 2 * (1 - health / 100)
  }

  private calculateHealthWidth(health: number, width: number): number {
    if (health === 0) return 0

    return (width * health) / 100
  }

  private getColorHealth(health: number) {
    const { empty, full } = this.health.gradient

    return colorGradient(health / 100, empty, full)
  }
}

export default Nametag