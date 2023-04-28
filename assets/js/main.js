import keysLayout from './keys-map.js';
import Keyboard from './Keyboard.js';

const textAreaEl = document.querySelector('textarea');

const keyboard = new Keyboard(keysLayout);
keyboard.connectTextArea(textAreaEl);
document.body.append(keyboard.element);

document.addEventListener('keydown', keyboard.handleInput.bind(keyboard));
document.addEventListener('keyup', keyboard.handleKeyUp.bind(keyboard));
document.addEventListener('mouseup', keyboard.handleKeyUp.bind(keyboard));
