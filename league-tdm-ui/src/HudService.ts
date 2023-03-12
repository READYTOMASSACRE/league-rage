import { event, eventable, logClient } from "../../league-core/client";
import { Events } from "../../league-core/src/types";
import { HudConfig } from "../../league-core/src/types/ui";
import Damage from "./hud/Damage";
import RoundStart from "./hud/RoundStart";
import RoundService from './RoundService'
import Zone from "./Zone";

@eventable
export default class HudService {
    private roundStart?: RoundStart
    private damageIn?: Damage
    private damageOut?: Damage

    constructor(
        readonly config: HudConfig,
        readonly roundService: RoundService,
    ) {}

    @event(Events["tdm.round.prepare"])
    drawRoundStart(id: number) {
        if (this.roundStart) {
            this.roundStart.destroy()
        }

        const arena = this.roundService.getArenaById(id)

        if (arena) {
            const zone = new Zone(arena)
            this.roundStart = new RoundStart(this.config.roundStart)
            this.roundStart.draw(arena.code, zone.center)
        }

        return arena
    }

    @event([Events["tdm.round.start"], Events["tdm.round.end"]]) // todo add check in decorator to server_only events
    stopDrawRoundStart() {
        if (this.roundStart) {
            this.roundStart.destroy()
        }

        this.roundStart = undefined
    }

    @logClient
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
                        weapon, damage, alive
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
                        weapon, damage, alive
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

        return new Damage(this.config.damage, {
            in: damageIn,
            weapon,
            damage,
            distance: +(mp.game.system.vdist(
                vectorSource.x, vectorSource.y, vectorSource.z,
                vectorTarget.x, vectorTarget.y, vectorTarget.z,
            )).toFixed(2),
        })
    }
}