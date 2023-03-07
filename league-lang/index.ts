import { readFileSync } from 'fs'
import { resolve } from 'path'
import { proceable, proc } from '../league-core'
import { Procs } from '../league-core/src/types'
import { Lang } from './language'

@proceable
class LanguageService {

  @proc(Procs['tdm.language.get'])
  getProc(_: any, lang?: string) {
    if (!lang) {
      return {}
    }

    return this.get(lang)
  }

  get(lang: string): Record<Lang, string> {
    lang = lang.replace(/[^a-zA-Z0-9]/, '').toLocaleLowerCase()
    const path = resolve('./lang', `${lang}.json`)

    try {
      return JSON.stringify(readFileSync(path).toString()) as any
    } catch (err) {
      console.error(err)
    }
  }
}

export default new LanguageService()