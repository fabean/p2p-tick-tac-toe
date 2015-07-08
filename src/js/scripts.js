/* jshint ignore:start */
let peer = new Peer({key: 'n0ei2j1souk57b9'}),
    //peer = new Peer({host: '52.25.18.170', port: 9000, path: '/myapp'}),
    nameEl = document.getElementById('name-input'),
    setNameButton = document.getElementById('set-name'),
    showHostButton = document.getElementById('show-host'),
    showJoinButton = document.getElementById('show-join'),
    joinHostButton = document.getElementById('join-host'),
    peerId = document.getElementById('friends-peer-id'),
    connectedEl = document.getElementById('connected'),
    gameTile = makeArray(document.getElementsByClassName('tile')),
    gameBoard = document.getElementById('game'),
    outputEl = document.getElementById('output'),
    restartButton = document.getElementById('restart'),
    yourMove = true,
    isHost = true,
    playerconnection,
    name;


/**
  * Peerjs setup stuff
  */
peer.on('open', function(id) {
  document.getElementById('your-id').innerHTML = `<span>Your id is: <kbd>${id}</kbd></span>`;
});

peer.on('connection', function(playerconnection, name){
  gameBoard.classList.remove('disabled');
  connectBack(playerconnection.peer);
  playerconnection.on('open', function(){
    renderConnectedTo(playerconnection.peer);

    playerconnection.on('data', function(data){
      if (data.move === 'restart' && data.name !== name) {
        restart();
      } else {
        renderMove(data, 'them');
      }
    });
  });
  myMove();
});


function renderConnectedTo(peer) {
  connectedEl.innerHTML = `You're connected to <span id="friendID">${peer}</span>`;
  connectedEl.classList.remove('hide');
  document.getElementById('init-wrapper').classList.add('hide');
}

function connectBack(id) {
  // recieve a connection and connect back
  if (typeof playerconnection === 'undefined') {
    // we need to connect back;
    playerconnection = peer.connect(id);
  }
  myMove();
}


/**
  * Setup things (name, join host whatevs)
  */
setNameButton.addEventListener('click', function () {
  setName();
});

nameEl.addEventListener('keydown', function(e) {
  let key = e.which || e.keyCode;
  if (key === 13) { // enter key
    e.preventDefault();
    setName();
  }
});

showHostButton.addEventListener('click', function(){
  document.getElementById('host').classList.toggle('hide');
});

showJoinButton.addEventListener('click', function(){
  document.getElementById('join').classList.toggle('hide');
});

joinHostButton.addEventListener('click', function(){
  yourMove = false;
  isHost = false;
  playerconnection = peer.connect(peerId.value);
  document.getElementById('join').classList.toggle('hide');
});

peerId.addEventListener('keydown', function(e) {
  let key = e.which || e.keyCode;
  if (key === 13) { // enter key
    e.preventDefault();
    yourMove = false;
    isHost = false;
    landline = peer.connect(peerId.value);
    document.getElementById('join').classList.toggle('hide');
  }
});

function setName() {
  let nameInput = document.getElementById('name-input');
  name = nameInput.value;
  nameInput.classList.add('hide');
  setNameButton.classList.add('hide');
  showHostButton.classList.remove('hide');
  showJoinButton.classList.remove('hide');
}


/**
  * Gameplay section
  */
for (let i=0, ii=gameTile.length; i<ii; i++) {
  console.log('in loop!');
  gameTile[i].addEventListener('click', function(e) {
    console.log(e.target.id);
    if (!e.target.classList.contains('disabled') && !game.classList.contains('disabled')) {
      sendMove(e.target.id);
    }
  });
}

restartButton.addEventListener('click', function(e) {
  e.preventDefault();
  let data = {
    "move": "restart",
    "name": name
  };
  playerconnection.send(data);
  restart();
})

function sendMove(tile) {
  yourMove = false;
  let tileEl = document.getElementById(tile);
  tileEl.classList.add(markerMe());
  tileEl.classList.add('disabled');
  game.classList.add('disabled');
  let data = {
    "move": tile,
    "name": name
  };
  playerconnection.send(data);
  if (gameWin(makeArray(document.getElementsByClassName(markerMe())))){
    outputEl.innerHTML = 'You Won!';
    restartButton.classList.remove('hide');
  } else {
    myMove();
  }
}

function renderMove(data) {
  yourMove = true;
  if (document.getElementById('friendID').innerHTML !== data.name) {
    renderConnectedTo(data.name);
  }
  let tileEl = document.getElementById(data.move);
  tileEl.classList.add(markerThem());
  tileEl.classList.add('disabled');
  game.classList.remove('disabled');
  if (gameWin(makeArray(document.getElementsByClassName(markerThem())))) {
    outputEl.innerHTML = 'You Lost...';
    restartButton.classList.remove('hide');
  } else {
    myMove();
  }
}

function gameWin(moves) {

  if (moves.length >= 3) {
    // let tilesWon = [];
    let tilesWon = [];
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
      if (document.getElementsByClassName('tile disabled').length == 9) {
        outputEl.innerHTML = 'Tie Game';
        game.classList.add('disabled');
        restartButton.classList.remove('hide');
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

function myMove() {
  if (yourMove) {
    outputEl.innerHTML = 'Your Move';
    game.classList.remove('disabled');
  } else {
    outputEl.innerHTML = 'Opponent Move';
    game.classList.add('disabled');
  }
}

function markerMe() {
  if (isHost) {
    return 'x';
  } else {
    return 'o';
  }
}

function markerThem() {
  if (isHost) {
    return 'o';
  } else {
    return 'x';
  }
}

function restart() {
  console.log('in restart');
  // for each tile remove letters
  for (let i=0, ii=gameTile.length; i<ii; i++) {
    console.log(i, ii);
    gameTile[i].classList.remove('disabled');
    gameTile[i].classList.remove('x');
    gameTile[i].classList.remove('o');
    console.log('removing tiles');
  }

  // disable game for host now
  if (isHost) {
    yourMove = false;
  } else {
    yourMove = true;
  }
  myMove();

  restartButton.classList.add('hide');
}

/**
  * My fancy makeArray helper function
  */
function makeArray(r){return[].slice.call(r,0)}
