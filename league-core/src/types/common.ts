import { Config as WeaponConfig } from './weapon'
import { RoundConfig, TeamConfig, VoteConfig } from './tdm';
import { EffectsConfig, HudConfig, InteractionConfig } from './ui';
import { StatisticConfig } from './statistic';

export type ctor<T = {}> = new (...args: any[]) => T
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

export enum DbAdapter {
  lokijs = 'lokijs',
  mongodb = 'mongodb'
}
export interface DbConfig {
  adapter: DbAdapter
  lokijs?: {
    database: string
    autoload?: boolean
    autosave?: boolean
    autosaveInterval?: number
  }
  mongodb?: {
    uri?: string
    host: string
    port: number
    username: string
    password: string
    database: string
    opts?: {
      tls?: boolean
      ssl?: boolean
      connectTimeoutMS?: number
      socketTimeoutMS?: number
      maxPoolSize?: number
      maxConnecting?: number
    }
  }
}

export interface IConfig {
  name: string
  gamemode: string
  welcomeText: string
  motd: string
  lang: string
  lobby: [number, number, number]
  cef: string
  team: TeamConfig
  weapon: WeaponConfig
  round: RoundConfig
  vote: VoteConfig
  hud: HudConfig
  interaction: InteractionConfig
  db: DbConfig
  statistic: StatisticConfig
  effects: EffectsConfig
  prefix: string
  rcon?: string
}

export interface ClientConfig extends Omit<IConfig, 'db' | 'rcon'> {
  version: string
}

export type userId = string

export type Catcher = { catch(err: Error): void }

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
  /** Fires when player submit weapon choice */
  'tdm.weapon.submit' = 'tdm.weapon.submit',
  /** Fires when player toggle weapon selector */
  'tdm.weapon.toggle' = 'tdm.weapon.toggle',
  /** Fires when weaponhud recieved data */
  'tdm.weaponhud.data' = 'tdm.weaponhud.data',
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
  /** Fires when scoreboard recieved data */
  'tdm.scoreboard.data' = 'tdm.scoreboard.data',
  /** Fires when player toggle scoreboard */
  'tdm.scoreboard.toggle' = 'tdm.scoreboard.toggle',
  /** Fires when player is loaded all services and ready to play */
  'tdm.player.ready' = 'tdm.player.ready',
  /** Fires when player has changed state */
  'tdm.player.state' = 'tdm.player.state',
  /** Fires when player has set data */
  'tdm.player.data' = 'tdm.player.data',
  /** Fires when player has set data */
  'tdm.player.sync_health' = 'tdm.player.sync_health',
  /** Fires when player has changed weapon state */
  'tdm.player.weapon_state' = 'tdm.player.weapon_state',
  /** Fires when player has changed weapon slot */
  'tdm.player.weapon_slot' = 'tdm.player.weapon_slot',
  /** Fires when player has changed team */
  'tdm.player.team' = 'tdm.player.team',
  /** Fires when player recieved damage from another player*/
  'tdm.player.incoming_damage' = 'tdm.player.incoming_damage',
  /** Fires from server when player gives damage to another player */
  'tdm.player.damage' = 'tdm.player.damage',
  /** Fires from server when player kills another player */
  'tdm.player.kill' = 'tdm.player.kill',
  /** Fires when player changed model */
  'tdm.player.model' = 'tdm.player.model',
  /** Fires when player has changed name */
  'tdm.player.change_name' = 'tdm.player.change_name',
  /** Fires when player have to spawn in lobby */
  'tdm.player.spawn_lobby' = 'tdm.player.spawn_lobby',
  /** Fires when player switch weapon on clientside */
  'tdm.player.switch_weapon' = 'tdm.player.switch_weapon',
  /** Fires when clientside should team select */
  'tdm.team.select' = 'tdm.team.select',
  /** Fires when clientside should team select */
  'tdm.team.select_toggle' = 'tdm.team.select_toggle',
  /** Fires from server when teams swapped */
  'tdm.team.swap' = 'tdm.team.swap',
  /** Fires when cef is console.log */
  'tdm.cef.log' = 'tdm.cef.log',
  /** Fires when cef should add debug message */
  'tdm.cef.debug' = 'tdm.cef.debug',
  /** Fires when cef recieves panel data */
  'tdm.cef.panel' = 'tdm.cef.panel',
  /** Fires when cef should show debug window */
  'tdm.cef.debug_toggle' = 'tdm.cef.debug_toggle',
  /** Fires when cef motd recieved data */
  'tdm.cef.motd' = 'tdm.cef.motd',
  /** Fires when cef spectate recieved data */
  'tdm.cef.spectate' = 'tdm.cef.spectate',
  /** Fires when player recieved new weapon data */
  'tdm.cef.weapon_hud' = 'tdm.cef.weapon_hud',
  /** Fires when cef recieves team winner */
  'tdm.cef.winner' = 'tdm.cef.winner',
  /** Fires when cef should show game effect */
  'tdm.cef.effects' = 'tdm.cef.effects',
  /** Fires when cef should update gamemode text */
  'tdm.cef.gamemode' = 'tdm.cef.gamemode',
  /** Fires when vote_arena requested from client/cef */
  'tdm.cef.vote.arena_request' = 'tdm.cef.vote.arena_request',
  /** Fires when someone push to popup */
  'tdm.popup.push' = 'tdm.popup.push',
  /** Fires when infopanel gets data */
  'tdm.infopanel.data' = 'tdm.infopanel.data',
  /** Fires when ui is ready */
  'tdm.ui.ready' = 'tdm.ui.ready',
  /** Fires when client is ready */
  'tdm.client.ready' = 'tdm.client.ready',
  /** Fires when cef recieves controls data */
  'tdm.controls.data' = 'tdm.controls.data',
  /** Fires when player start spectating */
  'tdm.spectate.start' = 'tdm.spectate.start',
  /** Fires when player stop spectating */
  'tdm.spectate.stop' = 'tdm.spectate.stop',
  /** Fires on clientside when spectate is preparing by streamingPlayer */
  'tdm.spectate.prepare' = 'tdm.spectate.prepare',
  /** Fires on clientside when player start/stop spectating */
  'tdm.spectate.client_toggle' = 'tdm.spectate.client_toggle',
  /** Fires when cef/client recieves text */
  'tdm.notify.text' = 'tdm.notify.text',
  /** Fires when client stops notify text */
  'tdm.notify.stop' = 'tdm.notify.stop',
  /** Fires when player change role */
  'tdm.permission.role' = 'tdm.permission.role',
  /** Fires when player has logged */
  'tdm.profile.login' = 'tdm.profile.login',
  /** Fires when clientsilde should update arenas */
  'tdm.arena.refresh' = 'tdm.arena.refresh',
  /** Fires when clientside/cef recieved language */
  'tdm.language' = 'tdm.language',
}

export const enum Procs {
  /** Returns all arenas or byId indexed by Id */
  'tdm.arena.get' = 'tdm.arena.get',
  /** Returns server config */
  'tdm.config.get' = 'tdm.config.get',
  /** Returns language by id */
  'tdm.language.get' = 'tdm.language.get',
  /** Moves player position while spectating */
  'tdm.spectate.move' = 'tdm.spectate.move',
  /** Returns player position while spectating */
  'tdm.spectate.get' = 'tdm.spectate.get',
  /** Returns player's profile */
  'tdm.statistic.profile.get' = 'tdm.statistic.profile.get',
  /** Returns player round's statistic */
  'tdm.statistic.round.get' = 'tdm.statistic.round.get',
  /** Returns round's timeleft */
  'tdm.round.timeleft' = 'tdm.round.timeleft',
}