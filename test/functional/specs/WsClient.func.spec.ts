import WebSocket from 'ws'
import { Mapping, Trigger, WsMock } from '../../../index'
import CacheEntryNotFoundException from '../../../src/cache/CacheEntryNotFoundException'
import { waitForSocket } from '../../utils/utils'

const WS_MOCK_PORT = 9090
const TEST_TIMEOUT_MS = 10_000

jest.resetAllMocks()
jest.deepUnmock('ws')
jest.deepUnmock('http')
jest.deepUnmock('bunyan')

describe('A WebSocket Client uses the Mock Server', () => {
  let wsMock = null
  let wsClient = null

  beforeEach(() => {
    wsMock = WsMock.instance(WS_MOCK_PORT).create().start()
    wsMock.removeMappings()
  })

  afterEach(() => {
    if (wsMock !== null) {
      wsMock.stop()
    }
    if (wsClient !== null) {
      wsClient.close()
    }
  })

  test(
    'The client can connect and receive notifications',
    async () => {
      wsClient = new WebSocket(`ws://localhost:${WS_MOCK_PORT}/test/123`)

      const textToTest = "Hey, how y'all doin'?"

      const mapping: Mapping = {
        path: '/test/123',
        response: { text: textToTest }
      }
      wsMock.addMapping(mapping)

      await waitForSocket(wsClient, wsClient.OPEN)

      const trigger: Trigger = { path: '/test/123' }
      wsMock.triggerWsServer(trigger)

      wsClient.onmessage = (message) => {
        expect(message).not.toBeNull()
        expect(JSON.parse(message.data)).toEqual({ text: textToTest })
      }
    },
    TEST_TIMEOUT_MS
  )

  test(
    'The client receives only notifications they subscribed for',
    async () => {
      wsClient = new WebSocket(`ws://localhost:${WS_MOCK_PORT}/test/mymessage`)

      const textToReceive = 'Your client should read that'
      const textNotToReceive = 'None of your business'

      const mapping: Mapping = {
        path: '/test/mymessage',
        response: { text: textToReceive }
      }
      wsMock.addMapping(mapping)

      const otherMapping: Mapping = {
        path: '/test/other',
        response: { text: textNotToReceive }
      }
      wsMock.addMapping(otherMapping)

      const trigger: Trigger = { path: '/test/other' }
      wsMock.triggerWsServer(trigger)

      await waitForSocket(wsClient, wsClient.OPEN)

      wsClient.onmessage = (message) => {
        expect(message).not.toBeNull()
        expect(JSON.parse(message.data)).toEqual({ text: textToReceive })
      }
    },
    TEST_TIMEOUT_MS
  )

  test('The client can receive multiple messages', async () => {
    wsClient = new WebSocket(`ws://localhost:${WS_MOCK_PORT}/test/mymessage`)
    const firstTextToReceive = 'first text to receive'
    const secondTextToReceive = 'second text to receive'
    
    const firstMapping: Mapping = {
      path: '/test/mymessage',
      response: { text: firstTextToReceive }
    }
    
    const secondMapping: Mapping = {
      path: '/test/mymessage',
      response: { text: secondTextToReceive }
    }
    
    wsMock.addMapping(firstMapping)
    wsMock.addMapping(secondMapping)
    await waitForSocket(wsClient, wsClient.OPEN)
    
    const trigger: Trigger = { path: '/test/mymessage' }
    wsMock.triggerWsServer(trigger)
    
    const expectedMessages = [firstTextToReceive, secondTextToReceive]
    let actualMessages = []
    
    wsClient.onmessage = (message) => {
      actualMessages.push(JSON.parse(message.data).text)
    }
    
    wsClient.onclose = (_) => {
      expect(actualMessages.sort()).toEqual(expectedMessages.sort())
    }
  })
  
  test('No message is received if the appropriate mapping got removed and an error is thrown', async () => {
    wsClient = new WebSocket(`ws://localhost:${WS_MOCK_PORT}/test/never`)
    const neverReceived: Mapping = {
      path: '/test/never',
      response: { text: 'a text never received' }
    }
    
    wsMock.addMapping(neverReceived)
    await waitForSocket(wsClient, wsClient.OPEN)
    
    wsMock.removeMappings()

    const trigger: Trigger = { path: '/test/never' }
    expect(() => wsMock.triggerWsServer(trigger)).toThrow(CacheEntryNotFoundException)
    
    let actualMessages = []
    
    wsClient.onmessage = (message) => {
      actualMessages.push(JSON.parse(message.data).text)
    }

    wsClient.onclose = (_) => {
      expect(actualMessages).toEqual([])
    }
  })  
})
