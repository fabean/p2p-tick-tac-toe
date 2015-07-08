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
    gameBoard = makeArray(document.getElementsByClassName('board')),
    game = document.getElementById('game'),
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
  game.dataset.disabled = 'false';
  connectBack(playerconnection.peer);
  playerconnection.on('open', function(){
    renderConnectedTo(playerconnection.peer);

    playerconnection.on('data', function(data){
      if (data.board === 'restart' && data.tile === 'restart' && data.name !== name) {
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
    playerconnection = peer.connect(peerId.value);
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
    if (e.target.dataset.disabled === 'false' && game.dataset.disabled === 'false') {
      console.log(e.target.dataset);
      sendMove(e.target.dataset);
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

function sendMove(move) {
  yourMove = false;
  let tileEl = document.querySelectorAll(`[data-board="${move.board}"][data-tile="${move.tile}"]`);
  tileEl[0].classList.add(markerMe());
  tileEl[0].dataset.disabled = 'true';
  game.dataset.disabled = 'true';
  let data = {
    "board": move.board,
    "tile": move.tile,
    "name": name
  };
  playerconnection.send(data);
  if (gameWin(move.board, makeArray(document.getElementsByClassName(markerMe())), markerMe())){
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
  let tileEl = document.querySelectorAll(`[data-board="${data.board}"][data-tile="${data.tile}"]`);
  tileEl[0].dataset.disabled = 'true';
  tileEl[0].classList.add(markerThem());

  game.dataset.disabled = 'false';
  if (gameWin(makeArray(document.getElementsByClassName(markerThem())))) {
    outputEl.innerHTML = 'You Lost...';
    restartButton.classList.remove('hide');
  } else {
    myMove();
  }
}

function gameWin(board, moves, marker) {
  console.log('in gameWin');
  let calcMoves = document.querySelectorAll(`[data-board="${board}"].${marker}`);
  console.log(calcMoves);
  if (calcMoves.length >= 3) {
    // let tilesWon = [];
    let tilesWon = [];
    for (let i=0, ii=calcMoves.length; i<ii; i++) {
      tilesWon.push(moves[i].dataset.tile);
    }
    console.log(tilesWon);
    if (
      (tilesWon.indexOf('1') > -1 && tilesWon.indexOf('2') > -1 && tilesWon.indexOf('3') > -1) ||
      (tilesWon.indexOf('4') > -1 && tilesWon.indexOf('5') > -1 && tilesWon.indexOf('6') > -1) ||
      (tilesWon.indexOf('7') > -1 && tilesWon.indexOf('8') > -1 && tilesWon.indexOf('9') > -1) ||
      (tilesWon.indexOf('1') > -1 && tilesWon.indexOf('5') > -1 && tilesWon.indexOf('9') > -1) ||
      (tilesWon.indexOf('3') > -1 && tilesWon.indexOf('5') > -1 && tilesWon.indexOf('7') > -1) ||
      (tilesWon.indexOf('1') > -1 && tilesWon.indexOf('4') > -1 && tilesWon.indexOf('7') > -1) ||
      (tilesWon.indexOf('2') > -1 && tilesWon.indexOf('5') > -1 && tilesWon.indexOf('8') > -1) ||
      (tilesWon.indexOf('3') > -1 && tilesWon.indexOf('6') > -1 && tilesWon.indexOf('9') > -1)
    ) {
      return true;
    } else {
      // if (document.getElementsByClassName('tile disabled').length == 9) {
      //   outputEl.innerHTML = 'Tie Game';
      //   game.dataset.disabled = 'true';
      //   restartButton.classList.remove('hide');
      // } else {
        return false;
      // }
    }
  } else {
    return false;
  }
}

function myMove() {
  if (yourMove) {
    outputEl.innerHTML = 'Your Move';
    game.dataset.disabled = 'false';
  } else {
    outputEl.innerHTML = 'Opponent Move';
    game.dataset.disabled = 'true';
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
    gameTile[i].dataset.disabled = 'false';
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
