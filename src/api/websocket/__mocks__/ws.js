let wsMock = jest.genMockFromModule('ws')

wsMock.WebSocket = class {
  static Server = class {
    constructor(_, callback) {
      callback()
    }
  }
}

export default wsMock
