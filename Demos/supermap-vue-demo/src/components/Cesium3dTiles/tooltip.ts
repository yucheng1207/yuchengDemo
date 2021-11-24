export default class Tooltip {
  private _div: any

  private _title: any

  private message: any

  constructor(frameDiv: any) {
    const div = document.createElement('DIV')
    div.className = 'twipsy right'

    const arrow = document.createElement('DIV')
    arrow.className = 'twipsy-arrow'
    div.appendChild(arrow)

    const title = document.createElement('DIV')
    title.className = 'twipsy-inner'
    div.appendChild(title)

    this._div = div
    this._title = title
    this.message = ''

    // add to frame div and display coordinates
    frameDiv.appendChild(div)
    div.onmousemove = (evt) => {
      this.showAt({ x: evt.clientX, y: evt.clientY }, this.message)
    }
  }

  public showAt = (position: any, message: any) => {
    if (position && message) {
      this.setVisible(true)
      this._title.innerHTML = message
      this._div.style.left = `${position.x + 10}px`
      this._div.style.top = `${position.y - this._div.clientHeight / 2}px`
      this.message = message
    }
  }

  public setVisible = (visible: any) => {
    this._div.style.display = visible ? 'block' : 'none'
  }
}
