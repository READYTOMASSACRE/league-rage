export const enum Role {
  socialUser = 'socialUser',
  authUser = 'authUser',
  moderator = 'moderator',
  admin = 'admin',
  root = 'root'
}

export const enum Rule {
  tdmVote = 'tdmVote',
  tdmStop = 'tdmStop',
  tdmStart = 'tdmStart',
  tdmAdd = 'tdmAdd',
  tdmRemove = 'tdmRemove',
  tdmPause = 'tdmPause',
  tdmSwap = 'tdmSwap',
  tdmKick = 'tdmKick',
  tdmMute = 'tdmMute',
  tdmBan = 'tdmBan',
  tdmRole = 'tdmRole',
}

export type Right = {
  [key in Role]: Record<Rule, boolean> |  Record<string, boolean> | '*'
}