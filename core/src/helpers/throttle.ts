interface ThrottleSettings {

  /**
  * If you'd like to disable the leading-edge call, pass this as false.
  **/
  leading?: boolean;

  /**
  * If you'd like to disable the execution on the trailing-edge, pass false.
  **/
  trailing?: boolean;
}

export interface Cancelable {
  cancel(): void;
}

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle<T extends Function>(
  func: T,
  wait: number,
  options?: ThrottleSettings): T & Cancelable {
  var timeout: any, context: any, args: any, result: any
  var previous = 0
  if (!options) options = {}

  var later = function() {
    previous = options!.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  };

  var throttled: any = function() {
    var _now = Date.now()
    if (!previous && options!.leading === false) previous = _now
    var remaining = wait - (_now - previous)
    // @ts-ignore
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = _now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options!.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  };

  throttled.cancel = function() {
    clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }

  return throttled
}

export default throttle