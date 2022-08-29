const expenseTrackerController = {
  homePage: (req, res) => {
    res.render('home')
  },
  newTrackerPage: (req, res) => {
    res.render('new')
  }
}

module.exports = expenseTrackerController