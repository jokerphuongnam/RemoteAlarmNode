// khoi tao cac thu vien
var express = require('express'); // khoi chay web app express js
var router = express.Router(); // lien ket router
var admin = require('firebase-admin'); // thu vien firebase
var serviceAccount = require("./privateKey.json"); // khoi tao file ket noi server firebase
var fs = require('fs') // thu vien cho phep doc file html 
var path = require('path');
const axios = require('axios') // thu vien cho phep tao http request
const { Converter, Alarm } = require('./Alarm.js'); // import file Alarm.js vao
const FormData = require('form-data');


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
  // kiem tra cookie login
  const cookies = req.cookies;
  console.log('not-signed-cookies:', cookies);
  if (!cookies.email) { // chi can su dung email
    res.redirect('/SignIn1.html');
  }

  var alarms = [];
  // const res1 = await axios.get('remotealarmapi.herokuapp.com/list');
  // console.log(res1.headers['content-type'])

  axios.get(`https://remotealarmapi.herokuapp.com/list?uid=${cookies.uid}`)
    .then(function (response) {
      // handle success
      console.log('thanh cong');
      //console.log(response.data);
      res.render(__dirname + "/Home.html", { alarmList: response.data, email: cookies.email })
    })
    .catch(function (error) {
      // handle error
      console.log('loi');
      console.log(error);
    })
    .then(function () {
      // always executed
    });


});


///////////////////////////////////////////////mapping trang about
router.get('/AboutUs.html', function (req, res) {

  // res.sendFile(path.join(__dirname + '/AboutUs.html'));
});

///////////////////////////////////////////////mapping trang not pairt
router.get('/notPairYet', function (req, res) {

   res.sendFile(path.join(__dirname + '/notPairYet.html'));
});
///////////////////////////////////////////////mapping trang lost
router.get('/signOut', function (req, res) {
  res.clearCookie('email'); // chi su dung email de check
  res.redirect('/SignIn1.html');
});

///////////////////////////////////////////////mapping trang dang nhap (for fun)
router.get('/SignIn1.html', function (req, res) {
  res.sendFile(path.join(__dirname + '/SignIn1.html'));
});

///////////////////////////////////////////////mapping trang dang ky (for fun)
router.get('/SignUp.html', function (req, res) {
  res.sendFile(path.join(__dirname + '/SignUp.html'));
});




///////////////////////////////////////////////////////////////mapping update alarm
router.post('/update.html', function (req, res) {
  let data = req.body // lay data gui len tu form 
  var time = data.time.toString()  // name cua input la time <input name="time" >
  console.log(time)
  const cookies = req.cookies;

  let title = data.title // // name cua input la title <input name="title" >
  let recurring = (data.onoffswitch == undefined ? "false" : "true")
  let monday = (data.monday_cb == undefined ? "false" : "true")
  let tuesday = (data.tuesday_cb == undefined ? "false" : "true")
  let wednesday = (data.wednesday_cb == undefined ? "false" : "true")
  let thursday = (data.thursday_cb == undefined ? "false" : "true")
  let friday = (data.friday_cb == undefined ? "false" : "true")
  let saturday = (data.saturday_cb == undefined ? "false" : "true")
  let sunday = (data.sunday_cb == undefined ? "false" : "true")

  // khoi tao data gui thong bao den mobile
  let id = data.aid

  console.log(time)
  console.log(title)
  console.log(recurring)
  console.log(monday)
  console.log(tuesday)
  console.log(wednesday)
  console.log(thursday)
  console.log(friday)
  console.log(saturday)
  console.log(sunday)
  console.log(id)

  var bodyFormData = new FormData();
  bodyFormData.append('uid', cookies.uid);
  bodyFormData.append('time', time);
  bodyFormData.append('title', title);
  bodyFormData.append('onoffswitch', recurring);
  bodyFormData.append('monday_cb', monday);
  bodyFormData.append('tuesday_cb', tuesday);
  bodyFormData.append('wednesday_cb', wednesday);
  bodyFormData.append('thursday_cb', thursday);
  bodyFormData.append('friday_cb', friday);
  bodyFormData.append('saturday_cb', saturday);
  bodyFormData.append('sunday_cb', sunday);
  bodyFormData.append('aid', id);



  axios({
    method: 'post',
    url: 'http://remotealarmapi.herokuapp.com/update',
    data: bodyFormData,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${bodyFormData._boundary}`,
    },
  }).then(respo => {
    console.log(`statusCode: ${respo.statusCode}`)
    console.log("gui thanh cong")
    res.redirect('/');
  })
    .catch(error => {
      console.error(error)
      console.log("gui bi loi")
      res.redirect('/notPairYet');
    })




});

///////////////////////////////////////////////////////////////mapping cancel alarm
router.get('/cancel/:id', function (req, res) {
  let id = req.params.id
  const cookies = req.cookies;
  axios.get(`https://remotealarmapi.herokuapp.com/cancel?uid=${cookies.uid}&aid=${id}`)
    .then(ressta => {
      console.log(`statusCode: ${ressta.statusCode}`)
      res.redirect('/');
    })
    .catch(error => {
      console.error(error)
      console.log("gui bi loi")
      res.redirect('/notPairYet');
    })
});

////////////////////////////////////////////////////////////////mapping new alarm
router.post('/new.html', function (req, res) {
  // chuan bi data

  let data = req.body
  var time = data.time.toString()
  const cookies = req.cookies;
  // chuan bi cac checkbox
  // recurring
  // console.log('checkbox test' + data.onoffswitch)
  // undefined thi false  , else thi true

  let recurring = (data.onoffswitch == undefined ? "false" : "true")
  let monday = (data.monday_cb == undefined ? "false" : "true")
  let tuesday = (data.tuesday_cb == undefined ? "false" : "true")
  let wednesday = (data.wednesday_cb == undefined ? "false" : "true")
  let thursday = (data.thursday_cb == undefined ? "false" : "true")
  let friday = (data.friday_cb == undefined ? "false" : "true")
  let saturday = (data.saturday_cb == undefined ? "false" : "true")
  let sunday = (data.sunday_cb == undefined ? "false" : "true")

  let title = data.title
  var bodyFormData = new FormData();
  bodyFormData.append('uid', cookies.uid);
  bodyFormData.append('time', time);
  bodyFormData.append('title', title);
  bodyFormData.append('onoffswitch', recurring);
  bodyFormData.append('monday_cb', monday);
  bodyFormData.append('tuesday_cb', tuesday);
  bodyFormData.append('wednesday_cb', wednesday);
  bodyFormData.append('thursday_cb', thursday);
  bodyFormData.append('friday_cb', friday);
  bodyFormData.append('saturday_cb', saturday);
  bodyFormData.append('sunday_cb', sunday);



  axios({
    method: 'post',
    url: 'http://remotealarmapi.herokuapp.com/new',
    data: bodyFormData,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${bodyFormData._boundary}`,
    },
  }).then(respo => {
    console.log(`statusCode: ${respo.statusCode}`)
    console.log("gui thanh cong")
    res.redirect('/');
  })
    .catch(error => {
      console.error(error)
      console.log("gui bi loi")
      res.redirect('/notPairYet');
    })
  // dieu huong ve home

});

module.exports = router // xuat router ra cho Main.js su dung