export interface IHud {
    alive: number
}

abstract class Hud implements IHud {
    public alive: number
    private callback: () => void
    private timeout: number
    private destroyed: boolean = false

    abstract render(): void

    constructor({ alive }: IHud) {
        this.alive = alive
        this.callback = () => {
            try {
                this.render()
            } catch (err) {
                this.destroy(err)
            }
        }
    }

    draw(..._: any[]) {
        if (this.destroyed) {
            throw new Error(`${this.constructor.name} is destroyed`)
        }

        if (this.alive > 0) {
            this.timeout = setTimeout(() => this.destroy(), this.alive)
        }

        mp.events.add('render', this.callback)
    }

    destroy(err?: Error) {
        if (this.destroyed) {
            return
        }

        mp.events.remove('render', this.callback)
        clearTimeout(this.timeout)
        this.destroyed = true

        if (err) {
            mp.console.logError(err.message)
        }
    }
}

export default Hud