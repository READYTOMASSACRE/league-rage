import { tdm } from "../../../core/src/types";

export default class Zone {
    constructor(readonly arena: tdm.Arena) {}

    in(x: number, y: number) {
        let prevIndex: number = this.area.length - 1
        let index = 0
        let inPolygon = false

        for (const [areaX, areaY] of this.area) {
            const [prevX, prevY] = this.area[prevIndex];

            const delta = (prevX - areaX) * (y - areaY) / (prevY - areaY) + areaX

            if (
                areaY > y != prevY > y &&    
                x < delta
            ) {
                inPolygon = !inPolygon
            }

            prevIndex = index++
        }

        return inPolygon
    }

    get center() {
        const x = this.area.map(([x]) => x)
        const y = this.area.map(([, y]) => y)

        const centerX = (Math.min(...x) + Math.max(...x)) / 2
        const centerY = (Math.min(...y) + Math.max(...y)) / 2

        const [[,,z]] = this.arena.attackers

        return new mp.Vector3(centerX, centerY, z)
    }

    get area() {
        return this.arena.area
    }
}