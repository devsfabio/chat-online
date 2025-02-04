// login elements
const login = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const loginInput = document.querySelector('.login-input');

// chat elements
const chat = document.querySelector('.chat');
const chatForm = document.querySelector('.chat-form');
const chatInput = document.querySelector('.chat-input');
const chatMessages = document.querySelector('.chat-message');

const colors = [
  'cadetblue',
  'darkgolddenrod',
  'cornflowerblue',
  'darkkhak',
  'hotpink',
  'gold',
];
const user = { id: '', name: '', color: '' };

let websocket;

const createMessageSelfElement = (content) => {
  const div = document.createElement('div');

  div.classList.add('message-self');
  div.innerHTML = content;
  return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement('div');
  const span = document.createElement('span');
  div.classList.add('message-other');
  span.classList.add('mesagge-sender');
  span.style.color = senderColor;
  div.classList.add('message-self');

  div.appendChild(span);

  span.innerHTML = sender;
  div.innerHTML += content;
  return div;
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
};

const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data);

  const message =
    userId == user.id
      ? createMessageSelfElement(content)
      : createMessageOtherElement(content, userName, userColor);

  chatMessages.appendChild(message);

  scrollScreen();
};

const handleLogin = (event) => {
  event.preventDefault();
  user.color = getRandomColor();
  user.id = crypto.randomUUID();
  user.name = loginInput.value;

  login.style.display = 'none';
  chat.style.display = 'flex';

  websocket = new WebSocket('wss://chat-backend-uw0y.onrender.com');
  websocket.onmessage = processMessage;
};

const sendMessage = (event) => {
  event.preventDefault();

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };
  websocket.send(JSON.stringify(message));
  chatInput.value = '';
};

loginForm.addEventListener('submit', handleLogin);
chatForm.addEventListener('submit', sendMessage);
