import { env } from ".."

const server = <T extends ctor>(target: T) => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      if (!Reflect.getMetadata(Decorator.Enum.commandsInit, target.prototype)) {
        const list: Decorator.Command[] = Reflect.getMetadata(Decorator.Enum.commands, target.prototype) || []

        for (const {commands, descriptions, method, group} of list) {
          if (!commands.length) {
            continue
          }

          if (typeof target.prototype[method] !== 'function') {
            throw new Error(`Commands ${commands.join(', ')} should be callable`)
          }

          const callback = target.prototype[method].bind(target)

          if (group) {
            mp.events.addCommand(
              group,
              (player: PlayerMp, fullText: string, ...args: any[]) => {
                const [callableCommand] = args
                const commandIndex = commands.findIndex((commandName) => commandName === callableCommand)

                if (!callableCommand || commandIndex === -1) {
                  descriptions.forEach((text) => player.outputChatBox(text))
                  return;
                }

                callback(player, fullText, descriptions[commandIndex], ...args)
              }
            )
          } else {
            commands.forEach((name, index) => (
              mp.events.addCommand(
                name,
                (player: PlayerMp, fullText: string, ...args: any[]) =>
                  callback(player, fullText, descriptions[index], ...args)
              )
            ))
          }
        }

        Reflect.defineMetadata(Decorator.Enum.commandsInit, true, target.prototype)
      }
    }
  }
}

const client = <T extends ctor>(target: T) => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      if (!Reflect.getMetadata(Decorator.Enum.commandsInit, target.prototype)) {
        const list: Decorator.Command[] = Reflect.getMetadata(Decorator.Enum.commands, target.prototype) || []
        const indexByCommand: Record<string, any> = {}

        for (const {commands, descriptions, method, group} of list) {
          if (group) {
            indexByCommand[group] = {
              group: true,
              descriptions,
            }
          }

          const callback = target.prototype[method]

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
                (<string[]>descriptions || []).forEach(text => mp.gui.chat.push(text))
                return
              } else {
                const {description, callback} = groupCommandInfo
  
                return callback(description, ...commandArgsWithoutName)
              }
            } else {
              const {description, callback} = commandInfo
  
              return callback(description, ...commandArgs)
            }
          } catch (err) {
            mp.gui.chat.push('Invalid register command: ' + err.message)
          }
        })

        Reflect.defineMetadata(Decorator.Enum.commandsInit, true, target.prototype)
      }
    }
  }
}

export const commandable = env === Enviroment.client ? client : server