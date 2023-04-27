declare global {
  interface PlayerMp {
    userId: number | string
    logged?: 'pending' | 'social' | 'auth' | 'error'
  }
}

export {}