import { useMemo } from "react";
import { ITeams } from "../types";

export default function useFilterTeamBySide(arrayTeam: ITeams[], roleTeam: string) {
  const team = useMemo(() => {
    const team = arrayTeam.find((team) => {
      if(team.role === roleTeam)  return team
    })

    return team
  }, [arrayTeam])
  
  return team
}