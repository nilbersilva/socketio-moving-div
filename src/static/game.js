const div = document.getElementById('main');
const socket = io('http://192.168.0.10:3333/');
let myDiv = {};
let myImg = {};
const movement = {
  up: false,
  down: false,
  left: false,
  right: false,
};

async function refreshPlayer(data) {
  let ele = document.getElementById(data.id);
  if (ele) {
    ele.style.left = data.player.x + 'px';
    ele.style.top = data.player.y + 'px';
    var img =ele.children[0];
    img.style.transform='rotate(' + data.player.t + 'deg)'
  } else {
    ele = createPlayer(data.id);
    ele.style.left = data.player.x + 'px';
    ele.style.top = data.player.y + 'px';
    var img =ele.children[0];
    img.style.transform='rotate(' + data.player.t + 'deg)'
    div.appendChild(ele);
  }
}

function createPlayer(id) {
  const newDiv = document.createElement('div');
  const label = document.createElement('p');
  const ele = document.createElement('img');
  ele.src = '/static/rocket.svg';
  newDiv.className = 'player';
  newDiv.id = id;
  label.innerHTML = id;
  if (id === socket.id)
  {
    myImg = ele;
    myDiv = newDiv;
    label.className = 'self';
  }
  newDiv.appendChild(ele);
  newDiv.appendChild(label);
  return newDiv;
}

socket.emit('new player');

socket.on('leave', id => {
  const ele = document.getElementById(id);
  if (ele) div.removeChild(ele);
});

socket.on('playerchange', async data => {
  await refreshPlayer(data);
});

socket.on('state', async players => {
  for (const id in players) {
    const player = players[id];
    refreshPlayer({ id, player });
  }
});

async function emit() {
  // setInterval(() => {
  socket.emit('movement', movement);
  // }, 200);
}

document.addEventListener('keydown', async function(event) {
  switch (event.keyCode) {
    case 65: // A
    case 37: // Arrow Left
      movement.left = true;
      break;
    case 87: // W
    case 38: // Arrow Top
      movement.up = true;
      break;
    case 68: // D
    case 39: // Arrow Right
      movement.right = true;
      break;
    case 83: // S
    case 40: // Arrow Down
      movement.down = true;
      break;
    default:
      break;
  }
  await emit();
});

document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
    case 37:
      movement.left = false;
      break;
    case 87: // W
    case 38:
      movement.up = false;
      break;
    case 68: // D
    case 39:
      movement.right = false;
      break;
    case 83: // S
    case 40:
      movement.down = false;
      break;
    default:
      break;
  }
});
