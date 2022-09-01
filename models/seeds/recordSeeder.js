const db = require('../../config/mongoose')
const { user, records } = require('./seed.json')
const User = require('../user')
const Record = require('../record')
const Category = require('../category')
const bcrypt = require('bcryptjs')

db.once('open', () => {

  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(user.password, salt))
    .then(hash => {
      return User.create({
        name: user.name,
        email: user.email,
        password: hash
      })
    })
    .then(user => {
      Category.find()
        .lean()
        .then(options => {
          return Promise.all(
            Array.from(records, record => {
              options.map(option => {
                if (record.category === option.name) {
                  record.categoryId = option._id
                  record.userId = user._id
                  record.date = Date()
                }
              })
              return Record.create(record)
            })
          )
        })
        .then(() => {
          console.log('User and Records Done!')
          process.exit()
        })
    })
})