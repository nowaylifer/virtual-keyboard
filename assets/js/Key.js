export default class Key {
  constructor(keyCode, keyData, lang) {
    this.keyCode = keyCode;
    this.activeKey = `${keyData.keyString[lang]?.[0] ?? keyData.keyString}`;
    this.element = this.createElement(keyData);
  }

  createElement(keyData) {
    const keyEl = document.createElement('button');
    keyEl.textContent = this.activeKey;
    keyEl.className = 'key';

    if (keyData.options?.includes('special')) {
      this.isSpecial = true;
      keyEl.classList.add('key--special');
    }

    if (keyData.options?.includes('long')) {
      keyEl.classList.add('key--long');
    }

    if (this.keyCode === 'CapsLock') {
      keyEl.classList.add('key--caps-lock');
    }

    if (this.keyCode === 'ShiftRight') {
      keyEl.classList.add('key--right-shift');
    }

    keyEl.obj = this;

    return keyEl;
  }
}
