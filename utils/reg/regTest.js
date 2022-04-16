let isMobile = function (mobile) {
  return /^1[3-9]\d{9}$/.test(mobile)
}


module.exports = {
  isMobile
}