const User = require('../models/user')
const Record = require('../models/record')
const Category = require('../models/category')

const expenseTrackerController = {
  homePage: (req, res, next) => {
    const userId = req.user._id
    Record.find({ userId })
      .lean()
      .sort({ date: 'desc' })
      .then(records => {
        return Category.find(records.categoryId)
          .lean()
          .then(options => {
            records = records.map(record => {
              Array.from(options, option => {
                if (record.categoryId.equals(option._id)) {
                  record.date = record.date.toLocaleString()
                  record.categoryName = option.name
                }
                return option
              })
              return record
            })
            return res.render('home', { records })
          })
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
  },
  editTrackerPage: (req, res, next) => {
    const userId = req.user._id
    const _id = req.params.id
    Record.findOne({ userId, _id })
      .lean()
      .then(record => {
        Category.findById(record.categoryId)
          .lean()
          .then(option => {
            record.categoryName = option.name
            record.date = record.date.toISOString().split('.')[0]
            return res.render('edit', { record })
          })
      })
      .catch(err => next(err))
  },
  putTracker: (req, res, next) => {
    const userId = req.user._id
    const _id = req.params.id
    const { name, date, category, amount } = req.body
    if (!name || date || category || amount) {
      throw new Error('所有欄位都是必填呦！')
    }
    Category.findOne({ name: category })
      .then(option => {
        if (!option) {
          return Category.create({ name: category })
        }
        return option
      })
      .then(option => {
        console.log(option)
        req.body.categoryId = option._id
        Record.findOneAndUpdate({ id: _id, userId }, req.body)
          .then(() => {
            console.log('done')
            res.redirect('/tracker')
          })
      })
  },
  deleteTracker: (req, res, next) => {
    const userId = req.user._id
    const _id = req.params.id
    Record.findOneAndDelete({ id: _id, userId })
      .then(record => {
        Record.find({ categoryId: record.categoryId, userId })
          .lean()
          .then(records => {
            if (!records.length) {
              console.log(record.categoryId)
              console.log(userId)
              return Category.findOneAndDelete({ _id: record.categoryId })
            }
          })
      })
    .then(() => res.redirect('/tracker'))
    .catch(err => next(err))
  }

}

module.exports = expenseTrackerController
