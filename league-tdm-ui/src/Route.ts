export interface IRoute {
    /**
     * Clear all points and stop render a route
     */
    clear(): void
    /**
     * Start describe process to show a route
     * @param {number}  hudColor The HUD color of the GPS path
     * @param {boolean} displayOnFoot Draws the path regardless if the player is in a vehicle or not.
     * @param {boolean} followPlayer Draw the path partially between the previous and next point based on the players position between them. When false, the GPS appears to not disappear after the last leg is completed.
     */
    start(hudColor?: number, displayOnFoot?: boolean, followPlayer?: boolean): void
    /**
     * Add points to the GPS path
     * @param {CW.TYPES.Vector2} vector
     */
    addPoint(x: number, y: number, z?: number): void
    /**
     * Set render on the map and minimap the GPS path
     * @param {boolean} toggle 
     * @param {number}  radarThickness 
     * @param {number}  mapThickness 
     */
    setRender(toggle: boolean, radarThickness?: number, mapThickness?: number): void
}

export class AbstractRoute implements IRoute {
    readonly hudColor = 6
    readonly displayOnFoot = true
    readonly followPlayer = false
    readonly radarThickness = 8
    readonly mapThickness = 8
    readonly _clear: string = ''
    readonly _start: string = ''
    readonly _addPoint: string = ''
    readonly _setRender: string = ''

    clear() {
        mp.game.invoke(this._clear)
    }

    start(hudColor?: number, displayOnFoot?: boolean, followPlayer?: boolean) {
        mp.game.invoke(
            this._start,
            typeof hudColor !== 'undefined' ? hudColor : this.hudColor,
            typeof displayOnFoot !== 'undefined' ? displayOnFoot : this.displayOnFoot,
            typeof followPlayer !== 'undefined' ? followPlayer : this.followPlayer
        )
    }

    addPoint(x: number, y: number, z: number = 0) {
        mp.game.invoke(this._addPoint, x, y, z)
    }

    setRender(toggle: boolean, radarThickness?: number, mapThickness?: number) {
        mp.game.invoke(
            this._setRender,
            toggle,
            typeof radarThickness !== 'undefined' ? radarThickness : this.radarThickness,
            typeof mapThickness !== 'undefined' ? mapThickness : this.mapThickness
        )
    }
}

export class Route extends AbstractRoute {
    readonly _clear = '0xE6DE0561D9232A64'
    readonly _start = '0xDB34E8D56FC13B08'
    readonly _addPoint = '0x311438A071DD9B1A'
    readonly _setRender = '0x900086F371220B6F'
}

export class MultiRoute extends AbstractRoute {
    readonly _clear = '0x67EEDEA1B9BAFD94'
    readonly _start = '0x3D3D15AF7BCAAF83'
    readonly _addPoint = '0xA905192A6781C41B'
    readonly _setRender = '0x3DDA37128DD1ACA8'
}