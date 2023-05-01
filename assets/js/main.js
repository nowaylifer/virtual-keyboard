import keysLayout from './keys-map.js';
import Keyboard from './Keyboard.js';

const textAreaEl = document.createElement('textarea');
textAreaEl.className = 'textarea';

const keyboard = new Keyboard(keysLayout);
keyboard.connectInputField(textAreaEl);

document.body.append(textAreaEl);
document.body.append(keyboard.element);

textAreaEl.addEventListener('blur', (e) => {
  if (e.relatedTarget !== null) {
    textAreaEl.focus();
  }
});

document.addEventListener('keydown', keyboard.handleInputDown.bind(keyboard));
document.addEventListener('keyup', keyboard.handleInputUp.bind(keyboard));
document.addEventListener('mouseup', keyboard.handleInputUp.bind(keyboard));

const text = document.createElement('p');
text.className = 'text';
text.innerText = 'Клавиатура создана в операционной системе Windows \n Для переключения языка комбинация: Ctrl + Alt';
document.body.append(text);
