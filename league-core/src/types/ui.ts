export interface TextStyle {
  font: number
  centre: boolean
  color: RGBA
  scale: [number, number]
  outline: boolean
}

export interface TextElement {
    text: string
    style: TextStyle
    position?: Array2d | Array3d
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