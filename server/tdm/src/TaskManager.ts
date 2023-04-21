import { toMs } from "../../league-core/src/helpers"

export type Task = () => void | Promise<void>

export default new class TaskManager {
  private tasks: Map<Task, number> = new Map()
  private timeout: ReturnType<typeof setTimeout>
  private tickms: number = 500
  private running: boolean = false
  private runLimit: number = 10

  add(fn: Task, delaySeconds: number) {
    this.tasks.set(fn, toMs(delaySeconds) + Date.now())

    if (!this.running) this.start()

    return fn
  }

  remove(fn: Task) {
    this.tasks.delete(fn)

    if (!this.size) this.stop()
  }

  start() {
    if (this.running) return

    this.running = true
    this.tick()
  }

  stop() {
    this.running = false
    clearTimeout(this.timeout)
  }

  private tick() {
    clearTimeout(this.timeout)

    if (!this.running) return

    const now = Date.now()
    let iterate = 0

    for (const [fn, start] of this.tasks) {
      if (start < now) {
        try {
          const response = fn()

          if (response instanceof Promise) {
            response.catch(err => console.error(err))
          }
        } catch (err) {
          console.error(err)
        } finally {
          this.tasks.delete(fn)
          if (iterate++ > this.runLimit) break
        }
      }
    }

    if (!this.size) {
      return this.stop()
    }

    this.timeout = setTimeout(() => this.tick(), this.tickms)
  }

  get size() {
    return this.tasks.size
  }

  get isRunning() {
    return this.running
  }
}