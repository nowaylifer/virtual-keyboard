import Key from './Key.js';

export default class Keyboard {
  constructor(keysMap, textAreaEl) {
    this.init(keysMap, textAreaEl);
  }

  init(keysMap, textAreaEl) {
    for (const key of Object.keys(keysMap)) {
      keysMap[key].objKey = new Key(key, keysMap[key]);
    }
  }
}
