import { HttpApi, Mapping } from '../../../index'
import axios from 'axios'

jest.resetAllMocks()
jest.deepUnmock('ws')
jest.deepUnmock('http')
jest.deepUnmock('bunyan')
jest.deepUnmock('express')

describe('A Client uses the Mock Server via the Http Api', () => {
  let httpApi = null

  beforeEach(() => {
    httpApi = HttpApi.instance(8888).create().start()
  })

  afterEach(() => {
    if (httpApi !== null) {
      httpApi.stop()
    }
  })

  test('Request the Http Api for currently available mappings returns an empty result', async () => {
    const result = await axios.get('http://localhost:8888/__config/mappings')
    expect(result.status).toBe(200)
    expect(result.data).toBe('[]')
  })

  test('Newly created mappings can be fetched via Api', async () => {
    const mapping: Mapping = {
      path: '/test/123',
      response: {
        text: '123'
      }
    }
    const createResult = await axios.post(
      'http://localhost:8888/__config/create',
      {
        ...mapping
      }
    )
    expect(createResult.status).toBe(204)

    const getResult = await axios.get('http://localhost:8888/__config/mappings')
    expect(getResult.status).toBe(200)
    expect(getResult.data).toStrictEqual(JSON.stringify([mapping]))
  })

  test('Resetting all Mappings yields an empty list when mappings are requested', async () => {
    await axios.delete('http://localhost:8888/__config/resetAll')
    const mapping: Mapping = {
      path: '/test/123',
      response: {
        text: '123'
      }
    }
    const createResult = await axios.post(
      'http://localhost:8888/__config/create',
      {
        ...mapping
      }
    )
    expect(createResult.status).toBe(204)

    let getResult = await axios.get('http://localhost:8888/__config/mappings')
    expect(getResult.status).toBe(200)
    expect(getResult.data).toStrictEqual(JSON.stringify([mapping]))

    const deleteResult = await axios.delete(
      'http://localhost:8888/__config/resetAll'
    )

    getResult = await axios.get('http://localhost:8888/__config/mappings')
    expect(getResult.status).toBe(200)
    expect(getResult.data).toStrictEqual(JSON.stringify([]))
  })
})
