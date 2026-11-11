import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'channels.channels.index': { paramsTuple?: []; params?: {} }
    'channels.channels.create': { paramsTuple?: []; params?: {} }
    'channels.channels.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'channels.channels.leave': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'channels.channels.accept_invite': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'channels.channels.decline_invite': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'channels.channels.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'channels.channels.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'channels.channels.create': { paramsTuple?: []; params?: {} }
    'channels.channels.accept_invite': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'channels.channels.decline_invite': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'channels.channels.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'channels.channels.leave': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}