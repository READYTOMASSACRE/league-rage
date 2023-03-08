import { proc, proceable } from "../../league-core";
import { IConfig, Procs } from "../../league-core/src/types";

@proceable
export default class ConfigService {
    constructor(readonly config: IConfig) {}

    @proc(Procs["tdm.config.get"])
    get(): IConfig {
        return {
            name: this.config.name,
            gamemode: this.config.gamemode,
            lang: this.config.lang,
            lobby: this.config.lobby,
            cef: this.config.cef,
            team: this.config.team,
            weapon: this.config.weapon,
            round: this.config.round,
            vote: this.config.vote,
            hud: this.config.hud,
            interaction: this.config.interaction,
        }
    }
}