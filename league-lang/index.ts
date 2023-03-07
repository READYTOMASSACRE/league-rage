export const enum Lang {
    "error.permission.invalid" = "error.permission.invalid",

    "error.arena.invalid_format" = "error.arena.invalid_format",
    "error.arena.not_found" = "error.arena.not_found",
    "error.arena.not_found_spawn" = "error.arena.not_found_spawn",

    "error.team.player_is_busy" = "error.team.player_is_busy",
    "error.team.player_not_in_lobby" = "error.team.player_not_in_lobby",

    "error.vote.already_voted" = "error.vote.already_voted",

    "error.weapon.empty_choice" = "error.weapon.empty_choice",
    "error.weapon.not_configured" = "error.weapon.not_configured",
    "error.weapon.already_equipped" = "error.weapon.already_equipped",

    "error.player.not_found" = "error.player.not_found",
    "error.player.not_in_round" = "error.player.not_in_round",

    "tdm.round.arena_prepare" = "tdm.round.arena_prepare",
    "tdm.round.arena_start" = "tdm.round.arena_start",
    "tdm.round.end" = "tdm.round.end",
    "tdm.round.add" = "tdm.round.add",
    "tdm.round.remove" = "tdm.round.remove",
    "tdm.round.start_empty" = "tdm.round.start_empty",

    "tdm.round.vote" = "tdm.round.vote",
    "tdm.round.vote_start" = "tdm.round.vote_start",
    "tdm.round.vote_end" = "tdm.round.vote_end",

    "tdm.round.is_paused" = "tdm.round.is_paused",
    "tdm.round.is_already_paused" = "tdm.round.is_already_paused",
    "tdm.round.is_unpaused" = "tdm.round.is_unpaused",
    "tdm.round.is_running" = "tdm.round.is_running",
    "tdm.round.is_not_running" = "tdm.round.is_not_running",
    "tdm.round.is_not_paused" = "tdm.round.is_not_paused",
    "tdm.round.is_stopped" = "tdm.round.is_stopped",

    "tdm.team.change" = "tdm.team.change",

    "cmd.start_arena" = "cmd.start_arena",
    "cmd.stop_arena" = "cmd.stop_arena",
    "cmd.add_player" = "cmd.add_player",
    "cmd.remove_player" = "cmd.remove_player",
    "cmd.pause" = "cmd.pause",
    "cmd.unpause" = "cmd.unpause",
    "cmd.vote" = "cmd.vote",
    "cmd.weapon" = "cmd.weapon",
    "cmd.change_team" = "cmd.change_team",
}
export interface ILanguage {
    get(code: Lang, replacements?: Record<string, string | number>): string
    load(lang?: string): Promise<void>
}
export class Language implements ILanguage {
    private language: Partial<Record<Lang, string>> = {}

    constructor(public lang: string) {}

    get(code: Lang, replacements: Record<string, string | number> = {}) {
        const text = this.language[code]
        if (!text) {
            return code
        }

        return Object.entries(replacements).reduce((acc, [key, value]) => {
            return acc.replace(`:${key.replace(':', '')}`, String(value))
        }, text)
    }

    async load(lang?: string) {
        lang = lang ? lang : this.lang
        lang = lang.replace(/[^a-zA-Z0-9]/, '').toLocaleLowerCase()

        this.language = await import(`./lang/${lang}.json`)
        this.lang = lang
    }
}