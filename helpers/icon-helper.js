const icons = require('../category-icon.json').icons[0]
// 考量到如果 icon 要改版或者是因為連結改變而死圖的話更改起來會很麻煩 所以不放進資料庫
module.exports = {
  setCategoryIcon: category => {
    if (Object.keys(icons).includes(category)) {
      return icons[category]
    }
    return icons.其他
  }
}
