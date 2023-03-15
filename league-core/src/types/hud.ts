import { StepOffset, TextElement, TextStyle } from "./ui"

export interface IHud {
  alive: number
}

export interface RoundStartConfig extends IHud {
  textElement: TextElement
  radius: StepOffset
  angle: StepOffset
  zOffset: StepOffset
}

export interface DamageConfig extends IHud {
  textElement: TextElement
}

export interface NametagConfig extends IHud {
  textElement: TextElement
  health: {
    width: number
    height: number
    border: number
    gradient: {
      empty: [number, number, number]
      full: [number, number, number]
    }
  }
}