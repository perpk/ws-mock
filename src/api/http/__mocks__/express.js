const express = jest.fn(() => {
  return {
    use,
    listen,
    post: jest.fn(() => {}),
    get: jest.fn(() => {}),
    delete: jest.fn(() => {})
  }
})

export default express

export const json = jest.fn(() => {})

export const use = jest.fn(() => {})

export const listen = jest.fn(() => { return { close } })

export const close = jest.fn(() => {})
