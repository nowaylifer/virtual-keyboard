import Key from './Key.js';

export default class Keyboard {
  constructor(layout) {
    this.element = Keyboard.createElement(layout);
  }

  static createElement(layout) {
    const keyboardEl = document.createElement('div');
    keyboardEl.className = 'keyboard';

    const keysContainerEl = document.createElement('div');
    keysContainerEl.className = 'keyboard__keys-container';

    for (let i = 0; i < 5; i += 1) {
      const keyboardRowEl = document.createElement('div');
      keyboardRowEl.className = 'keyboard__row';

      for (let j = 0; j < layout[i].length; j += 1) {
        keyboardRowEl.append(new Key(layout[i][j]).element);
      }

      keysContainerEl.append(keyboardRowEl);
    }

    keyboardEl.append(keysContainerEl);
    return keyboardEl;
  }
}
