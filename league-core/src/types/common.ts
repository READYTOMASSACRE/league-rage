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

export const enum Decorator {
  events = 'rage:events',
  eventsInit = 'rage:events.init',
  commands = 'rage:commands',
  commandsInit = 'rage:commands:init',
}

export const enum Enviroment {
  client = 'client',
  server = 'server'
}

export type Point2d = [number,number]
export type Point3d = [number,number,number]

export interface IConfig {
  weaponConfig: WeaponConfig
}

export const enum Events {
  'tdm.vote' = 'tdm.vote',
  'tdm.vote.start' = 'tdm.vote.start',
  'tdm.vote.end' = 'tdm.vote.end',
  'tdm.weapon.request' = 'tdm.weapon.request',
  'tdm.round.prepare' = 'tdm.round.prepare',
  'tdm.round.start' = 'tdm.round.start',
  'tdm.round.end' = 'tdm.round.end',
  'tdm.round.add' = 'tdm.round.add',
  'tdm.round.remove' = 'tdm.round.remove',
  'tdm.round.pause' = 'tdm.round.pause',
}