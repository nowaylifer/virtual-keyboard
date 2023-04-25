export default class Key {
  constructor(keyCode, keyData) {
    this.keyCode = keyCode;
    this.element = this.createElement(keyData);
  }

  createElement(keyData) {
    const keyEl = document.createElement('button');
    keyEl.textContent = `${keyData.keyString.eng?.[0] ?? keyData.keyString}`;
    keyEl.className = 'key';

    if (keyData.options?.includes('special')) {
      this.isSpecial = true;
      keyEl.classList.add('key--special');
    }

    if (keyData.options?.includes('long')) {
      keyEl.classList.add('key--long');
    }

    keyEl.onmousedown = () => keyEl.classList.add('pressed');
    keyEl.onmouseup = () => keyEl.classList.remove('pressed');

    keyEl.objKey = this;

    return keyEl;
  }
}
