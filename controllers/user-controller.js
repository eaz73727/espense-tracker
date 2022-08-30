const passport = require('passport')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

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
  postRegister: (req, res, next) => {
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
        if (user) throw new Error('信箱已註冊')
        return bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => {
            User.create({
              name,
              email,
              password: hash
            })
              .then(() => {
                req.flash('success_msg', '註冊成功，請登入以使用')
                res.redirect('/users/login')
              })
          })
      })
      .catch(err => next(err))
  },
  logout: (req, res, next) => {
    req.logout(err => {
      if (err) return next(err)
      req.flash('success_msg', '您已成功登出')
      res.redirect('/users/login')
    })
  }
}

module.exports = userController
