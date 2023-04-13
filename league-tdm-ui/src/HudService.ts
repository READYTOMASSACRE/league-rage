import { event, eventable } from "../../league-core/client";
import { ClientConfig, Events } from "../../league-core/src/types";
import console from "./helpers/console";
import Damage from "./hud/Damage";
import Nametag from "./hud/Nametag";
import RoundStart from "./hud/RoundStart";
import PlayerService from "./PlayerService";
import RoundService from './RoundService'
import TeamService from "./TeamService";
import Zone from "./Zone";

@eventable
export default class HudService {
    private roundStart?: RoundStart
    private incomeDamage?: Damage
    private outcomeDamage?: Damage
    private nametag?: Nametag

    constructor(
        readonly config: ClientConfig,
        readonly roundService: RoundService,
        readonly playerService: PlayerService,
        readonly teamService: TeamService,
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

    @event([Events["tdm.round.start"], Events["tdm.round.end"]])
    stopDrawRoundStart() {
        if (this.roundStart) {
            this.roundStart.destroy()
        }

        this.roundStart = undefined
    }

    @event(Events["tdm.player.damage"])
    playerDamage(victimId: number, killerId: number, weapon: string, damage: number, alive: boolean) {
        try {
            const victim = mp.players.atRemoteId(victimId)
            const killer = mp.players.atRemoteId(killerId)
    
            if (!mp.players.exists(victim) || !mp.players.exists(killer)) {
                return false
            }

            if (victimId === mp.players.local.remoteId) {
                if (!this.incomeDamage || this.incomeDamage.isDestroyed) {
                    this.incomeDamage = this.getDamageComponent({
                        killer, victim, direction: 'income',
                        weapon, damage: 0, alive
                    })
                }

                if (this.incomeDamage) {
                    this.incomeDamage.damage += damage
                    this.incomeDamage.refreshAlive()
                }
            } else {
                if (!this.outcomeDamage || this.outcomeDamage.isDestroyed) {
                    this.outcomeDamage = this.getDamageComponent({
                        killer, victim, direction: 'outcome',
                        weapon, damage: 0, alive
                    })
                }
    
                if (this.outcomeDamage) {
                    this.outcomeDamage.damage += damage
                    this.outcomeDamage.refreshAlive()
                }
            }
        } catch (err) {
            mp.console.logError(err.stack)
        }
    }

    private getDamageComponent({
        killer, victim, damage, weapon, alive, direction
    }: { killer: PlayerMp, victim: PlayerMp, direction: 'income' | 'outcome'
        damage: number, weapon: string, alive: boolean
    }): Damage {

        const killerVector = killer.position
        const victimVector = victim.position

        return new Damage(this.config.hud.damage, {
            in: direction === 'income',
            weapon,
            damage,
            distance: +(mp.game.system.vdist(
                killerVector.x, killerVector.y, killerVector.z,
                victimVector.x, victimVector.y, victimVector.z,
            )).toFixed(2),
        })
    }

    @event(Events["tdm.player.ready"])
    drawNametag() {
        if (this.nametag) {
            this.nametag.destroy()
        }

        mp.nametags.enabled = false
        this.nametag = new Nametag(this.config.hud.nametag, this.teamService, this.playerService)
        this.nametag.draw()
    }
}