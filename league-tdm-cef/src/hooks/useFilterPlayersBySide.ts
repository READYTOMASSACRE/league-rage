import { useMemo } from "react";
import { IPlayers } from "../types";

export default function useFilterPlayersBySide(arrayPlayers: IPlayers[], rolePlayers: string) {
    const sortedPlayers = useMemo(() => {
      const sortedPlayers = arrayPlayers.filter(player =>
        player.role === rolePlayers && player
      )
  
      return sortedPlayers;
    }, [])
    return sortedPlayers;
}