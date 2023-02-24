import BroadCastError from "./BroadCastError"

export default class PermissionError extends BroadCastError {
  constructor(permission: string, player?: PlayerMp | number) {
    super(`Invalid permission ${permission}`, player)
  }
}