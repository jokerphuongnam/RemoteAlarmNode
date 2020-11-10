

var db = firebase.firestore();
const list = document.querySelector('.thumbnails');
db.collection("alarms").onSnapshot(function (querySnapshot) {
    list.innerHTML = "";
    var alarms = [];
    querySnapshot.forEach(function (doc) {
        if (doc.data().monday) {
            console.log("true")
        } else {
            console.log("false")
        }
        alarms += `<div class="box">
        <br>
        <!-- Color: Green = đã đặt báo thức  -->
        <i id="${doc.data().alarmId}" onclick="changeColor(${doc.data().alarmId})" class="fa fa-clock-o"
            style="font-size: 8rem; color: ${doc.data().started ? "#008000" : "#808080"};" aria-hidden="true"></i>
        <div class="inner">
            <h3>${doc.data().hour} : ${doc.data().minute}</h3>
            <p>${doc.data().title}</p>
            <p>
                <span class="${doc.data().monday ?"datebox-active" :""}"
                    style="font-weight: bold;font-size: 12px;line-height: 30px ; width: 30px; border: 2px white solid;display: inline-block;text-align: center;border-radius: 4px;">Mon</span>
                <span class="${doc.data().tuesday ?"datebox-active" :""}"
                    style="font-weight: bold;font-size: 12px;line-height: 30px ; width: 30px; border: 2px white solid;display: inline-block;text-align: center;border-radius: 4px;">Tue</span>
                <span class="${doc.data().wednesday ?"datebox-active" :""}"
                    style="font-weight: bold;font-size: 12px;line-height: 30px ; width: 30px; border: 2px white solid;display: inline-block;text-align: center;border-radius: 4px;">Wed</span>
                <span class="${doc.data().thursday ?"datebox-active" :""}"
                    style="font-weight: bold;font-size: 12px;line-height: 30px ; width: 30px; border: 2px white solid;display: inline-block;text-align: center;border-radius: 4px;">Thu</span>
                <span class="${doc.data().friday ?"datebox-active" :""}"
                    style="font-weight: bold;font-size: 12px;line-height: 30px ; width: 30px; border: 2px white solid;display: inline-block;text-align: center;border-radius: 4px;">Fri</span>
                <span class="${doc.data().saturday ?"datebox-active" :""}"
                    style="font-weight: bold;font-size: 12px;line-height: 30px ; width: 30px; border: 2px white solid;display: inline-block;text-align: center;border-radius: 4px;">Sat</span>
                <span class="${doc.data().sunday ?"datebox-active" :""}"
                    style="font-weight: bold;font-size: 12px;line-height: 30px ; width: 30px; border: 2px white solid;display: inline-block;text-align: center;border-radius: 4px;">Sun</span>
            </p>
            <p>Nút tích Repeat</p>
            <button class="btn success" style="font-size: 20px" onclick="openUpdateForm(${doc.data().alarmId})">Set Time</button>
            <div style="line-height:50%;">
                <br>
            </div>
            <button class="btn danger" style="font-size: 20px" onclick="location.href='cancel/${doc.data().alarmId}.htm'">Remove</button>
        </div>
    </div>`
    });
  
    list.innerHTML = alarms;
});


function changeColor(id) {
    var flag = false;
    if (document.getElementById(id).style.color == 'rgb(0, 128, 0)') {
       // document.getElementById(id).style.color = 'rgb(128, 128, 128)';// tat
        flag = false
        console.log("tat")
    } else {

      //  document.getElementById(id).style.color = 'rgb(0, 128, 0)';// bat
        flag = true
        console.log("bat")
    }


    var ref = db.collection("alarms").doc(String(id));


     ref.update({
        started: flag
    })
        .then(function () {
            console.log("Document successfully updated!");
        })
        .catch(function (error) {

            console.error("Error updating document: ", error);
        });
}