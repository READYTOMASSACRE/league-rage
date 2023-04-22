import { useMemo } from "react";
import { scoreboard } from "../../../../core/src/types";

export default function useFilterTeamBySide(arrayTeam: scoreboard.Team[], roleTeam: string) {
  const team = useMemo(() => {
    const team = arrayTeam.find((team) => {
      if(team.role === roleTeam)  return team
    })

    return team
  }, [arrayTeam])
  
  return team
}