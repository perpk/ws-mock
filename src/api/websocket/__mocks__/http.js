const httpMock = jest.genMockFromModule("http")

httpMock.createServer = jest.fn(() => httpMock)

export default httpMock;