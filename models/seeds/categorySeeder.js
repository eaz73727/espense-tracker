const db = require('../../config/mongoose')
const { category } = require('./seed.json')
const Category = require('../category')
db.once('open', () => {
  Category.create(category)
    .then(() => {
      console.log('category Done!')
      process.exit()
    })
})
