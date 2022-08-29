const passport = require("passport")
const User = require("../models/user")

const userController = {
  pageLogin: (req, res) => {
    res.render('login')
  },
  pageRegister: (req, res) => {
    res.render('register')
  },
  postLogin: passport.authenticate('local', {
    successRedirect: '/',
    failureFlash: true,
    failureRedirect: '/users/login'
  }),
  postRegister: (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位都是必填！' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不符！' })
    }
    if (errors.length) {
      return res.render('register', { errors, email, name })
    }
    User.findOne({ email })
      .then(user => {
        if (user) {
          errors.push({ message: '此信箱已註冊。' })
          return res.render('register', { name, email, errors })
        } else {
          User.create({
            name,
            email,
            password
          })
            .then(() => {
              req.flash('success_msg', '註冊成功，請登入以使用')
              res.redirect('/users/login')
            })
        }

      })
      .catch(err => console.log(err))
  }
}

module.exports = userController