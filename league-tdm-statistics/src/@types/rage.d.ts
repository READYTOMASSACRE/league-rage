declare global {
  interface PlayerMp {
    userId: string
    logged?: 'pending' | 'social' | 'auth' | 'error'
  }
}

export {}