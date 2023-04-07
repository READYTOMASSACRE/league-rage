import { Role } from "../types/permission";
import { ClientProfile, PlayerStat, Profile, Round } from "../types/statistic";
import { Team } from "../types/tdm";

export const toPlayerStat = (o?: any): PlayerStat => ({
  kill: o?.kill ?? 0,
  death: o?.death ?? 0,
  assists: o?.assists ?? 0,
  damageDone: o?.damageDone ?? 0,
  damageRecieved: o?.damagerecieved ?? 0,
  hit: o?.hit ?? 0,
  exp: o?.exp ?? 0,
  name: o?.name ?? '',
})

export const toProfile = (o?: any): Profile => ({
  ...toPlayerStat(o),
  id: o?.id ?? '-1',
  name: o?.name ?? '',
  lvl: o?.lvl ?? 0,
  exp: o?.exp ?? 0,
  role: o?.role ?? Role.socialUser,
}) as Profile

export const toClientProfile = (o?: any): ClientProfile => ({
  ...toPlayerStat(o),
  id: o?.id ?? '-1',
  name: o?.name ?? '',
  lvl: o?.lvl ?? 0,
  exp: o?.exp ?? 0,
  role: o?.role ?? Role.socialUser,
}) as ClientProfile

export const toRound = (o?: Partial<Round>): Round => ({
  id: o?.id ?? Date.now(),
  arenaId: o?.arenaId ?? 0,
  result: o?.result ?? "draw",
  [Team.attackers]: o?.[Team.attackers] ?? { name: '', players: {} },
  [Team.defenders]: o?.[Team.defenders] ?? { name: '', players: {} },
}) as Round
