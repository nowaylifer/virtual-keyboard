import keysLayout from './keys-map.js';
import Keyboard from './Keyboard.js';

const textAreaEl = document.querySelector('textarea');

const keyboard = new Keyboard(keysLayout);
document.body.append(keyboard.element);

keyboard.connectTextArea(textAreaEl);
document.addEventListener('keydown', keyboard.handleKeyDown.bind(keyboard));
document.addEventListener('keyup', keyboard.handleKeyUp.bind(keyboard));
