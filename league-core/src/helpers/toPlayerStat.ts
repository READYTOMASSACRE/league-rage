import { PlayerStat } from "../types/tdm";

export default (o?: any): PlayerStat => ({
  kill: o?.kill || 0,
  death: o?.death || 0,
  assists: o?.assists || 0,
  damageDone: o?.damageDone || 0,
  damageRecieved: o?.damagerecieved || 0,
  hit: o?.hit || 0,
})