/* jshint ignore:start */
'use strict';

var peer = new Peer({ key: 'n0ei2j1souk57b9' });

// peer stuff
peer.on('open', function (id) {
  document.getElementById('your-id').innerHTML = '<span>Your id is: <kbd>' + id + '</kbd></span>';
});

peer.on('connection', function (landline, name) {
  connectBack(landline.peer);
  landline.on('open', function () {
    renderConnectedTo(landline.peer);

    landline.on('data', function (data) {
      console.log(data);
      renderMessage(data, 'them');
    });
  });
});

function renderConnectedTo(peer) {
  connectedEl.innerHTML = 'You\'re connected to <span id="friendID">' + peer + '</span>';
  connectedEl.classList.remove('hide');
  document.getElementById('init-wrapper').classList.add('hide');
}

function connectBack(id) {
  // recieve a connection and connect back
  console.log(landline);
  if (typeof landline === 'undefined') {
    // we need to connect back;
    landline = peer.connect(id);
    console.log('connecting again');
  }
}
//# sourceMappingURL=scripts.js.map