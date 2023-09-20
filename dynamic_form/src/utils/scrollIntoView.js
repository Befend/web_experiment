export const scrollIntoView = function (selector, container, align) {
  let elem

  if (!(elem = typeof selector === 'string' ? document.querySelector(selector) : selector)) {
    return
  }

  if (container) {
    container = typeof container === 'string' ? document.querySelector(container) : container
  }

  if (!container) {
    container = elem.offsetParent
  }

  const elemOffset = offset(elem)
  const style = window.getComputedStyle(elem)
  const containerStyle = window.getComputedStyle(container)
  const eh = parseFloat(style.height)
  const ew = parseFloat(style.width)
  const containerOffset = offset(container)
  const ch = container.clientHeight
  const cw = container.clientWidth
  const containerScroll = {
    left: container.scrollLeft,
    top: container.scrollTop
  }

  const diffTop = {
    left: elemOffset[LEFT] - (containerOffset[LEFT] + (parseFloat(containerStyle['borderLeftWidth']) || 0)),
    top: elemOffset[TOP] - (containerOffset[TOP] + (parseFloat(containerStyle['borderTopWidth']) || 0))
  }
  const diffBottom = {
    left: elemOffset[LEFT] + ew - (containerOffset[LEFT] + cw + (parseFloat(containerStyle['borderRightWidth']) || 0)),
    top: elemOffset[TOP] + eh - (containerOffset[TOP] + ch + (parseFloat(containerStyle['borderBottomWidth']) || 0))
  }

  if (align === 'start') {
    container.scrollTop = containerScroll.top + diffTop.top
  } else if (align === 'end') {
    container.scrollTop = containerScroll.top + diffBottom.top
  } else {
    container.scrollTop = containerScroll.top + diffTop.top + (diffBottom.top - diffTop.top) / 2
  }
}
const LEFT = 'left'
const TOP = 'top'
const offset = function (selector) {
  let offset
  const position = {
    left: 0,
    top: 0
  }
  const elem = typeof selector === 'string' ? document.querySelector(selector) : selector

  if (elem) {
    offset = getPageOffset(elem)
    position.left += offset.left
    position.top += offset.top
  }
  return position
}

function getPageOffset(el) {
  const pos = getClientPosition(el)
  const left = window.pageXOffset || window.document.scrollLeft || window.document.documentElement.scrollLeft
  const top = window.pageYOffset || window.document.scrollTop || window.document.documentElement.scrollTop

  pos.left += left
  pos.top += top
  return pos
}

function getClientPosition(elem) {
  let x
  let y
  const doc = elem.ownerDocument
  const body = doc.body
  const docElem = window.document.documentElement

  if (!elem.getBoundingClientRect) {
    return {
      left: 0,
      top: 0
    }
  }
  const box = elem.getBoundingClientRect()

  x = box[LEFT]
  y = box[TOP]

  x -= docElem.clientLeft || body.clientLeft || 0
  y -= docElem.clientTop || body.clientTop || 0

  return {
    left: x,
    top: y
  }
}
