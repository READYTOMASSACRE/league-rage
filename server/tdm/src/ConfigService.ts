import { proc, proceable } from "../../../core";
import { ClientConfig, IConfig, Procs } from "../../../core/src/types";

@proceable
export default class ConfigService {
    constructor(readonly config: IConfig) {}

    @proc(Procs["tdm.config.get"])
    get(): ClientConfig {
        return {
            name: this.config.name,
            gamemode: this.config.gamemode,
            welcomeText: this.config.welcomeText,
            motd: this.config.motd,
            lang: this.config.lang,
            lobby: this.config.lobby,
            cef: this.config.cef,
            team: this.config.team,
            weapon: this.config.weapon,
            vote: this.config.vote,
            hud: this.config.hud,
            interaction: this.config.interaction,
            statistic: this.config.statistic,
            effects: this.config.effects,
            version: 'League 0.7a',
            prefix: this.config.prefix,
            mapeditor: this.config.mapeditor,
            gametype: this.config.gametype,
            match: this.config.match,
            round: this.config.round,
        }
    }
}