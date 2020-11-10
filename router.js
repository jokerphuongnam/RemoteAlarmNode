var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');
var serviceAccount = require("./privateKey.json");
var url = require('url')
var fs = require('fs')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://remotealarmclock-2f98a.firebaseio.com"
});


function test() {
// This registration token comes from the client FCM SDKs.
var registrationToken = "dCo4K1UUVUI:APA91bFo96cq0IqmIldJAYwuyCrCE8rhjcVMxco7QzEDh9Akhk3OdO0I10HlDpDQL06vNFNME7NvZc44_DaCbJmNZy3O3L0HRakhv7VC8LwWM4qFEhcMKSAx67xprCigLbwpgGPWCyRR"

var message = {
  data: {
    alarmId: '02021999',
    type: 'insert',
    hour: '2',
    minute: '3',
    title: 'Noi dung tin nhan'
  },
  token: registrationToken
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });

}

let db = admin.firestore()
async function test2() {
  const cityRef = db.collection('alarms').doc('462012963');
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
  }

}
test2()

router.get('/', function(req, res){
    fs.readFile('Home.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        test()
        return res.end();
      });
});

router.get('/AboutUs.html', function(req, res){
    fs.readFile('AboutUs.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});

router.get('/Lost.html', function(req, res){
    fs.readFile('Lost.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});

router.get('/SignIn.html', function(req, res){
    fs.readFile('SignIn.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});

router.get('/SignUp.html', function(req, res){
    fs.readFile('SignUp.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});

router.post('/update.html', function(req, res){
    console.log('da vao trong post')
  res.redirect('Home.html');
});

router.post('/new.html', function(req, res){
  console.log('da vao trong post new')
  let data = req.body
  console.log(data.time)
  console.log(data.title)
  res.redirect('Home.html');
});

module.exports = router