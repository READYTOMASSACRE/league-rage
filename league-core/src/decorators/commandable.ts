import { env } from "../helpers"

const server = <T extends Core.ctor>(target: T): T => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      if (!Reflect.getMetadata(Core.Decorator.commandsInit, target.prototype)) {
        const list: Core.Command[] = Reflect.getMetadata(Core.Decorator.commands, this) || []

        for (const {commands, descriptions, descriptor, group, method} of list) {
          if (!commands.length) {
            continue
          }

          const callback = descriptor.value

          if (typeof callback !== 'function') {
            throw new Error(`Commands ${commands.join(', ')} should be callable`)
          }

          if (group) {
            commands.forEach((name) => {
              console.log(
                `[COMMANDS /${group} ${name.cyan.underline}]`,
                this.constructor.name.green+'.'+method.magenta.underline+'::()'
              )
            })
            mp.events.addCommand(
              group,
              (player: any, fullText: string, ...args: any[]) => {
                const [callableCommand] = args
                const commandIndex = commands.findIndex((commandName) => commandName === callableCommand)

                if (!callableCommand || commandIndex === -1) {
                  descriptions.forEach((text) => player.outputChatBox(text))
                  return;
                }

                callback.apply(this, [player, fullText, descriptions[commandIndex], ...args])
              }
            )
          } else {
            commands.forEach((name, index) => {
              console.log(
                `[COMMANDS /${name.cyan.underline}]`,
                this.constructor.name.green+'.'+method.magenta.underline+'::()'
              )
              mp.events.addCommand(
                name,
                (player: any, fullText: string, ...args: any[]) =>
                  callback.apply(this, [player, fullText, descriptions[index], ...args])
              )
            })
          }
        }

        Reflect.defineMetadata(Core.Decorator.commandsInit, true, target.prototype)
      }
    }
  }
}

const client = <T extends Core.ctor>(target: T): T => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      if (!Reflect.getMetadata(Core.Decorator.commandsInit, target.prototype)) {
        const list: Core.Command[] = Reflect.getMetadata(Core.Decorator.commands, target.prototype) || []
        const indexByCommand: Record<string, any> = {}

        for (const {commands, descriptions, descriptor, group} of list) {
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
          })          
        }

        mp.events.add("playerCommand", (input: string) => {
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

        Reflect.defineMetadata(Core.Decorator.commandsInit, true, target.prototype)
      }
    }
  }
}

export const commandable = env === Core.Enviroment.client ? client : server
