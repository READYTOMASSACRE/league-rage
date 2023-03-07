import Hud, { IHud } from "./Hud"

interface StepOffset {
    current: number
    step: number
    max?: number
}
interface TextElement {
    text: string
    style: TextStyle
    position?: Array2d | Array3d
}

interface TextStyle {
    font: number
    centre: boolean
    color: RGBA
    scale: [number, number]
    outline: boolean
}

export interface IRoundStart extends IHud {
    textElement: TextElement
    radius: StepOffset
    angle: StepOffset
    zOffset: StepOffset
}

interface RoundStart extends IRoundStart {}

class RoundStart extends Hud implements IRoundStart {
    static cameraName: string = 'roundStart'

    private camera = mp.cameras.new(RoundStart.cameraName)
    private vector = new mp.Vector3(0, 0, 0)

    constructor(config: IRoundStart = {
        textElement: {
            text: 'Arena is starting',
            position: [0.5, 0.5],
            style: {
                font: 4,
                centre: false,
                scale: [0.6, 0.6],
                color: [255, 255, 255, 255],
                outline: false
            }
        },
        alive: 5,
        radius: { current: 0, step: 0.1, max: 50 },
        angle: { current: 0, step: 0.5 },
        zOffset: { current: 0, step: 0.05, max: 25 },
    }) {
        super(config)
        Object.assign(this, config)
    }

    draw(code: string, vector: Vector3) {
        this.setCamera(true, vector)
        this.textElement.text = `Arena ${code} is starting`

        return super.draw()
    }

    destroy(err?: Error): void {
        this.setCamera(false)

        return super.destroy(err)
    }

    render() {
        this.moveCamera()

        mp.game.graphics.drawText(
            this.textElement.text,
            this.textElement.position,
            this.textElement.style
        )
    }

    private moveCamera() {
        const {x, y, z} = this.vector

        const rad = this.angle.current * Math.PI / 180
        const offsetX = this.radius.current * Math.cos(rad)
        const offsetY = this.radius.current * Math.sin(rad)

        this.angle.current += this.angle.step

        if (!this.radius.max || this.radius.max > this.radius.current) {
          this.radius.current += this.radius.step
        }
    
        if (!this.zOffset.max || this.zOffset.max > this.zOffset.current) {
          this.zOffset.current += this.zOffset.step
        }

        this.camera.setCoord(x + offsetX, y + offsetY, z + this.zOffset.current)
    }

    private setCamera(toggle: boolean, vector?: Vector3) {
        if (vector) {
            this.vector = vector
        }

        if (toggle) {
            const array3d = this.vector.toArray()

            this.camera.pointAtCoord(...array3d)
            this.camera.setCoord(...array3d)
        }

        const ease = false
        const easeTime = 0

        this.camera.setActive(toggle)
        mp.game.cam.renderScriptCams(toggle, ease, easeTime, true, false, 0)
    }
}

export default RoundStart