import { Entity, Team, TeamConfig } from "../../../core/src/types/tdm";
import DummyService from "./DummyService";

export default class TeamService {
  constructor(
    readonly config: TeamConfig,
    readonly dummyService: DummyService
  ) {}

  getTeam(team: Team) {
    return this.dummyService.get(Entity.TEAM, team)
  }

  get teams() {
    return {
      [Team.attackers]: this.getTeam(Team.attackers),
      [Team.defenders]: this.getTeam(Team.defenders),
      [Team.spectators]: this.getTeam(Team.spectators),
    }
  }
}