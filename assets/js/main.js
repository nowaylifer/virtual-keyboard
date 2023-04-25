import keysLayout from './keys-layout.js';
import Keyboard from './Keyboard.js';

const keyboard = new Keyboard(keysLayout);
document.body.append(keyboard.element);
