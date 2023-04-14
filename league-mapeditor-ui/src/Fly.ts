/**
 * Fly mechanics
 */
export default class Fly {
  static readonly fastSpeed = 8
  static readonly defaultSpeed = 0.1
  static readonly normalSpeed = 1.5
  static readonly cameraName = "FLYING_CAM"
  static readonly controls = {
    w: 32,
    s: 33,
    a: 34,
    d: 35,
    space: 321,
    lctrl: 326,
    f5: 327,
    lshift: 21,
    lalt: 19,
  }

  private flying: boolean = false

  private float: number = 2
  private width: number = 2
  private height: number = 2

  private cam: CameraMp = mp.cameras.new(Fly.cameraName)
  private gameplayCam: CameraMp = mp.cameras.new('gameplay')
  private speed: number = Fly.defaultSpeed
  private interval: number = 0

  constructor(private player: PlayerMp = mp.players.local) {}

  /**
   * Toggle current state
   * @param {boolean} state 
   */
  toggle(state: boolean): void {
    clearInterval(this.interval)
    if (state === true) {
      this.interval = setInterval(() => this.render, 0)
    }
  }

  /**
   * Render method
   */
  private render(): void {
    if (mp.game.controls.isControlJustPressed(0, Fly.controls.f5)) this.toggleFlying()
    if (this.flying) this.move()
  }

  /**
   * Toggle flying state
   */
  private toggleFlying(): void {
    this.flying = !this.flying

    this.player.setInvincible(this.flying)
    this.player.freezePosition(this.flying)
    this.player.setAlpha(this.flying ? 0 : 255)
    
    if (!this.flying
      && !mp.game.controls.isControlPressed(0, Fly.controls.space)
    ) {
      let position    = this.player.position;
      position.z      = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false)

      this.player.setCoordsNoOffset(position.x, position.y, position.z, false, false, false)
    }
  }

  /**
   * Make a movement
   */
  private move(): boolean {
    let position    = this.player.position
    const direction = this.gameplayCam.getDirection()

    if (mp.game.controls.isControlPressed(0, Fly.controls.lshift)) {
      this.speed = Fly.fastSpeed
    } else if (mp.game.controls.isControlPressed(0, Fly.controls.lalt)) {
      this.speed = Fly.normalSpeed
    } else {
      this.speed = Fly.defaultSpeed
    }

    if (mp.game.controls.isControlPressed(0, Fly.controls.w)) {
      position = this.moveStraight(position, direction, this.speed)
    } else if (mp.game.controls.isControlPressed(0, Fly.controls.s)) {
      position = this.moveBack(position, direction, this.speed)
    }

    if (mp.game.controls.isControlPressed(0, Fly.controls.a)) {
      position = this.moveLeft(position, direction, this.speed)
    } else if (mp.game.controls.isControlPressed(0, Fly.controls.d)) {
      position = this.moveRight(position, direction, this.speed)
    }

    if (mp.game.controls.isControlPressed(0, Fly.controls.space)) {
      position = this.moveUp(position, direction, this.speed)
    } else if (mp.game.controls.isControlPressed(0, Fly.controls.lctrl)) {
      position = this.moveDown(position, direction, this.speed)
    }

    this.player.setCoordsNoOffset(position.x, position.y, position.z, false, false, false)

    return true
  }

  /**
   * Straight movement
   * 
   * @param {Vector3} position 
   * @param {Vector3} direction 
   */
  private moveStraight(position: Vector3, direction: Vector3, speed: number): Vector3 {
    position.x += direction.x * speed
    position.y += direction.y * speed
    position.z += direction.z * speed

    return position
  }

  /**
   * Back movement
   * 
   * @param {Vector3} position 
   * @param {Vector3} direction 
   */
  private moveBack(position: Vector3, direction: Vector3, speed: number): Vector3 {
    position.x -= direction.x * speed
    position.y -= direction.y * speed
    position.z -= direction.z * speed

    return position
  }

  /**
   * Left movement
   * 
   * @param {Vector3} position 
   * @param {Vector3} direction 
   */
  private moveLeft(position: Vector3, direction: Vector3, speed: number): Vector3 {
    position.x += (-direction.y) * speed
    position.y += direction.x * speed

    return position
  }

  /**
   * Right movement
   * 
   * @param {Vector3} position 
   * @param {Vector3} direction 
   */
  private moveRight(position: Vector3, direction: Vector3, speed: number): Vector3 {
    position.x -= (-direction.y) * speed
    position.y -= direction.x * speed

    return position
  }

  /**
   * Up movement
   * 
   * @param {Vector3} position 
   * @param {Vector3} direction 
   */
  private moveUp(position: Vector3, direction: Vector3, speed: number): Vector3 {
    position.z += speed;

    return position
  }

  /**
   * Down movement
   * 
   * @param {Vector3} position 
   * @param {Vector3} direction 
   */
  private moveDown(position: Vector3, direction: Vector3, speed: number): Vector3 {
    position.z -= speed;

    return position
  }

  get isFlying() {
    return this.flying
  }
}