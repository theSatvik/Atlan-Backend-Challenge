const fast2sms = require('../index')
require('dotenv').config()

let authorization = process.env.AUHTORIZATION
let number = process.env.NUMBER

test('Responds with Wallet Balance', async () => {
    let response = await fast2sms.getWalletBalance(authorization)
    
    expect(response).toEqual({
        return: expect.any(Boolean),
        wallet: expect.any(String)
    })
    expect(response.return).toBe(true)
    expect(Number(response.wallet)).toEqual(expect.any(Number))
});

test('Responds with message:["Message sent successfully to NonDND numbers"] for Default Configuration', async () =>{
    const options = {authorization,message: 'Test Suite Message One',numbers:[number]}
    let response = await fast2sms.sendMessage(options)

    expect(response).toEqual({
        return: expect.any(Boolean),
        request_id: expect.any(String),
        message: expect.any(Array)
    })
    expect(response.return).toBe(true)
    expect(response.message[0]).toBe("Message sent successfully to NonDND numbers")
})

test('Responds with message:["Message sent successfully to NonDND numbers"] for method:GET', async () =>{
    const options = {authorization,message: 'Test Suite Message Two',method:'GET',numbers:[number]}
    let response = await fast2sms.sendMessage(options)

    expect(response).toEqual({
        return: expect.any(Boolean),
        request_id: expect.any(String),
        message: expect.any(Array)
    })
    expect(response.return).toBe(true)
    expect(response.message[0]).toBe("Message sent successfully to NonDND numbers")
})