import keysLayout from './keys-map.js';
import Keyboard from './Keyboard.js';

const textAreaEl = document.querySelector('textarea');

const keyboard = new Keyboard(keysLayout, textAreaEl);
document.body.append(keyboard.element);
