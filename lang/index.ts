import { resolve } from 'path'
import { proceable, proc } from '../core'
import { Procs } from '../core/src/types'
import { Lang } from './language'
import { readFile } from 'fs/promises'

@proceable
class LanguageService {

  @proc(Procs['tdm.language.get'])
  getProc(_: any, lang?: string) {
    if (!lang) {
      return {}
    }

    return this.get(lang)
  }

  async get(lang: string): Promise<Record<Lang, string>> {
    lang = lang.replace(/[^a-zA-Z0-9]/, '').toLocaleLowerCase()
    const path = resolve(__dirname, '../league-lang', './lang', `${lang}.json`)

    try {
      const data = await readFile(path)
      return JSON.parse(data.toString()) as any
    } catch (err) {
      console.error(err)
    }
  }
}

export default new LanguageService()