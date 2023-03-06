import { env } from "../helpers"
import { Command, ctor, Decorator, Enviroment, Events } from "../types"

const server = <T extends ctor>(target: T): T => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      if (!Reflect.getMetadata(Decorator.commandsInit, target.prototype)) {
        const list: Command[] = Reflect.getMetadata(Decorator.commands, this) || []
        const indexByCommand: Record<string, any> = {}

        for (const {commands, descriptions, descriptor, method, group} of list) {
          if (group) {
            indexByCommand[group] = {
              group: true,
              descriptions,
            }
          }

          const callback = descriptor.value

          if (typeof callback !== 'function') {
            throw new Error(`Command(s) ${commands.join(', ')} should be callable`)
          }

          commands.forEach((name, index) => {
            const commandName = [group, name].filter(Boolean).join('.')

            indexByCommand[commandName] = {
              description: descriptions[index],
              callback,
            }

            printCommand({constructor: this.constructor.name, method, group, name})
          })          
        }

        mp.events.add(Events["tdm.chat.push"], (player: PlayerMp, fullText: string) => {
          const slash = fullText.slice(0, 1)
          const input = fullText.slice(1)

          if (slash !== '/') {
            return
          }

          const args = input.split(' ')
          const [groupName, ...commandArgs] = args
          const commandInfo = indexByCommand[groupName]

          if (!commandInfo) {
            return
          }

          if (commandInfo.group) {
            const {descriptions} = commandInfo
            const [name, ...commandArgsWithoutName] = commandArgs
            const commandName = [groupName, name].filter(Boolean).join('.')
            const groupCommandInfo = indexByCommand[commandName]
            
            if (!groupCommandInfo) {
              return (<string[]>descriptions || []).forEach(text => player.outputChatBox(text))
            } else {
              const {description, callback} = groupCommandInfo

              return callback.apply(this, [player, fullText, description, ...commandArgsWithoutName])
            }
          } else {
            const {description, callback} = commandInfo

            return callback.apply(this, [player, fullText, description, ...commandArgs])
          }
        })

        Reflect.defineMetadata(Decorator.commandsInit, true, target.prototype)
      }
    }
  }
}

const client = <T extends ctor>(target: T): T => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      if (!Reflect.getMetadata(Decorator.commandsInit, target.prototype)) {
        const list: Command[] = Reflect.getMetadata(Decorator.commands, target.prototype) || []
        const indexByCommand: Record<string, any> = {}

        for (const {commands, descriptions, descriptor, method, group} of list) {
          if (group) {
            indexByCommand[group] = {
              group: true,
              descriptions,
            }
          }

          const callback = descriptor.value

          if (typeof callback !== 'function') {
            throw new Error(`Command(s) ${commands.join(', ')} should be callable`)
          }

          commands.forEach((name, index) => {
            const commandName = [group, name].filter(Boolean).join('.')

            indexByCommand[commandName] = {
              description: descriptions[index],
              callback,
            }

            printCommand({constructor: this.constructor.name, method, group, name})
          })          
        }

        mp.events.add(Events["tdm.chat.push"], (input: string) => {
          try {
            const args = input.split(' ')
            const [groupName, ...commandArgs] = args
            const commandInfo = indexByCommand[groupName]

            if (!commandInfo) {
              return
            }

            if (commandInfo.group) {
              const {descriptions} = commandInfo
              const [name, ...commandArgsWithoutName] = commandArgs
              const commandName = [groupName, name].filter(Boolean).join('.')
              const groupCommandInfo = indexByCommand[commandName]
              
              if (!groupCommandInfo) {
                (<string[]>descriptions || []).forEach(text => (mp as any).gui.chat.push(text))
                return
              } else {
                const {description, callback} = groupCommandInfo
  
                return callback.apply(this, [description, ...commandArgsWithoutName])
              }
            } else {
              const {description, callback} = commandInfo
  
              return callback.apply(this, [description, ...commandArgs])
            }
          } catch (err) {
            (mp as any).gui.chat.push('Invalid register command: ' + err.message)
          }
        })

        Reflect.defineMetadata(Decorator.commandsInit, true, target.prototype)
      }
    }
  }
}

const printCommand = ({constructor, method, group, name}: {
  constructor: string, method: string, group?: string, name: string
}) => {
  if (env === Enviroment.server) {
    console.log(
      `[COMMANDS /${group && group + ' ' || ''}${name.cyan.underline}]`,
      constructor.green+'.'+method.magenta.underline+'::()'
    )
  } else {
    (mp as any).console.logInfo(`[COMMANDS /${group && group || ''}${name}] ${constructor}.${method}::()`)
  }
}

export const commandable = env === Enviroment.client ? client : server
