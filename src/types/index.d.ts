type ctor<T = {}> = new (...args: any[]) => T;
declare enum Enviroment {
  client = 'client',
  server = 'server'
}


declare namespace Decorator {
  interface Event {
    events: string[]
    method: string
  }

  interface Command {
    commands: string[]
    descriptions: string[]
    method: string
    group?: string
  }

  enum Enum {
    events = 'rage:events',
    eventsInit = 'rage:events.init',
    commands = 'rage:commands',
    commandsInit = 'rage:commands:init',
  }
}