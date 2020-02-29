/*
  This library is used to manage the state of the app. State is managed with
  a JSON file. The file is opened at the start of the app and updated
  periodically as the app runs.

  The primary use of the state is to login and JWT token data.

  This kind of state management is only appropriate for small apps. Apps of any
  significant size would normally use a database to manage their state.
*/

const fs = require('fs')

const config = require('../config')

const currentState = {
  login: process.env.FULLSTACKLOGIN ? process.env.FULLSTACKLOGIN : 'demo@demo.com',
  password: process.env.FULLSTACKPASS ? process.env.FULLSTACKPASS : 'demo',
  jwtToken: config.BCHJSTOKEN
}

let _this

class State {
  constructor () {
    _this = this

    _this.config = config
    _this.currentState = currentState
  }

  // Read and parse the state JSON file. Create the state.json file if it does not exit.
  readState () {
    return new Promise(function (resolve, reject) {
      try {
        fs.readFile(_this.config.stateFileName, async (err, data) => {
          if (err) {
            if (err.code === 'ENOENT') {
              // console.log(`${_this.config.stateFileName} not found!`)
              console.log('state.json not found, creating it.')
              await _this.writeState()
              return _this.readState()
            } else {
              console.log(`err: ${JSON.stringify(err, null, 2)}`)
            }

            return reject(err)
          }

          const obj = JSON.parse(data)

          return resolve(obj)
        })
      } catch (err) {
        console.error('Error trying to read JSON state file in state.js/readState().')
        return reject(err)
      }
    })
  }

  // Write state to the state.json file.
  writeState () {
    return new Promise(function (resolve, reject) {
      try {
        const fileStr = JSON.stringify(currentState, null, 2)

        fs.writeFile(_this.config.stateFileName, fileStr, function (err) {
          if (err) {
            console.error('Error while trying to write state.json file.')
            return reject(err)
          } else {
            // console.log(`${fileName} written successfully!`)
            return resolve()
          }
        })
      } catch (err) {
        console.error('Error trying to write out state.json file in state.js/writeState().', err)
        return reject(err)
      }
    })
  }
}

module.exports = State