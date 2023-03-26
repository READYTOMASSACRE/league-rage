import { ChatItem } from "../../../league-core/src/types/cef";

declare global {
  interface PlayerMp {
    outputChatBox(message: string | ChatItem): void;
  }
  interface DummyMp {
    setVariable(key: string, value: any): void
    getVariable(key: string): any
  }
}

export {}