import keysLayout from './keys-map.js';
import Keyboard from './Keyboard.js';

const textAreaEl = document.querySelector('textarea');

const keyboard = new Keyboard(keysLayout);
keyboard.connectInputField(textAreaEl);
document.body.append(keyboard.element);

textAreaEl.addEventListener('blur', (e) => {
  if (e.relatedTarget !== null) {
    textAreaEl.focus();
  }
});

document.addEventListener('keydown', keyboard.handleInputDown.bind(keyboard));
document.addEventListener('keyup', keyboard.handleInputUp.bind(keyboard));
document.addEventListener('mouseup', keyboard.handleInputUp.bind(keyboard));
