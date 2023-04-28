import Key from './Key.js';

export default class Keyboard {
  constructor(keysMap) {
    this.numOfKeysInEachRow = [15, 15, 14, 14, 9];
    this.languages = ['eng', 'ru'];
    this.keysMap = Keyboard.#initKeys(keysMap);
    this.element = this.#createElement();
  }

  #currentLanguage = 'eng';

  #isShiftPressed = false;

  #isCapsLockPressed = false;

  #symbols = /[-._!"`'#%&,:;<>=@{}~$()*+/\\?[\]^№|]/;

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
      if (keyObj.isSpecial || typeof key.keyString === 'string') {
        return;
      }

      if (this.#isCapsLockPressed && !this.#symbols.test(key.keyString[this.#currentLanguage][1])) {
        return;
      }

      const [primaryKeyString, alternativeKeyString] = key.keyString[this.#currentLanguage];
      keyObj.activeKey = this.#isShiftPressed ? alternativeKeyString : primaryKeyString;
      keyObj.element.textContent = keyObj.activeKey;
    });
  }

  toggleCapsLock() {
    this.#isCapsLockPressed = !this.#isCapsLockPressed;

    Object.values(this.keysMap).forEach((key) => {
      const { keyObj } = key;

      if (
        keyObj.isSpecial
        || typeof key.keyString === 'string'
        || this.#symbols.test(key.keyString[this.#currentLanguage][1])
      ) {
        return;
      }

      const [lowerCase, upperCase] = key.keyString[this.#currentLanguage];
      keyObj.activeKey = this.#isCapsLockPressed ? upperCase : lowerCase;
      keyObj.element.textContent = keyObj.activeKey;
    });
  }

  #changeLanguageLayout() {
    const langIndex = this.languages.indexOf(this.#currentLanguage);
    this.#currentLanguage = this.languages[langIndex + 1] ?? this.languages[0];

    Object.values(this.keysMap).forEach((key) => {
      const { keyObj } = key;

      if (keyObj.isSpecial || typeof key.keyString === 'string') {
        return;
      }

      const [primaryKey, alternativeKey] = key.keyString[this.#currentLanguage];

      if (this.#symbols.test(alternativeKey)) {
        keyObj.activeKey = this.#isShiftPressed ? alternativeKey : primaryKey;
      } else {
        keyObj.activeKey = this.#isCapsLockPressed ? alternativeKey : primaryKey;
      }

      keyObj.element.textContent = keyObj.activeKey;
    });
  }

  handleKeyDown(e) {
    e.preventDefault();

    const pressedKey = this.keysMap[e.code]?.keyObj;
    if (!pressedKey) return;

    pressedKey.element.classList.add('pressed');

    if (
      (pressedKey.keyCode.includes('Alt') && e.ctrlKey)
      || (pressedKey.keyCode.includes('Control') && e.altKey)
    ) {
      this.#changeLanguageLayout();
    }

    if (e.ctrlKey || e.altKey) return;

    if (!pressedKey.isSpecial) {
      this.writeToTextArea(pressedKey.activeKey);
    } else if (pressedKey.keyCode.includes('Shift') && !this.#isShiftPressed) {
      this.toggleShiftLayout();
    } else if (pressedKey.keyCode === 'CapsLock') {
      this.toggleCapsLock();
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
