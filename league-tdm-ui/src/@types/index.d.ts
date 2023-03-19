declare global {
  interface ConsoleMp {
    log: (...args: any[]) => void
    error: (...args: any[]) => void
    warning: (...args: any[]) => void
    fatal: (...args: any[]) => void
  }
}

export {}