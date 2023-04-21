import 'reflect-metadata'

import config from './src/config'

export * from './src/decorators/command'
export * from './src/decorators/commandable'
export * from './src/decorators/ensurePlayer'
export * from './src/decorators/event'
export * from './src/decorators/eventable'
export * from './src/decorators/log'
export * from './src/decorators/proc'
export * from './src/decorators/proceable'
export * from './src/decorators/catchError'

export * as helpers from './src/helpers'
export * as types from './src/types'

export {config}