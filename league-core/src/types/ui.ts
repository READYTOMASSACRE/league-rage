export interface TextStyle {
  font: number
  centre: boolean
  color: [number, number, number, number]
  scale: [number, number]
  outline: boolean
}

export interface TextElement {
    text: string
    style: TextStyle
    position?: [number, number] | [number, number, number]
}

export interface StepOffset {
  current: number
  step: number
  max?: number
}

export interface IHud {
  alive: number
}

export interface RoundStartConfig extends IHud {
  textElement: TextElement
  radius: StepOffset
  angle: StepOffset
  zOffset: StepOffset
}

export interface HudConfig {
  roundStart: RoundStartConfig
}

export interface InteractionConfig {
  selector: TeamSelectorConfig
}

export interface TeamSelectorConfig {
  cam: {
    vector: [number, number, number]
    rotation: [number, number, number]
    fov: number
    pointAt: [number, number, number]
  }
  ped: {
    vector: [number, number, number]
    heading: number
    dance: string
    dimension: number
  }
}