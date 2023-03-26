import console from "./helpers/console"

export default class KeybindService {
  public typing: boolean = false
  private bindings: Map<string, Function> = new Map()
	/**
	 * Binds the key
	 *
	 * @param keyCode Hexadecimal code of [key](https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731).
	 * @param keyHold True triggers on keydown, false triggers on keyup (bool)
	 * @param handler Function Handler
	 */
  bind(keyCode: number | number[], keyHold: boolean | boolean[], handler: Function, component?: string) {
    keyCode = Array.isArray(keyCode) ? keyCode : [keyCode]
    keyHold = Array.isArray(keyHold) ? keyHold : [keyHold]

    const oldHandler = handler
    const self = this

    handler = function () {
      if (self.typing) return
      return oldHandler.apply(this, arguments)
    }

    for (const code of keyCode) {
      for (const upOrDown of keyHold) {
        component = this.getKey(component, upOrDown)

        if (component) {
          if (this.bindings.has(component)) {
            continue
          }

          this.bindings.set(component, handler)
        }

        mp.keys.bind(code, upOrDown, handler)
      }
    }
  }

	/**
	 * Unbinds the key
	 *
	 * @param keyCode Hexadecimal code of [key](https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731).
	 * @param keyHold True triggers on keydown, false triggers on keyup (bool)
	 * @param handler Only unbind this function handler
	 */
  unbind(keyCode: number | number[], keyHold: boolean | boolean[], component?: string) {
    keyCode = Array.isArray(keyCode) ? keyCode : [keyCode]
    keyHold = Array.isArray(keyHold) ? keyHold : [keyHold]

    // todo null pointer
    // when unbind by component unbinad all keyCodes and rebind again
    for (const code of keyCode) {
      for (const upOrDown of keyHold) {
        component = this.getKey(component, upOrDown)
        const componentFn = this.bindings.get(component)
        if (component && typeof componentFn === 'function') {
          mp.keys.unbind(code, upOrDown, componentFn)
        } else {
          mp.keys.unbind(code, upOrDown)
        }

        this.bindings.delete(component)
      }
    }
  }

  private getKey(component?: string, keyHold?: boolean): string | undefined {
    if (!component) {
      return
    }

    return `${component}_${keyHold ? 'true' : 'false'}`
  }
}

export const key: Record<string, number> = {
  left: 0x25,
  up: 0x26,
  right: 0x27,
  down: 0x28,
  a: 0x41,
  b: 0x42,
  d: 0x44,
  s: 0x53,
  t: 0x54,
  w: 0x57,
  tab: 0x09,
  return: 0x0D,
  enter: 0x0D,
  vk_f2: 0x71,
  vk_f9: 0x78,
}