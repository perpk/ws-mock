import HttpControlApi from "./HttpControlApi"
jest.mock('express')
import express, {json, use, listen, close} from "express"

describe('HttpControlApi', () => {

    test('An instance can be created via static method and multiple calls yield the same object', () => {
        const httpApi_1 = HttpControlApi.instance(8888)
        expect(httpApi_1).not.toBeNull()

        const httpApi_2 = HttpControlApi.instance(8888)
        expect(httpApi_2).toStrictEqual(httpApi_1)
    })

    test('An express server can be created via instance method', () => {
        const httpApi = HttpControlApi.instance(8888)
        const object = httpApi.create()
        expect(express).toBeCalledTimes(1)
        expect(json).toBeCalledTimes(1)
        expect(use).toBeCalledTimes(1)
        expect(use).toBeCalledWith(json())
        expect(object).toStrictEqual(httpApi)
    })

    test('An express server can be started via instance method', () => {
        const port = 8888
        const httpApi = HttpControlApi.instance(port)
        const object = httpApi.create().start()
        expect(object).toStrictEqual(httpApi)
        expect(listen).toBeCalledWith(port, expect.any(Function))
    })

    test('An express server can be stopped via instance method', () => {
        const httpApi = HttpControlApi.instance(8888).create().start()
        httpApi.stop()
        expect(close).toBeCalledWith(expect.any(Function))
    })
})