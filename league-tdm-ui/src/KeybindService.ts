export default class KeybindService {
	/**
	 * Binds the key
	 *
	 * @param keyCode Hexadecimal code of [key](https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731).
	 * @param keyHold True triggers on keydown, false triggers on keyup (bool)
	 * @param handler Function Handler
	 */
  bind(keyCode: number | number[], keyHold: boolean | boolean[], handler: Function) {
    keyCode = Array.isArray(keyCode) ? keyCode : [keyCode]
    keyHold = Array.isArray(keyHold) ? keyHold : [keyHold]

    for (const code of keyCode) {
      for (const upOrDown of keyHold) {
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
  unbind(keyCode: number | number[], keyHold: boolean | boolean[], handler?: Function) {
    keyCode = Array.isArray(keyCode) ? keyCode : [keyCode]
    keyHold = Array.isArray(keyHold) ? keyHold : [keyHold]

    for (const code of keyCode) {
      for (const upOrDown of keyHold) {
        mp.keys.unbind(code, upOrDown, handler)
      }
    }
  }
}

export const key: Record<string, number> = {
  t: 0x54,
  b: 0x42,
  tab: 0x09,
}