import Key from './Key.js';

export default class Keyboard {
  constructor(keysMap) {
    this.numOfKeysInEachRow = [15, 15, 14, 14, 9];
    this.keysMap = Keyboard.#initKeys(keysMap);
    this.element = this.#createElement();
  }

  #isShiftPressed = false;

  // create Key obj for each property in keysMap
  static #initKeys(keysMap) {
    const keysMapExtended = keysMap;

    Object.keys(keysMapExtended).forEach((key) => {
      keysMapExtended[key].keyObj = new Key(key, keysMap[key]);
    });

    return keysMapExtended;
  }

  #createElement() {
    const keyboardEl = document.createElement('div');
    keyboardEl.className = 'keyboard';

    const keysContainerEl = document.createElement('div');
    keysContainerEl.className = 'keyboard__keys-container';

    const arrOfKeyElements = Object.values(this.keysMap).map((item) => item.keyObj.element);
    let startIndex = 0;

    // append proper number of key elements to each keyboard row
    this.numOfKeysInEachRow.forEach((keysInRow) => {
      const keyboardRowEl = document.createElement('div');
      keyboardRowEl.className = 'keyboard__row';

      const currRowOfKeyElements = arrOfKeyElements.slice(startIndex, startIndex + keysInRow);
      keyboardRowEl.append(...currRowOfKeyElements);
      keysContainerEl.append(keyboardRowEl);
      startIndex += keysInRow;
    });

    keyboardEl.append(keysContainerEl);

    keyboardEl.addEventListener('click', (e) => this.handleMouseDown(e));
    return keyboardEl;
  }

  connectTextArea(element) {
    this.textArea = element;
  }

  writeToTextArea(keyString) {
    this.textArea.value += keyString;
  }

  toggleShiftLayout() {
    this.#isShiftPressed = !this.#isShiftPressed;

    Object.values(this.keysMap).forEach((key) => {
      const { keyObj } = key;
      if (keyObj.isSpecial || typeof key.keyString === 'string') return;
      const [primaryKeyString, alternativeKeyString] = key.keyString.eng;
      keyObj.activeKey = this.#isShiftPressed ? alternativeKeyString : primaryKeyString;
      keyObj.element.textContent = keyObj.activeKey;
    });
  }

  handleKeyDown(e) {
    const pressedKey = this.keysMap[e.code]?.keyObj;
    if (!pressedKey) return;
    if (pressedKey.keyCode === 'Space') {
      e.preventDefault();
    }

    pressedKey.element.classList.add('pressed');
    if (e.ctrlKey || e.altKey) return;

    if (!pressedKey.isSpecial) {
      this.writeToTextArea(pressedKey.activeKey);
    } else if (pressedKey.keyCode.includes('Shift') && !this.#isShiftPressed) {
      this.toggleShiftLayout();
    }
  }

  handleKeyUp(e) {
    const pressedKey = this.keysMap[e.code]?.keyObj;
    if (!pressedKey) return;
    pressedKey.element.classList.remove('pressed');

    if (pressedKey.keyCode.includes('Shift')) {
      this.toggleShiftLayout();
    }
  }

  handleMouseDown(e) {
    const pressedKey = e.target.closest('.key');

    if (!pressedKey) return;

    if (!pressedKey.isSpecial) {
      this.writeToTextArea(pressedKey.obj.activeKey);
    }
  }
}
