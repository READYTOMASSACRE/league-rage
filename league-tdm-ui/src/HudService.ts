import { event, eventable, logClient } from "../../league-core/client";
import { Events, tdm } from "../../league-core/src/types";
import RoundStart from "./hud/RoundStart";
import RoundService from './RoundService'
import Zone from "./Zone";

@eventable
export default class HudService {
    private roundStart?: RoundStart

    constructor(readonly roundService: RoundService) {}

    @logClient
    @event(Events["tdm.round.prepare"])
    drawRoundStart(id: number) {
        if (this.roundStart) {
            this.roundStart.destroy()
        }

        const arena = this.roundService.getArenaById(id)

        if (arena) {
            const zone = new Zone(arena)
            this.roundStart = new RoundStart()
            this.roundStart.draw(arena.code, zone.center)
        }

        return arena
    }

    @event([Events["tdm.round.start"], Events["tdm.round.end"]])
    stopDrawRoundStart() {
        if (this.roundStart) {
            this.roundStart.destroy()
        }

        this.roundStart = undefined
    }
}