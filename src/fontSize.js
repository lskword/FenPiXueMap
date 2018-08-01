window.onresize = fontSizeS
function fontSizeS () {
  var winWidth = document.documentElement.clientWidth || document.body.clientWidth
  var size = (winWidth / 1920) * 100
  if (size > 100) {
    size = 100
  } else if (size < 14) {
    size = 14
  }
  document.documentElement.style.fontSize = size + 'px'
  console.log(size);
}
fontSizeS()
