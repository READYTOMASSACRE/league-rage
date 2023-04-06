declare global {
  interface ConsoleMp {
    log: (...args: any[]) => void
    error: (...args: any[]) => void
    warning: (...args: any[]) => void
    fatal: (...args: any[]) => void
  }

  interface Mp {
    game1: {
      weapon: {
        unequipEmptyWeapons: boolean
      }
    }
  }

  interface PlayerMp {
    blip: BlipMp
    createBlip(p0: number): void
    setBlipColor(p0: number): void
    destroyBlip(): void
  }
}

export {}