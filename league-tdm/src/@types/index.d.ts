declare global {
  interface DummyMp {
    setVariable(key: string, value: any): void
    getVariable(key: string): any
  }
}

export {}