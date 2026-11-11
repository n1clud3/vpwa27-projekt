/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractRawResponse, ExtractResponse, Method, PathWithRegistry, PatternsByMethod, RouteWithRegistry } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'
import type { routes } from './index.ts'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_tokens.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'profile.access_tokens.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/account/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
    }
  }
  'channels.channels.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/channels'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['index']>>>
    }
  }
  'channels.channels.create': {
    methods: ["POST"]
    pattern: '/api/v1/channels'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/channel').createChannelValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/channel').createChannelValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['create']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['create']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'channels.channels.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/channels/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['destroy']>>>
    }
  }
  'channels.channels.leave': {
    methods: ["DELETE"]
    pattern: '/api/v1/channels/:id/membership'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['leave']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['leave']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['leave']>>>
    }
  }
  'channels.channels.accept_invite': {
    methods: ["POST"]
    pattern: '/api/v1/channels/invites/:id/accept'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['acceptInvite']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['acceptInvite']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['acceptInvite']>>>
    }
  }
  'channels.channels.decline_invite': {
    methods: ["POST"]
    pattern: '/api/v1/channels/invites/:id/decline'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['declineInvite']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['declineInvite']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/channels_controller').default['declineInvite']>>>
    }
  }
}

export namespace Route {
  export type Request<Name extends keyof typeof routes> = RouteWithRegistry.Request<typeof routes, Name>
  export type Response<Name extends keyof typeof routes> = RouteWithRegistry.Response<typeof routes, Name>
  export type Params<Name extends keyof typeof routes> = RouteWithRegistry.Params<typeof routes, Name>
  export type Body<Name extends keyof typeof routes> = RouteWithRegistry.Body<typeof routes, Name>
  export type Query<Name extends keyof typeof routes> = RouteWithRegistry.Query<typeof routes, Name>
  export type Error<Name extends keyof typeof routes> = RouteWithRegistry.Error<typeof routes, Name>
}

export namespace Path {
  export type Request<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Request<typeof routes, M, P>
  export type Response<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Response<typeof routes, M, P>
  export type Params<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Params<typeof routes, M, P>
  export type Body<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Body<typeof routes, M, P>
  export type Query<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Query<typeof routes, M, P>
  export type Error<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Error<typeof routes, M, P>
}
