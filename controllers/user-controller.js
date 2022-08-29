const userController = {
  pageLogin: (req, res) => {
    res.render('login')
  },
  pageRegister: (req, res) => {
    res.render('register')
  }
}

module.exports = userController