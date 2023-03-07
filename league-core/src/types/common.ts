import {Config as WeaponConfig} from './weapon'

export type ctor<T = {}> = new (...args: any[]) => T;
export type callable = (...args: any[]) => any

export interface Event {
  events: string[]
  method: string
  descriptor: TypedPropertyDescriptor<any>
}

export interface Command {
  commands: string[]
  descriptions: string[]
  descriptor: TypedPropertyDescriptor<any>
  group?: string
  method: string
}

export interface Proc {
  procs: string[]
  method: string
  descriptor: TypedPropertyDescriptor<any>
}

export const enum Decorator {
  events = 'rage:events',
  eventsInit = 'rage:events.init',
  commands = 'rage:commands',
  commandsInit = 'rage:commands:init',
  procs = 'rage:procs',
  procsInit = 'rage:procs:init',
}

export const enum Enviroment {
  client = 'client',
  server = 'server',
  cef = 'cef'
}

export type Point2d = [number,number]
export type Point3d = [number,number,number]

export interface IConfig {
  weaponConfig: WeaponConfig
}

export const enum Events {
  /** Fires when tdm gamemode starts */
  'tdm.start' = 'tdm.start',
  /** Fires when player has voted */
  'tdm.vote' = 'tdm.vote',
  /** Fires when vote has started */
  'tdm.vote.start' = 'tdm.vote.start',
  /** Fires when vote has ended */
  'tdm.vote.end' = 'tdm.vote.end',
  /** Fires when player requested weapon */
  'tdm.weapon.request' = 'tdm.weapon.request',
  /** Fires when round is preparing */
  'tdm.round.prepare' = 'tdm.round.prepare',
  /** Fires when round is starting */
  'tdm.round.start' = 'tdm.round.start',
  /** Fires when round is end */
  'tdm.round.end' = 'tdm.round.end',
  /** Fires when player has been added to round */
  'tdm.round.add' = 'tdm.round.add',
  /** Fires when player has been removed from round */
  'tdm.round.remove' = 'tdm.round.remove',
  /** Fires when round has been paused */
  'tdm.round.pause' = 'tdm.round.pause',
  /** Fires when player toggle chat */
  'tdm.chat.toggle' = 'tdm.chat.toggle',
  /** Fires when player push to chat */
  'tdm.chat.push' = 'tdm.chat.push',
  /** Fires when player toggle scoreboard */
  'tdm.scoreboard.toggle' = 'tdm.scoreboard.toggle'
}

export const enum Procs {
  /** Returns all arenas indexed by Id */
  'tdm.arena.getAll' = 'tdm.arena.getAll',
}