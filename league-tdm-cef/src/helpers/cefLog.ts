import { Events } from "../../../league-core/src/types";

export default function cefLog (...args: any[]) {
  mp.trigger(Events["tdm.cef.log"], ...args)
}