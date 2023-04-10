export const enum Lang {
  "error.is_busy" = "error.is_busy",
  "error.permission.invalid" = "error.permission.invalid",
  "error.permission.invalid_role" = "error.permission.invalid_role",

  "error.arena.invalid_format" = "error.arena.invalid_format",
  "error.arena.not_found" = "error.arena.not_found",
  "error.arena.not_found_spawn" = "error.arena.not_found_spawn",

  "error.team.not_found" = "error.team.not_found",
  "error.team.player_is_busy" = "error.team.player_is_busy",
  "error.team.player_not_in_lobby" = "error.team.player_not_in_lobby",

  "error.vote.already_voted" = "error.vote.already_voted",

  "error.weapon.weapon_not_found" = "error.weapon.weapon_not_found",
  "error.weapon.not_configured" = "error.weapon.not_configured",
  "error.weapon.is_busy" = "error.weapon.is_busy",
  "error.weapon.category_not_found" = "error.weapon.category_not_found",
  "error.weapon.slot_not_found" = "error.weapon.slot_not_found",
  "error.weapon.slot_is_busy" = "error.weapon.slot_is_busy",

  "error.not_found" = "error.not_found",
  "error.player.not_found" = "error.player.not_found",
  "error.player.not_in_round" = "error.player.not_in_round",
  "error.player.in_round" = "error.player.in_round",
  "error.player.name_too_long" = "error.player.name_too_long",

  "error.round.add.player_is_busy" = "error.round.add.player_is_busy",

  "error.vote.not_found_config" = "error.vote.not_found_config",

  "error.spectate.not_same_team" = "error.spectate.not_same_team",
  "error.spectate.same_player" = "error.spectate.same_player",
  "error.spectate.player_is_busy" = "error.spectate.player_is_busy",

  "tdm.player.find_result" = "tdm.player.find_result",
  "tdm.player.join" = "tdm.player.join",
  "tdm.player.quit" = "tdm.player.quit",
  "tdm.player.change_name" = "tdm.player.change_name",
  "tdm.player.login" = "tdm.player.login",

  "tdm.round.arena_prepare" = "tdm.round.arena_prepare",
  "tdm.round.arena_prepare_timer" = "tdm.round.arena_prepare_timer",
  "tdm.round.arena_start" = "tdm.round.arena_start",
  "tdm.round.end" = "tdm.round.end",
  "tdm.round.add" = "tdm.round.add",
  "tdm.round.remove" = "tdm.round.remove",
  "tdm.round.start_empty" = "tdm.round.start_empty",

  "tdm.vote.text" = "tdm.vote.text",
  "tdm.vote.end" = "tdm.vote.end",
  "tdm.vote.add" = "tdm.vote.add",
  "tdm.vote.text_arena" = "tdm.vote.text_arena",
  "tdm.vote.text_arena_notify" = "tdm.vote.text_arena_notify",
  "tdm.vote.end_arena" = "tdm.vote.end_arena",

  "tdm.round.is_paused" = "tdm.round.is_paused",
  "tdm.round.is_already_paused" = "tdm.round.is_already_paused",
  "tdm.round.is_unpaused" = "tdm.round.is_unpaused",
  "tdm.round.is_running" = "tdm.round.is_running",
  "tdm.round.is_not_running" = "tdm.round.is_not_running",
  "tdm.round.is_not_paused" = "tdm.round.is_not_paused",
  "tdm.round.is_stopped" = "tdm.round.is_stopped",

  "tdm.team.change" = "tdm.team.change",

  "tdm.permission.role" = "tdm.permission.role",

  "cmd.cmdlist" = "cmd.cmdlist",
  "cmd.kill" = "cmd.kill",
  "cmd.start_arena" = "cmd.start_arena",
  "cmd.stop_arena" = "cmd.stop_arena",
  "cmd.add_player" = "cmd.add_player",
  "cmd.remove_player" = "cmd.remove_player",
  "cmd.pause" = "cmd.pause",
  "cmd.unpause" = "cmd.unpause",
  "cmd.vote" = "cmd.vote",
  "cmd.spectate" = "cmd.spectate",
  "cmd.weapon" = "cmd.weapon",
  "cmd.change_team" = "cmd.change_team",
  "cmd.change_name" = "cmd.change_name",
  "cmd.swap_team" = "cmd.swap_team",
  "cmd.rcon" = "cmd.rcon",
  "cmd.set_role" = "cmd.set_role",

  "cmdlist.page" = "cmdlist.page",
  "cmdlist.not_found" = "cmdlist.not_found",

  "controls.t" = "controls.t",
  "controls.b" = "controls.b",
  "controls.tab" = "controls.tab",
  "controls.f2" = "controls.f2",
  "controls.f4" = "controls.f4",

  "cef.chat.input" = "cef.chat.input",
  "cef.spectate.text" = "cef.spectate.text",
  "cef.spectate.btn_right" = "cef.spectate.btn_right",
  "cef.spectate.btn_left" = "cef.spectate.btn_left",
  "cef.panel.profile_title" = "cef.panel.profile_title",
  "cef.panel.matches_title" = "cef.panel.matches_title",
  "cef.panel.vote_title" = "cef.panel.vote_title",
  "cef.panel.about_title" = "cef.panel.about_title",
  "cef.panel.about_description" = "cef.panel.about_description",
  "cef.panel.vote_arena" = "cef.panel.vote_arena",
  "cef.panel.vote_base" = "cef.panel.vote_base",
  "cef.panel.vote_player" = "cef.panel.vote_player",
  "cef.panel.navbar_profile" = "cef.panel.navbar_profile",
  "cef.panel.navbar_matches" = "cef.panel.navbar_matches",
  "cef.panel.navbar_vote" = "cef.panel.navbar_vote",
  "cef.panel.navbar_about" = "cef.panel.navbar_about",
}

export interface ILanguage {
  get(code: Lang, replacements?: Record<string, string | number>): string
  change(lang: Record<Lang, string>): void
  language: Record<Lang, string>
}

export class Language implements ILanguage {
  constructor(public language: Record<Lang, string>) {}

  get(code: Lang, replacements: Record<string, string | number> = {}) {
    const text = this.language[code]
    if (!text) {
      return code
    }

    return Object.entries(replacements).reduce((acc, [key, value]) => {
      return acc.replace(`:${key.replace(':', '')}`, String(value))
    }, text)
  }

  change(lang: Record<Lang, string>) {
    this.language = lang
  }
}