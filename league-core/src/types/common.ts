import { Config as WeaponConfig } from './weapon'
import { HudConfig } from './ui'
import { RoundConfig, TeamConfig, VoteConfig } from './tdm';

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
  name: string
  gamemode: string
  lang: string
  lobby: [number, number, number]
  cef: string
  team: TeamConfig
  weapon: WeaponConfig
  round: RoundConfig
  vote: VoteConfig
  hud: HudConfig
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
  'tdm.scoreboard.toggle' = 'tdm.scoreboard.toggle',
  /** Fires when player is loaded all services and ready to play */
  'tdm.player.ready' = 'tdm.player.ready',
  /** Fires when player has changed state */
  'tdm.player.state' = 'tdm.player.state',
  /** Fires when player has changed weapon state */
  'tdm.player.weaponstate' = 'tdm.player.weaponstate',
  /** Fires when player has changed team */
  'tdm.player.team' = 'tdm.player.team',
  /** Fires when clientside should team select */
  'tdm.team.select' = 'tdm.team.select',
}

export const enum Procs {
  /** Returns all arenas or byId indexed by Id */
  'tdm.arena.get' = 'tdm.arena.get',
  /** Returns server config */
  'tdm.config.get' = 'tdm.config.get',
  /** Returns language by id */
  'tdm.language.get' = 'tdm.language.get',
}