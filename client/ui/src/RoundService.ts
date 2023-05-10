import { event, eventable, console } from "../../../core/client";
import { Events, Procs, tdm } from "../../../core/src/types";
import ArenaService from "./ArenaService";
import HudService from "./HudService";
import PlayerService from "./PlayerService";
import UIService from "./UIService";
import ZoneService from "./ZoneService";

@eventable
export default class RoundService {
	constructor(
		readonly zoneService: ZoneService,
		readonly playerService: PlayerService,
		readonly arenaService: ArenaService,
		readonly hudService: HudService,
		readonly uiService: UIService,
	) {}

	@event(Events["tdm.round.prepare"])
	roundPrepare(id: number) {
		const arena = this.getArenaById(id)

		this.hudService.drawRoundStart(arena)
		this.uiService.notifyText.roundPrepare(arena)
		this.uiService.winner.roundPrepare()
	}

	@event(Events["tdm.round.start"])
	roundStart(id: number, players: number[]) {
		this.hudService.stopDrawRoundStart()
		this.uiService.infoPanel.roundStart()
		this.enable(id)
	}

	@event(Events["tdm.round.add"])
	roundAdd(_: number, manual: boolean, arenaId: number) {
		if (manual) {
			this.enable(arenaId)
		}
	}

	@event(Events["tdm.round.end"])
	roundEnd(id: number, result: tdm.Team | "draw") {
		this.hudService.stopDrawRoundStart()
		this.uiService.infoPanel.roundEnd()
		this.zoneService.disable()
		this.playerService.freezePosition(false)
		this.uiService.winner.roundEnd(result)
	}

	@event(Events["tdm.round.remove"])
	roundRemove(id: number, reason?: 'manual' | 'death') {
		this.zoneService.disable()
		this.playerService.freezePosition(false)
		this.uiService.weaponHud.roundRemove()
	}

	getArenaById(id: number): tdm.Arena | undefined {
		return this.arenaService.arenas[id]
	}

	@event(Events["tdm.round.pause"])
	roundPause(toggle: boolean) {
		this.playerService.freezePosition(toggle)
		this.uiService.infoPanel.roundPause(toggle)
	}

	private enable(id: number) {
		this.zoneService.disable()

		const arena = this.getArenaById(id)
		if (arena && this.playerService.alive) {
			this.zoneService.enable(arena)
		}
	}

	static async getArenas() {
		try {
			const arenas: tdm.Arena[] = JSON.parse(await mp.events.callRemoteProc(Procs["tdm.arena.get"]))
	
			return arenas.reduce((acc, current) => {
				acc[current.id] = current
	
				return acc
			}, {} as Record<number, tdm.Arena>)
		} catch (err) {
			console.error(err)
		}
	}
}