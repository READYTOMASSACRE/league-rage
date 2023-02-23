import 'reflect-metadata'
import PermissionService from "./src/tdm/PermissionService"
import PlayerService from "./src/tdm/PlayerService"
import RoundService from "./src/tdm/RoundService"
import TdmService from "./src/tdm/TdmService"

const main = () => {
  const playerService = new PlayerService()
  const permissionService = new PermissionService()
  const roundService = new RoundService(playerService)
  const tdmService = new TdmService(roundService, permissionService)

  mp.events.call('tdm.start')
}

main()

// const _loggable = (t: any): any => {
//   return class extends t {
//     constructor(...args: any[]) {
//       super(...args)

//       if (!Reflect.getMetadata('init', t.prototype)) {

//         const descriptors = Reflect.getMetadata('foo', t.prototype)

//         descriptors.forEach(descriptor => {
//           mp.events.addCommand('a', (player: PlayerMp, fullText: string, ...args: any[]) => {
//             console.log('on event call, apply context')

//             descriptor.value.apply(this, [1, 2, , "foo"])
//           })
//         })

//         Reflect.defineMetadata('init', true, t.prototype)
//       }
//     }
//   }
// }
// const _log = function(target: Object, method: string, descriptor: TypedPropertyDescriptor<any>) {

//   console.log('add _log', method)
//   Reflect.defineMetadata(
//     "foo",
//     [...(Reflect.getMetadata("foo", target) || []), descriptor],
//     target
//   )
// }
// class FooBar {
//   constructor(readonly baz: number = 1) {}
// }

// @_loggable
// class Foo {
//   constructor(readonly __foo: FooBar) {}

//   @log
//   @_log
//   bar() {
//     console.log('CALLING FOO')
//     console.log(this.__foo.baz)
//   }
// }

// @_loggable
// class Bar {
//   constructor(readonly __baz: FooBar) {}

//   @_log
//   baz() {
//     console.log('CALLING BAR')
//     console.log(this.__baz.baz)
//   }
// }

// const foo = new Foo(new FooBar())
// const bar = new Bar(new FooBar())