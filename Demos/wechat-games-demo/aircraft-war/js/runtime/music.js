let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if (instance) return instance

    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src = 'aircraft-war/audio/bgm.mp3'

    this.shootAudio = new Audio()
    this.shootAudio.src = 'aircraft-war/audio/bullet.mp3'

    this.boomAudio = new Audio()
    this.boomAudio.src = 'aircraft-war/audio/boom.mp3'

    this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  playShoot() {
    this.shootAudio.currentTime = 0
    this.shootAudio.play()
  }

  playExplosion() {
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }
}
