const User = require('../models/user')
const Record = require('../models/record')
const Category = require('../models/category')
const record = require('../models/record')

const expenseTrackerController = {
  homePage: (req, res, next) => {
    const userId = req.user._id
    Record.find({ userId })
      .lean()
      .sort({ _id: 'asc' })
      .then(records => {
        return Category.find(records.categoryId)
          .lean()
          .then(options => {
            const recordList = Array.from(records, record => {
              options.map(option => {
                if (record.categoryId.equals(option._id)) {
                  return record.categoryName = option.name
                }
              })
              return record
            })
            return recordList
          })
          .then(records => res.render('home', { records }))
      })
      .catch(err => next(err))
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
          categoryId: option._id
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