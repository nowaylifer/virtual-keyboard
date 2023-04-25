export default class Key {
  static createElement(keyData) {
    const keyEl = document.createElement('button');
    keyEl.textContent = `${keyData[1].eng?.[0] ?? keyData[1]}`;
    keyEl.className = 'key';

    if (keyData.includes('special')) {
      keyEl.classList.add('key--special');
    }

    if (keyData.includes('long')) {
      keyEl.classList.add('key--long');
    }

    return keyEl;
  }

  constructor(keyData) {
    const [keyCode, keyName] = keyData;
    this.keyCode = keyCode;
    this.keyName = keyName;
    this.element = Key.createElement(keyData);
  }
}
