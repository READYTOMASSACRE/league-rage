import { Round, RoundFilter } from "../../@types";
import { day } from "../../helpers";
import LowdbRepository from "./LowdbRepository";

export default class RoundRepository extends LowdbRepository<Round, 'round'> {
  name = 'round'

  async get({
    id: userId,
    dateFrom = Date.now() - day,
    dateTo = Date.now() + day,
    ids,
    offset = 0,
    limit = 50,
    ...filter
  }: RoundFilter) {
    if (!ids) {
      let items: Round[] = []

      const keys = Object.keys(this.collection)
      const roundIds = keys
        .filter(id => Number(id) > dateFrom && Number(id) < dateTo)
        .reverse()
        .slice(offset, limit)
        .map(Number)
  
      for (const id of roundIds) {
        if (this.collection[id]) items.push(this.collection[id])
      }
  
      if (userId) {
        items = items.filter(item => item.attackers[userId] || item.defenders[userId])
      }

      return Promise.resolve(items)
    }

    return super.get({ids, limit, offset, ...filter})
  }
}
