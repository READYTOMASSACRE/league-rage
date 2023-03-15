import { useMemo } from "react";
import { scoreboard } from "../../../league-core/src/types";

export default function useFilterPlayersBySide(arrayPlayers: scoreboard.Player[], rolePlayers: string) {
  const sortedPlayers = useMemo(() => {
    const sortedPlayers = arrayPlayers.filter(player =>
      player.role === rolePlayers && player
    )
    return sortedPlayers;
  }, [arrayPlayers])

  return sortedPlayers;
}