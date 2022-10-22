// khoi tao cac thu vien
var express = require('express'); // khoi chay web app express js
var router = express.Router(); // lien ket router
var admin = require('firebase-admin'); // thu vien firebase
var serviceAccount = require("./privateKey.json"); // khoi tao file ket noi server firebase auth
var path = require('path');
const axios = require('axios') // thu vien cho phep tao http request
const FormData = require('form-data');

// khoi tao firebase 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://remotealarm-e4b87.firebaseio.com"
});

const baseAlarmUrl = `https://remote-alarm-apis.herokuapp.com/`
console.log(baseAlarmUrl)
///////////////////////////////////////////////mapping trang chu 
router.get('/', function (req, res) {
  // kiem tra cookie login
  const cookies = req.cookies;
  console.log('not-signed-cookies:', cookies);
  if (!cookies.email) { // chi can su dung email
    res.redirect('/SignIn1.html');
  }

  axios.get(baseAlarmUrl + `list?uid=${cookies.uid}`)
    .then(function (response) {
      res.render(__dirname + "/Home.html", { alarmList: response.data, email: cookies.email })
    })
    .catch(function (error) {
      console.log(error);
      res.redirect('/ServerError.html');
    })
    .then(function () {

    });
});

///////////////////////////////////////////////mapping trang about
router.get('/AboutUs.html', function (req, res) {
  // dieu huong sang documentation
});

///////////////////////////////////////////////mapping trang server error
router.get('/ServerError.html', function (req, res) {

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
    url: baseAlarmUrl + 'update',
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
      if (error.response.data.error == 'chua lien ket mobile') {
        res.redirect('/notPairYet');
      } else {
        res.redirect('/ServerError.html');
      }
    })

});

///////////////////////////////////////////////////////////////mapping cancel alarm
router.get('/cancel/:id', function (req, res) {
  let id = req.params.id
  const cookies = req.cookies;
  axios.get(baseAlarmUrl + `cancel?uid=${cookies.uid}&aid=${id}`)
    .then(ressta => {
      console.log(`statusCode: ${ressta.statusCode}`)
      res.redirect('/');
    })
    .catch(error => {
      if (error.response.data.error == 'chua lien ket mobile') {
        res.redirect('/notPairYet');
      } else {
        res.redirect('/ServerError.html');
      }
    })
});

////////////////////////////////////////////////////////////////mapping new alarm
router.post('/new.html', function (req, res) {
  // chuan bi data

  let data = req.body
  var time = data.time.toString()
  const cookies = req.cookies;
  // chuan bi cac checkbox

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
    url: baseAlarmUrl + 'new',
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
      console.log(error.response.data.error)
      if (error.response.data.error == 'khong truy van user') {
        res.redirect('/notPairYet');
      } else {
        res.redirect('/ServerError.html');
      }

    })
});

module.exports = router // xuat router ra cho Main.js su dung