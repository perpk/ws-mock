const express = jest.fn(() => {
  return {
    use,
    listen
  }
})

export default express

export const json = jest.fn(() => {})

export const use = jest.fn(() => {})

export const listen = jest.fn(() => { return { close } })

export const close = jest.fn(() => {})
