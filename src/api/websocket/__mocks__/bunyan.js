let bunyanMock = jest.genMockFromModule('bunyan')

export const debug = jest.fn().mockImplementation((message) => message)
export const warn = jest.fn().mockImplementation((message) => message)
export const error = jest.fn().mockImplementation((message) => message)
export const info = jest.fn().mockImplementation((message) => message)

export const createLogger = jest.fn().mockImplementation(() => {
  return {
    debug,
    warn,
    error,
    info
  }
})
