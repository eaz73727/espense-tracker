if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')

const routes = require('./routes')
const usePassport = require('./config/passport')
require('./config/mongoose')
const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs.engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}))

usePassport(app)

app.use(routes)

app.listen(PORT, () => {
  console.log(`Server is now opening on http://localhost:${PORT}`)
})