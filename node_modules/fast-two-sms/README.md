<h1 align="center">Welcome to fast-two-sms 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/fast-two-sms" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/fast-two-sms.svg">
  </a>
  <a href="https://github.com/raxraj/fast2sms#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/raxraj/fast2sms/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/raxraj/fast2sms/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/raxraj/fast-two-sms" />
  </a>
  <a href="https://twitter.com/raxrajtwit" target="_blank">
    <img alt="Twitter: raxrajtwit" src="https://img.shields.io/twitter/follow/raxrajtwit.svg?style=social" />
  </a>
</p>

The Module to send Message using FAST2SMS.com

### 🏠 [Homepage](https://github.com/raxraj/fast2sms#readme)

## Installation
Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install fast-two-sms --save
```

This package is provided in these module formats:

- CommonJS

## Usage

```js
const fast2sms = require('fast-two-sms')

var options = {authorization : YOUR_API_KEY , message : 'YOUR_MESSAGE_HERE' ,  numbers : ['9999999999','8888888888']} 
fast2sms.sendMessage(options) //Asynchronous Function.
```
Other than Above You may also use following options for more control.

```

You may also set the other FAST2SMS options :-
method    -     Method for request (Default : POST)
sender_id -     A custom name for SMS sender (Default: FSTSMS)
language  -     english / unicode (Unicode supports other languages such as Hindi) (Default: english)
route     -     p for promotional and t for transactional (Default: p)
flash     -     This field is optional, it will use "0" as default value or you can set to "1" for sending flash message. 
showLogs  -     Default is 'true'. Recommended to not set this explicitly. Set this to false if you don't want any log message to be printed.
```
You can also send Quick Transanctional Message using this module, read about Quick transactional API for Fast2sms here - [fast2sms.com/quick-transactional-api]{https://docs.fast2sms.com/#quick-transactional-api}

```
To send 'Quick Transactional' Messages change the following options :-
route            -     qt
variables        -     Variables used like: "{#AA#}|{#EE#}|{#CC#}" seperated by pipe "|".
variables_values -     Above variables values like: "Rahul|8888888888|6695" seperated by pipe "|".

```



# Get Response Object
If you have explicitly defined showLogs and set it to 'false', it is highly recommended to get the response object from the server to verify the status.

To recieve the response object use then(), as shown:

```js
    fast2sms.sendMessage(options).then(response=>{
      console.log(response)
    })
```

If you prefer async/await, it can be done by wrapping the code in an asynchronous function.

```js
    async function smsSend(options){
      const response = await fast2sms.sendMessage(options)
      console.log(response)
    }
```

# Get Wallet Balance
You can now, fetch your wallet balance using this module just call the function `getWalletBalance(authorization: String)`
```js
const {wallet} = await fast2sms.getWalletBalance(authorization) //{returns {return:true, wallet: XX.XX}}
```

## Installing Older Version

>:warning : ** From V2.0.0 Contains some breaking changes.To download older version run the following command**: 

```sh
  npm install fast-two-sms@1.0.4 --save
```

## Author

👤 **Ashutosh Kumar**

* Website: raxraj.github.io
* Twitter: [@raxrajtwit](https://twitter.com/raxrajtwit)
* Github: [@raxraj](https://github.com/raxraj)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/raxraj/fast2sms/issues). You can also take a look at the [contributing guide](https://github.com/raxraj/fast2sms/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [raxraj](https://github.com/raxraj).<br />
This project is [MIT](https://github.com/raxraj/fast2sms/blob/master/LICENSE) licensed.
