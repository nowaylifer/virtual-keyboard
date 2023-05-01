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

    keyboardEl.addEventListener('mousedown', (e) => this.handleInputDown(e));
    return keyboardEl;
  }

  connectInputField(element) {
    this.inputField = element;
  }

  #writeText(
    string,
    from = this.inputField.selectionStart,
    to = this.inputField.selectionEnd,
  ) {
    this.inputField.setRangeText(string, from, to, 'end');
  }

  #deleteText(byKey) {
    if (!this.inputField.value) return;

    const { selectionStart, selectionEnd } = this.inputField;

    if (selectionStart !== selectionEnd) {
      this.#writeText('');
      return;
    }

    if (byKey === 'Backspace') {
      this.#writeText('', selectionStart - 1, selectionStart);
    } else {
      this.#writeText('', selectionStart, selectionStart + 1);
    }
  }

  toggleShiftLayout() {
    this.#isShiftPressed = !this.#isShiftPressed;

    Object.values(this.keysMap).forEach((key) => {
      const { keyObj } = key;
      if (keyObj.isSpecial || typeof key.keyString === 'string') {
        return;
      }

      const [primaryKey, alternativeKey] = key.keyString[this.#currentLanguage];

      // skip keys which both primaryKey and alternativeKey are letters when capsLock is pressed
      if (
        this.#isCapsLockPressed
        && primaryKey.toUpperCase() === alternativeKey
      ) {
        return;
      }

      keyObj.activeKey = this.#isShiftPressed ? alternativeKey : primaryKey;
      keyObj.element.textContent = keyObj.activeKey;
    });
  }

  toggleCapsLock() {
    this.#isCapsLockPressed = !this.#isCapsLockPressed;

    Object.values(this.keysMap).forEach((key) => {
      const { keyObj } = key;
      if (keyObj.isSpecial || typeof key.keyString === 'string') {
        return;
      }

      const [primaryKey, alternativeKey] = key.keyString[this.#currentLanguage];

      // skip keys that have symbols as altertiveKey
      if (primaryKey.toUpperCase() !== alternativeKey) {
        return;
      }

      keyObj.activeKey = this.#isCapsLockPressed ? alternativeKey : primaryKey;
      keyObj.element.textContent = keyObj.activeKey;
    });
  }

  changeLanguageLayout() {
    const langIndex = this.languages.indexOf(this.#currentLanguage);
    this.#currentLanguage = this.languages[langIndex + 1] ?? this.languages[0];

    Object.values(this.keysMap).forEach((key) => {
      const { keyObj } = key;

      if (keyObj.isSpecial || typeof key.keyString === 'string') {
        return;
      }

      const [primaryKey, alternativeKey] = key.keyString[this.#currentLanguage];

      if (primaryKey.toUpperCase() === alternativeKey) {
        keyObj.activeKey = this.#isCapsLockPressed ? alternativeKey : primaryKey;
      } else {
        keyObj.activeKey = this.#isShiftPressed ? alternativeKey : primaryKey;
      }

      keyObj.element.textContent = keyObj.activeKey;
    });
  }

  handleInputUp(e) {
    let wasPressedKey;

    switch (e.type) {
      case 'keyup':
        wasPressedKey = this.keysMap[e.code]?.keyObj;
        break;
      case 'mouseup':
        wasPressedKey = e.target.closest('.key')?.obj;
        break;
      default:
        return;
    }

    if (!wasPressedKey) return;

    wasPressedKey.element.classList.remove('pressed');

    if (wasPressedKey.keyCode.includes('Shift')) {
      this.toggleShiftLayout();
    }
  }

  handleInputDown(e) {
    if (document.activeElement !== this.inputField) {
      this.inputField.focus();
    }

    let pressedKey;

    switch (e.type) {
      case 'mousedown':
        pressedKey = e.target.closest('.key')?.obj;
        break;
      case 'keydown':
        pressedKey = this.keysMap[e.code]?.keyObj;
        pressedKey?.element.classList.add('pressed');
        break;
      default:
        return;
    }

    if (!pressedKey) return;

    const { keyCode } = pressedKey;

    // check for Ctrl + Alt
    if (
      ((keyCode.includes('Alt') && e.ctrlKey) || (keyCode.includes('Control') && e.altKey))
      && !e.repeat
    ) {
      this.changeLanguageLayout();
      return;
    }

    // return if ctrl or alt key was pressed along with any other key
    if (e.ctrlKey || e.altKey) return;

    if (!pressedKey.isSpecial) {
      this.#writeText(pressedKey.activeKey);
    } else if (keyCode.includes('Shift') && !e.repeat) {
      this.toggleShiftLayout();
    } else if (keyCode === 'CapsLock' && !e.repeat) {
      this.toggleCapsLock();
    } else if (keyCode === 'Backspace' || keyCode === 'Delete') {
      this.#deleteText(keyCode);
    } else if (keyCode === 'Enter') {
      this.#writeText('\n');
    } else if (keyCode === 'Tab') {
      this.#writeText('\t');
    } else if (keyCode.includes('Arrow')) {
      if (e.type === 'mousedown') {
        this.#writeText(pressedKey.activeKey);
      } else {
        return;
      }
    }

    if (e.type === 'keydown') e.preventDefault();
  }
}
