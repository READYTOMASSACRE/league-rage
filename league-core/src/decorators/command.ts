const registeredCommands: Record<string, boolean> = {}

const getCommandName = ({name, group, separator = '.'}: {
  name: string
  separator?: string
  group?: string
}) => [group, name].filter(Boolean).join(separator)

const validateParams = ({commands, ignoreDuplicate, group}: {
    commands: string[]
    group?: string
    ignoreDuplicate?: boolean
}) => {
  if (!ignoreDuplicate) {
    let duplicates: string[] = []

    for (const name of commands) {
      const commandName = getCommandName({name, group})

      if (registeredCommands[commandName]) {
        duplicates.push(commandName)
      }
    }

    if (duplicates.length) {
      throw new Error(`Duplicate command(s) ${duplicates.join(', ')}`)
    }
  }
}

/**
 * Decorator for adding commands to RAGE API
 *
 * @param {string | string[]} cmd - command(s) name, which will be added to mp.events.addCommand
 * @param {string | { group?: string, desc?: string }} params - additional params, add to group or add to description
 * 
 * Supports templates in the desc param:
 *  @template cmdName - name of command
 *  @template groupName - name of group (if added in the additional params)
 *
 * @example desc parameter template:
 * `Usage: /{{cmdName}} id`
 * `Usage: /{{groupName}} {{cmdName}} id`
 * 
 * decorator usage:
 * command("foo")
 * command(["bar", "baz"])
 * command("foo", "foogroup")
 * command("bar", { group: "foogroup", desc: "Custom description"})
 * 
 */
export const command = <T extends Function>(
  command: string | string[],
  params?: string | {group?: string, desc?: string, ignoreDuplicate?: boolean}
): MethodDecorator => {
  if (!params || typeof params === 'string') {
    params = {group: params as string}
  }

  const {group, desc, ignoreDuplicate} = params
  const commands = Array.isArray(command) ? command : [command]

  validateParams({ignoreDuplicate, commands, group})

  const descriptions = commands.map((name) => {
    const commandName = getCommandName({group, name})
    registeredCommands[commandName] = true;

    return desc
      ? desc
        .replace(/{{cmdName}}/, name)
        .replace(/{{groupName}}/, group)
      : `Usage /${getCommandName({group, name, separator: ' '})}`
  })

  return function(target: T, method: string, descriptor: TypedPropertyDescriptor<any>) {
    if (typeof descriptor.value !== 'function') {
      throw new Error(`Command(s) ${commands.join(', ')} must be callable`)
    }

    Reflect.defineMetadata(
      Core.Decorator.commands,
      [
        ...(Reflect.getMetadata(Core.Decorator.commands, target) || []),
        {commands, descriptions, descriptor, group, method}
      ],
      target
    )

    return descriptor
  }
}