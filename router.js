// khoi tao cac thu vien
var express = require('express'); // khoi chay web app express js
var router = express.Router(); // lien ket router
var admin = require('firebase-admin'); // thu vien firebase
var serviceAccount = require("./privateKey.json"); // khoi tao file ket noi server firebase
var fs = require('fs') // thu vien cho phep doc file html 
const axios = require('axios') // thu vien cho phep tao http request
const { Converter, Alarm } = require('./Alarm.js'); // import file Alarm.js vao

// server key cho firebase
var serverKey = 'key=AAAAhO2bFYw:APA91bEzd3Rmnym3ln5nrDshVka0JuCLDnPJV7lY142_0JKhGJSHVel35nC-L2NzBXsvLK_WzTYEvJCDQoHHJX_EH6ivFb8q2y4xR8AqTRbQoaWJYnQ4sosH-k-3WwNethe0jIVWwWFS';

// khoi tao firebase 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://remotealarmclock-2f98a.firebaseio.com"
});

//var token = "fZgGBrzpLBA:APA91bGr1JXwvKMqXmTu6bvfzm1LgL6VKinszgq_nO7_wyN91qCiyiljqdGc9TJHki95MIvBUFYGeLHMYg39gJl2ifS4leCmx6EtwkCc1K7dvviqVDk2EptfxD6LC5o3XIwXMDbG3XjL"

// khoi tao config gui thong bao cho client (Firebase Cloud messsaging)
let config = {
  headers: {
    'Content-Type': 'application/json', // noi dung header la json
    'Authorization': serverKey // xac thuc bang server key dc cung cap
  }
}

///////////////////////////////////////////////mapping trang chu 
router.get('/', function (req, res) { // url request
  fs.readFile('Home.html', function (err, data) { // file dc tra ve cho user laf home.html
    res.writeHead(200, { 'Content-Type': 'text/html' }); // http code 200 ok
    res.write(data);  // gui ve client
    return res.end(); // ket thuc
  });
});


///////////////////////////////////////////////mapping trang about
router.get('/AboutUs.html', function (req, res) {
  fs.readFile('AboutUs.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
  });
});
///////////////////////////////////////////////mapping trang lost
router.get('/Lost.html', function (req, res) {
  fs.readFile('Lost.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
  });
});

///////////////////////////////////////////////mapping trang dang nhap (for fun)
router.get('/SignIn.html', function (req, res) {
  fs.readFile('SignIn.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
  });
});
///////////////////////////////////////////////mapping trang dang ky (for fun)
router.get('/SignUp.html', function (req, res) {
  fs.readFile('SignUp.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
  });
});


///////////////////////////////////////////////////////////////mapping update alarm
router.post('/update.html', function (req, res) {
  let data = req.body // lay data gui len tu form 
  var time = data.time.toString()  // name cua input la time <input name="time" >
  let hour = parseInt(time.substring(0, 2)) // cat chuoi lay gio
  let minute = parseInt(time.substring(3, 5))
  let title = data.title // // name cua input la title <input name="title" >

  // khoi tao data gui thong bao den mobile
  let id = data.aid
  let json = {
    "to": "/topics/remoteAlarm",
    "data": {
      "alarmId": id.toString(),
      "type": "update",
      "hour": hour.toString(),
      "minute": minute.toString(),
      "title": title
    },
    "priority": "high"
  }
  axios.post('https://fcm.googleapis.com/fcm/send', json, config)  // gui http post den mobile
    .then(res => {
      console.log(`statusCode: ${res.statusCode}`)
      //console.log(res)
    })
    .catch(error => {
      console.error(error)
    })
    .catch(error => {
      console.error(error)
    })

    // cap nhat data len firebase
  admin.firestore().collection("alarms").doc(id.toString()).update({
    alarmId: parseInt(id),
    hour: hour,
    minute: minute,
    started: true,
    title: title
  });

  // dieu huong ve home 
  res.redirect('/Home.html');
});

///////////////////////////////////////////////////////////////mapping cancel alarm
router.get('/cancel/:id', function (req, res) {
  // tuong tu o tren, chuan bi data gui thong bao den mobile
  // roi cap nhat database tren firebase

  let id = req.params.id
  let json = {
    "to": "/topics/remoteAlarm",
    "data": {
      "alarmId": id,
      "type": "cancel"
    },
    "priority": "high"
  }
  axios.post('https://fcm.googleapis.com/fcm/send', json, config)
    .then(res => {
      console.log(`statusCode: ${res.statusCode}`)

    })
    .catch(error => {
      console.error(error)
    })

  admin.firestore().collection("alarms").doc(id).delete()

  res.redirect('/Home.html');
});

////////////////////////////////////////////////////////////////mapping new alarm
router.post('/new.html', function (req, res) {
  // chuan bi data
  var id = Math.floor(100000000 + Math.random() * 900000000);
  console.log(id)
  let data = req.body
  var time = data.time.toString()
  console.log(time)
  let hour = parseInt(time.substring(0, 2))
  let minute = parseInt(time.substring(3, 5))
  let title = data.title
  let json = {
    "to": "/topics/remoteAlarm",
    "data": {
      "alarmId": id.toString(),
      "type": "insert",
      "hour": hour.toString(),
      "minute": minute.toString(),
      "title": title
    },
    "priority": "high"
  }
  axios.post('https://fcm.googleapis.com/fcm/send', json, config) // gui den mobile http post
    .then(res => {
      console.log(`statusCode: ${res.statusCode}`)
      //console.log(res)
    })
    .catch(error => {
      console.error(error)
    })

  // cap nhat firestore
  admin.firestore().collection("alarms").doc(id.toString())
    .withConverter(Converter)
    .set(new Alarm(id, hour, minute, title, true));

  // dieu huong ve home
  res.redirect('/Home.html');
});

module.exports = router // xuat router ra cho Main.js su dung