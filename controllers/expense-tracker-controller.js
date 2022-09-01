const Record = require('../models/record')
const Category = require('../models/category')
const { setCategoryIcon } = require('../helpers/icon-helper')

const expenseTrackerController = {
  homePage: (req, res, next) => {
    const userId = req.user._id
    // 找出所有的支出
    Record.find({ userId })
      .lean()
      .sort({ date: 'desc' })
      .then(records => {
        // 透過支出表單的 CategoryId 從 Category表單找到這個 Category 的名稱(饒口
        let totalAmount = 0
        return Category.find()
          .lean()
          .sort({ name: 'desc' })
          .then(options => {
            records = records.map(record => {
              totalAmount += record.amount
              // date.toLocalString() 轉換成本地時間字串
              record.date = record.date.toLocaleString()
              Array.from(options, option => {
                // mongoose.js equals
                if (record.categoryId.equals(option._id)) {
                  record.categoryName = option.name
                  record.icon = setCategoryIcon(option.name)
                }
                return option
              })
              return record
            })
            return res.render('home', { records, totalAmount, options })
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
    if (!name || !date || !category || !amount) {
      throw new Error('所有欄位都是必填！')
    }
    // 透過名稱找尋是否有相同的 Category ，如果沒有 新增一個
    // 彈性設置標籤可以讓使用者細分自己的支出項目 Ex:機車耗材。
    // 而名稱可以著重在 "花了什麼" 上面
    // Ex: category:機車耗材 name: 機油
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
            // 把 date 物件轉換成 ISO 標準的 String 並且透過 split 以 . 為索引切割
            // Ex: 2022-08-30 18:06:00.000Z => ['2022-08-30 18:06:00', '000Z']
            // 以下把陣列第0項的參數傳入物件索引 record.date
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
    console.log(req.body)
    if (!name || !date || !category || !amount) {
      throw new Error('所有欄位都是必填！')
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
      .catch(err => next(err))
  },
  deleteTracker: (req, res, next) => {
    const userId = req.user._id
    const _id = req.params.id
    Record.findOneAndDelete({ id: _id, userId })
      .then(record => {
        Record.find({ categoryId: record.categoryId, userId })
          .lean()
          .then(records => {
            // 如果這個類別沒有其他的紀錄
            if (!records.length) {
              // 刪除沒有任何紀錄的類別
              return Category.findOneAndDelete({ _id: record.categoryId })
            }
          })
      })
      .then(() => res.redirect('/tracker'))
      .catch(err => next(err))
  },
  partialTracker: (req, res, next) => {
    const { category } = req.query
    if (category === 'all') {
      return res.redirect('/')
    }
    Record.find({ categoryId: category })
      .lean()
      .sort({ date: 'desc' })
      .then(records => {
        let totalAmount = 0
        Category.find()
          .lean()
          .sort({ name: 'desc' })
          .then(options => {
            records = records.map(record => {
              record.date = record.date.toLocaleString()
              totalAmount += record.amount
              Array.from(options, option => {
                if (record.categoryId.equals(option._id)) {
                  record.categoryName = option.name
                  record.icon = setCategoryIcon(option.name)
                }
                if (option._id.equals(category)) {
                  option.selected = 'selected'
                }
                return option
              })
              return record
            })
            res.render('home', { records, options, totalAmount })
          })
      })
      .catch(err => next(err))
  }

}

module.exports = expenseTrackerController
