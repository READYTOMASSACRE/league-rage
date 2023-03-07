import { proc, proceable } from "../../league-core";
import { IConfig, Procs } from "../../league-core/src/types";

@proceable
export default class ConfigService {
    constructor(readonly config: IConfig) {}

    @proc(Procs["tdm.config.get"])
    get(): Partial<IConfig> {
        return {
            weaponConfig: this.config.weaponConfig,
        }
    }
}