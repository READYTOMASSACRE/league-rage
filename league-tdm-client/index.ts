import {event, eventable} from '../league-core/client'

@eventable
class Foo {
  @event("event")
  bar() {
  }
}