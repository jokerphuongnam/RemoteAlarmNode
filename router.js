
var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');
var serviceAccount = require("./privateKey.json");
var url = require('url')
var fs = require('fs')
const axios = require('axios')
const { Converter, Alarm } = require('./Alarm.js');

var serverKey = 'key=AAAAhO2bFYw:APA91bEzd3Rmnym3ln5nrDshVka0JuCLDnPJV7lY142_0JKhGJSHVel35nC-L2NzBXsvLK_WzTYEvJCDQoHHJX_EH6ivFb8q2y4xR8AqTRbQoaWJYnQ4sosH-k-3WwNethe0jIVWwWFS';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://remotealarmclock-2f98a.firebaseio.com"
});

var token = "fZgGBrzpLBA:APA91bGr1JXwvKMqXmTu6bvfzm1LgL6VKinszgq_nO7_wyN91qCiyiljqdGc9TJHki95MIvBUFYGeLHMYg39gJl2ifS4leCmx6EtwkCc1K7dvviqVDk2EptfxD6LC5o3XIwXMDbG3XjL"

let config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': serverKey
  }
}

router.get('/', function (req, res) {
  fs.readFile('Home.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
  });
});

router.get('/AboutUs.html', function (req, res) {
  fs.readFile('AboutUs.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
  });
});

router.get('/Lost.html', function (req, res) {
  fs.readFile('Lost.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
  });
});

router.get('/SignIn.html', function (req, res) {
  fs.readFile('SignIn.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
  });
});

router.get('/SignUp.html', function (req, res) {
  fs.readFile('SignUp.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
  });
});
///////////////////////////////////////////////mapping update alarm
router.post('/update.html', function (req, res) {
  console.log('da vao trong post update route')


  let data = req.body

  var time = data.time.toString()
  console.log(data.title.hour)
  let hour = parseInt(time.substring(0, 2))
  let minute = parseInt(time.substring(3, 5))
  let title = data.title
  // send request to server
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
  axios.post('https://fcm.googleapis.com/fcm/send', json, config)
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

  admin.firestore().collection("alarms").doc(id.toString()).update({
    alarmId: parseInt(id),
    hour: hour,
    minute: minute,
    started: true,
    title: title
  });

  res.redirect('/Home.html');
});

///////////////////////////////////////////////mapping cancel alarm
router.get('/cancel/:id', function (req, res) {
  console.log('da vao trong cancel route')
  let id = req.params.id
  console.log(id)
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
      //console.log(res)
    })
    .catch(error => {
      console.error(error)
    })

  admin.firestore().collection("alarms").doc(id).delete()

  res.redirect('/Home.html');
});

////////////////////////////////////////////////mapping new alarm
router.post('/new.html', function (req, res) {
  console.log('da vao trong post new')
  // chuan bi data
  var id = Math.floor(100000000 + Math.random() * 900000000);
  console.log(id)
  let data = req.body

  var time = data.time.toString()
  console.log(data.title.hour)
  let hour = parseInt(time.substring(0, 2))
  let minute = parseInt(time.substring(3, 5))
  let title = data.title
  // send request to server


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
  axios.post('https://fcm.googleapis.com/fcm/send', json, config)
    .then(res => {
      console.log(`statusCode: ${res.statusCode}`)
      //console.log(res)
    })
    .catch(error => {
      console.error(error)
    })

  // add to firestore
  admin.firestore().collection("alarms").doc(id.toString())
    .withConverter(Converter)
    .set(new Alarm(id, hour, minute, title, true));

  res.redirect('/Home.html');
});

module.exports = router