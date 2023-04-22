import { userId } from "../../../../core/src/types";
import { ChatItem } from "../../../../core/src/types/cef";

declare global {
  interface PlayerMp {
    outputChatBox(message: string | ChatItem, byServer?: boolean): void
    outputPopup(message: string, type?: string): void
    rconAttempts?: number
    userId: userId
    logged?: 'pending' | 'social' | 'auth' | 'error'
  }
  interface DummyMp {
    setVariable(key: string, value: any): void
    getVariable(key: string): any
  }
}

export {}