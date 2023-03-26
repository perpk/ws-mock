let wsMock = jest.genMockFromModule('ws')

export const Server = jest.fn().mockImplementation(function (_) {
  ;(this.clients = [
    new client(1, '/path', send),
    new client(1, '/path', send),
    new client(0, '/path', send),
    new client(1, '/anotherPath', send),
    new client(3, '/anotherPath', send)
  ]),
    (this.on = function (event, callback) {})
})

wsMock.WebSocket.Server = Server

wsMock.WebSocket.OPEN = 1

function client(readyState, path, send) {
  ;(this.readyState = readyState), (this.path = path), (this.send = send)
}

export const send = jest.fn().mockImplementation((value) => {
  return value
})

export default wsMock
