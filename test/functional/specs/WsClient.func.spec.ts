import WebSocket from 'ws'
import { Mapping, Trigger, WsMock } from '../../../index'
import { waitForSocket } from '../../utils/utils'

const WS_MOCK_PORT = 9090
const TEST_TIMEOUT_MS = 10_000

jest.resetAllMocks()
jest.deepUnmock('ws')
jest.deepUnmock('http')
jest.deepUnmock('bunyan')

describe('A WebSocket Client uses the Mock Server', () => {
  let wsMock = null

  beforeEach(() => {
    wsMock = WsMock.instance(WS_MOCK_PORT).create().start()
    wsMock.removeMappings()
  })

  afterEach(() => {
    if (wsMock !== null) {
      wsMock.stop()
    }
  })

  test(
    'The client can connect and receive notifications',
    async () => {
      const wsClient = new WebSocket(`ws://localhost:${WS_MOCK_PORT}/test/123`)

      const textToTest = "Hey, how y'all doin'?"
      let receivedMessage = null
      
      const mapping: Mapping = {
        path: '/test/123',
        response: { text: textToTest }
      }
      wsMock.addMapping(mapping)
      
      await waitForSocket(wsClient, wsClient.OPEN)
      
      const trigger: Trigger = { path: '/test/123' }
      wsMock.triggerWsServer(trigger)
      
      wsClient.onmessage = (message) => {
        receivedMessage = message
        expect(receivedMessage).not.toBeNull()
        expect(JSON.parse(receivedMessage.data)).toEqual({text : textToTest})
      }
    }, TEST_TIMEOUT_MS
  )
})
