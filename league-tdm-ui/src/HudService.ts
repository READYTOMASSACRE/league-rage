import { event, eventable } from "../../league-core/client";
import { Events, IConfig } from "../../league-core/src/types";
import Damage from "./hud/Damage";
import Nametag from "./hud/Nametag";
import RoundStart from "./hud/RoundStart";
import PlayerService from "./PlayerService";
import RoundService from './RoundService'
import Zone from "./Zone";

@eventable
export default class HudService {
    private roundStart?: RoundStart
    private damageIn?: Damage
    private damageOut?: Damage
    private nametag?: Nametag

    constructor(
        readonly config: IConfig,
        readonly roundService: RoundService,
        readonly playerService: PlayerService,
    ) {}

    @event(Events["tdm.round.prepare"])
    drawRoundStart(id: number) {
        if (this.playerService.select) {
            return
        }

        if (this.roundStart) {
            this.roundStart.destroy()
        }

        const arena = this.roundService.getArenaById(id)

        if (arena) {
            const zone = new Zone(arena)
            this.roundStart = new RoundStart(this.config.hud.roundStart)
            this.roundStart.draw(arena.code, zone.center)
        }
    }

    @event([Events["tdm.round.start"], Events["tdm.round.end"]]) // todo add check in decorator to server_only events
    stopDrawRoundStart() {
        if (this.roundStart) {
            this.roundStart.destroy()
        }

        this.roundStart = undefined
    }

    @event(Events["tdm.player.damage"])
    playerDamage(recievedPlayer: number, sourcePlayer: number, weapon: string, damage: number, alive: boolean) {
        try {
            const source = mp.players.atRemoteId(sourcePlayer)
            const recieved = mp.players.atRemoteId(recievedPlayer)
    
            if (!mp.players.exists(source) || !mp.players.exists(recieved)) {
                return false
            }

            if (recievedPlayer === mp.players.local.remoteId) {
                if (!this.damageIn || this.damageIn.isDestroyed) {
                    this.damageIn = this.getDamageComponent({
                        source, recieved, damageIn: true,
                        weapon, damage: 0, alive
                    })
    
                    this.damageIn.draw()
                }

                if (this.damageIn) {
                    this.damageIn.damage += damage
                    this.damageIn.refreshAlive()
                }
            } else {
                if (!this.damageOut || this.damageOut.isDestroyed) {
                    this.damageOut = this.getDamageComponent({
                        source, recieved, damageIn: false,
                        weapon, damage: 0, alive
                    })
    
                    this.damageOut.draw()
                }

                if (this.damageOut) {
                    this.damageOut.damage += damage
                    this.damageOut.refreshAlive()
                }
            }

        } catch (err) {
            mp.console.logError(err.stack)
        }
    }

    private getDamageComponent({
        source, recieved, damage, weapon, alive, damageIn
    }: { source: PlayerMp, recieved: PlayerMp, damageIn: boolean
        damage: number, weapon: string, alive: boolean
    }): Damage {

        const vectorSource = source.position
        const vectorTarget = recieved.position

        return new Damage(this.config.hud.damage, {
            in: damageIn,
            weapon,
            damage,
            distance: +(mp.game.system.vdist(
                vectorSource.x, vectorSource.y, vectorSource.z,
                vectorTarget.x, vectorTarget.y, vectorTarget.z,
            )).toFixed(2),
        })
    }

    @event(Events["tdm.player.ready"])
    drawNametag() {
        if (this.nametag) {
            this.nametag.destroy()
        }

        mp.nametags.enabled = false
        this.nametag = new Nametag(this.config.hud.nametag, this.config.team, this.playerService)
        this.nametag.draw()
    }
}