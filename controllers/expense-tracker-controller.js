const User = require('../models/user')
const Record = require('../models/record')
const Category = require('../models/category')

const expenseTrackerController = {
  homePage: (req, res) => {
    res.render('home')
  },
  newTrackerPage: (req, res) => {
    res.render('new')
  },
  postNewTracker: (req, res, next) => {
    const { name, date, category, amount } = req.body
    const userId = req.user._id
    Category.findOne({ name: category })
      .then(option => {
        if (!option) {
          return Category.create({
            name: category
          })
        }
        return option
      })
      .then(option => {
        Record.create({
          name,
          amount,
          date,
          userId,
          categoryId: option.id
        })
      })
      .then(() => {
        req.flash('success_msg', '成功建立！')
        res.redirect('/tracker')
      })
      .catch(err => {
        return next(err)
      })

  }
}

module.exports = expenseTrackerController