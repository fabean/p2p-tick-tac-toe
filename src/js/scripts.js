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
      console.log(data);
      renderData(data, 'them');
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

function renderData(data, who){

  // building out all the elements and rendering to page
  // let messageWrapper = document.createElement('div');
  // messageWrapper.classList.add('chat','message-wrapper',who);
  //
  // let messagePerson = document.createElement('div');
  // messagePerson.classList.add('name','circle-wrapper','animated','bounceIn');
  //
  // let personName = document.createTextNode(data.name.charAt(0));
  // messagePerson.appendChild(personName);
  //
  // let messageDiv = document.createElement('div');
  // messageDiv.classList.add('message','text-wrapper');
  //
  // let messageContent = document.createTextNode(data.message);
  // messageDiv.appendChild(messageContent);
  //
  // messageWrapper.appendChild(messagePerson);
  // messageWrapper.appendChild(messageDiv);
  //
  // chatOutputEl.appendChild(messageWrapper);

  if (who === 'them' && document.getElementById('friendID').innerHTML !== data.name) {
    renderConnectedTo(data.name);
  }
  console.log(data, who);
}

for (let i=0, ii=gameTile.length; i<ii; i++) {
  gameTile[i].addEventListener('click', function(e) {
    console.log(e.target.id);
    sendMove(e.target.id);

  });
}

function sendMove(tile) {
  let data = {
    "move": tile,
    "name": name
  };
  playerconnection.send(data);
  document.getElementById(tile).classList.add('x');
}

function renderMove(data) {
  document.getElementById(data.move).classList.add('o');
}

function makeArray(r){return[].slice.call(r,0)}
