declare global {
  interface PlayerMp {
    userId: string
  }
  interface DummyMp {
    setVariable(key: string, value: any): void
    getVariable(key: string): any
  }
}

export {}