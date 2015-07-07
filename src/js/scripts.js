/* jshint ignore:start */
let peer = new Peer({key: 'n0ei2j1souk57b9'}),
    nameEl = document.getElementById('name-input'),
    setNameButton = document.getElementById('set-name'),
    showHostButton = document.getElementById('show-host'),
    showJoinButton = document.getElementById('show-join'),
    joinHostButton = document.getElementById('join-host'),
    peerId = document.getElementById('friends-peer-id'),
    connectedEl = document.getElementById('connected'),
    gameTile = makeArray(document.getElementsByClassName('tile')),
    gameBoard = document.getElementById('game'),
    playerconnection,
    name;

// peer stuff
peer.on('open', function(id) {
  document.getElementById('your-id').innerHTML = `<span>Your id is: <kbd>${id}</kbd></span>`;
});

peer.on('connection', function(playerconnection, name){
  connectBack(playerconnection.peer);
  playerconnection.on('open', function(){
    renderConnectedTo(playerconnection.peer);

    playerconnection.on('data', function(data){
      renderMove(data, 'them');
    });

  });

});

function renderConnectedTo(peer) {
  connectedEl.innerHTML = `You're connected to <span id="friendID">${peer}</span>`;
  connectedEl.classList.remove('hide');
  document.getElementById('init-wrapper').classList.add('hide');
}

function connectBack(id) {
  // recieve a connection and connect back
  console.log(playerconnection);
  if (typeof playerconnection === 'undefined') {
    // we need to connect back;
    playerconnection = peer.connect(id);
    console.log('connecting again');
  }
}

// set name events / functions
setNameButton.addEventListener('click', function () {
  setName();
});

function setName() {
  let nameInput = document.getElementById('name-input');
  name = nameInput.value;
  nameInput.classList.add('hide');
  setNameButton.classList.add('hide');
  showHostButton.classList.remove('hide');
  showJoinButton.classList.remove('hide');
}

// host / join
showHostButton.addEventListener('click', function(){
  document.getElementById('host').classList.toggle('hide');
});

showJoinButton.addEventListener('click', function(){
  document.getElementById('join').classList.toggle('hide');
});

joinHostButton.addEventListener('click', function(){
  playerconnection = peer.connect(peerId.value);
  document.getElementById('join').classList.toggle('hide');
});

for (let i=0, ii=gameTile.length; i<ii; i++) {
  gameTile[i].addEventListener('click', function(e) {
    console.log(e.target.id);
    if (!e.target.classList.contains('disabled') && !game.classList.contains('disabled')) {
      sendMove(e.target.id);
    } else {
      alert('no cheating!');
    }

  });
}

function sendMove(tile) {
  let tileEl = document.getElementById(tile);
  tileEl.classList.add('x');
  tileEl.classList.add('disabled');
  game.classList.add('disabled');
  let data = {
    "move": tile,
    "name": name
  };
  playerconnection.send(data);
  if (gameWin(makeArray(document.getElementsByClassName('x')))){
    alert('you won');
  };
}

function renderMove(data) {
  if (document.getElementById('friendID').innerHTML !== data.name) {
    renderConnectedTo(data.name);
  }
  let tileEl = document.getElementById(data.move);
  tileEl.classList.add('o');
  tileEl.classList.add('disabled');
  game.classList.remove('disabled');
  if (gameWin(makeArray(document.getElementsByClassName('o')))) {
    alert('you lost');
  };
}

function gameWin(moves) {

  if (moves.length >= 3) {
    // let tilesWon = [];
    tilesWon = [];
    for (let i=0, ii=moves.length; i<ii; i++) {
      tilesWon.push(moves[i].id);
    }
    console.log(tilesWon);
    if (
      (tilesWon.indexOf('tile-1') > -1 && tilesWon.indexOf('tile-2') > -1 && tilesWon.indexOf('tile-3') > -1) ||
      (tilesWon.indexOf('tile-4') > -1 && tilesWon.indexOf('tile-5') > -1 && tilesWon.indexOf('tile-6') > -1) ||
      (tilesWon.indexOf('tile-7') > -1 && tilesWon.indexOf('tile-8') > -1 && tilesWon.indexOf('tile-9') > -1) ||
      (tilesWon.indexOf('tile-1') > -1 && tilesWon.indexOf('tile-5') > -1 && tilesWon.indexOf('tile-9') > -1) ||
      (tilesWon.indexOf('tile-3') > -1 && tilesWon.indexOf('tile-5') > -1 && tilesWon.indexOf('tile-7') > -1) ||
      (tilesWon.indexOf('tile-1') > -1 && tilesWon.indexOf('tile-4') > -1 && tilesWon.indexOf('tile-7') > -1) ||
      (tilesWon.indexOf('tile-2') > -1 && tilesWon.indexOf('tile-5') > -1 && tilesWon.indexOf('tile-8') > -1) ||
      (tilesWon.indexOf('tile-3') > -1 && tilesWon.indexOf('tile-6') > -1 && tilesWon.indexOf('tile-9') > -1)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function makeArray(r){return[].slice.call(r,0)}
