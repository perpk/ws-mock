export const waitForSocket = (socket, state, timeWait = 5): Promise<void> => {
    return new Promise(function (resolve) {
        setTimeout(function() {
            if (socket.readyState === state) {
                resolve()
            } else {
                waitForSocket(socket, state).then(resolve)
            }
        }, timeWait)
    })
}