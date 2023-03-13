import WsMock from './WsMock'

import http from 'http'
import WebSocket, { send, Server } from 'ws'
import CacheManager from '../../cache/CacheManager'
import Mapping from '../../domain/mapping/Mapping'
import { debug, warn } from 'bunyan'

const spyCreateServer = jest.spyOn(http, 'createServer')

describe('Infrastructure', () => {
  test('An Instance can be created via the static methods provided', () => {
    const wsMock = WsMock.instance(9999)
    expect(spyCreateServer).toBeCalledTimes(1)
    expect(wsMock).not.toBeNull()
  })

  test('The created WsMock Instance is unique once created', () => {
    const wsMock_1 = WsMock.instance(9999)
    const wsMock_2 = WsMock.instance(9999)

    expect(wsMock_1).toStrictEqual(wsMock_2)
  })

  test('The create method creates a new WebSocket server instance', () => {
    const wsMock = WsMock.instance(9999)
    expect(wsMock.create()).toBe(wsMock)
    expect(Server).toBeCalledTimes(1)
  })

  test('The start method starts the WebSocket server', () => {
    const wsMock = WsMock.instance(9999)
    const listen = jest.fn()
    jest.replaceProperty(wsMock, '_server', { listen })
    expect(wsMock.start()).toStrictEqual(wsMock)
    expect(listen).toBeCalledTimes(1)
  })
})

describe('Caching', () => {
  test('Adding a mapping creates a new cache entry', () => {
    const wsMock = WsMock.instance(9999)
    CacheManager.createEntry = jest.fn()
    wsMock.addMapping({ path: '1', response: { three: 3 } } as Mapping)
    expect(CacheManager.createEntry).toBeCalledTimes(1)
  })

  test('Removing all mappings empties the cache', () => {
    const wsMock = WsMock.instance(9999)
    CacheManager.removeAll = jest.fn()
    wsMock.removeMappings()
    expect(CacheManager.removeAll).toBeCalledTimes(1)
  })
})

describe('Trigger WebSocket Server', () => {
  test('Triggering the server sends a message to all currently open websockets', () => {
    const wsMock = WsMock.instance(9999).create().start()
    CacheManager.getEntry = jest.fn(() => {
      return { test: 'title' }
    })
    wsMock.triggerWsServer({ path: '/path' })
    expect(send).toBeCalledTimes(2)
    expect(send).toHaveReturnedWith('{"test":"title"}')
    expect(debug).toBeCalledTimes(2)
  })

  test('Nothing is sent if no clients are connected', () => {
    const wsMock = WsMock.instance(9999).create().start()
    const sendToClientPayload = { test: 'noClient' }
    CacheManager.getEntry = jest.fn(() => {
      return sendToClientPayload
    })

    const returned = wsMock.triggerWsServer({ path: '/any' })
    expect(returned).toStrictEqual(wsMock)
    expect(send).not.toHaveBeenCalledWith(JSON.stringify(sendToClientPayload))
    expect(warn).toHaveBeenCalledTimes(1)
  })
})
