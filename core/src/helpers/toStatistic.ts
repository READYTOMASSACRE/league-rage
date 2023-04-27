import { Role } from "../types/permission";
import { ClientProfile, PlayerStat, Profile, Round } from "../types/statistic";
import { Team } from "../types/tdm";

export const toPlayerStat = (o?: any): PlayerStat => ({
  kill: o?.kill ?? 0,
  death: o?.death ?? 0,
  assists: o?.assists ?? 0,
  damageDone: o?.damageDone ?? 0,
  damageRecieved: o?.damageRecieved ?? 0,
  hit: o?.hit ?? 0,
  exp: o?.exp ?? 0,
  name: o?.name ?? '',
  kda: o?.kda ?? 0,
})

export const toProfile = (o?: any): Profile => ({
  ...toPlayerStat(o),
  _id: o?.id,
  rgscId: o?.rgscId,
  lvl: o?.lvl ?? 0,
  role: o?.role ?? Role.socialUser,
  victory: o?.victory ?? 0,
  rating: o?.rating ?? 0,
  averageDamage: o?.averageDamage ?? 0,
  wins: o?.wins ?? 0,
  loses: o?.loses ?? 0,
  draws: o?.draw ?? 0,
})

export const toClientProfile = (o?: any): ClientProfile => {
  const profile = toProfile(o)

  delete profile.rgscId
  delete profile.password

  return profile
}

export const toRound = (o?: Partial<Round>): Round => ({
  _id: o?._id,
  createDate: o?.createDate ?? Date.now(),
  arenaId: o?.arenaId ?? 0,
  result: o?.result ?? "draw",
  [Team.attackers]: o?.[Team.attackers] ?? { name: '', players: {} },
  [Team.defenders]: o?.[Team.defenders] ?? { name: '', players: {} },
}) as Round
