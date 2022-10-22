// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAdTWJx4WSny6ZAYBtuMF3_RpkVd-oPfsM",
    authDomain: "remotealarm-e4b87.firebaseapp.com",
    projectId: "remotealarm-e4b87",
    storageBucket: "remotealarm-e4b87.appspot.com",
    messagingSenderId: "312524311909",
    appId: "1:312524311909:web:cf348c85d4396b21fd258c",
    measurementId: "G-60Q09HVX3F"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
const list = document.querySelector('.thumbnails');

function ChuMiNga(id) {

    var checkBox = $('#' + 's' + id);

    let flag = false;
    if (checkBox.is(':checked')) {
        flag = true
    }

    // setTimeout(() => {

    var ref = db.collection("alarms").doc(id.toString());
    ref.update({
        recurring: flag
    }).then(function () {
        console.log("Document successfully updated!");
    })
        .catch(function (error) {

            console.error("Error updating document: ", error);
        });

    // }, 500);


}

function dateboxColor(id) {

    /* var flag = false;
     if ($("#" + id).css('color') == 'rgb(0, 128, 0)') {
         $("#" + id).css('color', 'rgb(128, 128, 128)')
     } else {
         flag = true
         $("#" + id).css('color', 'rgb(0, 128, 0)')
 
     }
     let index = id.indexOf("_")
     let docId = id.substring(0, index)
     let tmp = id.substring(index + 1, index + 3);
 
     var ref = db.collection("alarms").doc(String(docId));
 
 
 
     switch (tmp) {
         case 'mo':
             ref.update({
                 monday: flag
             })
             break;
         case 'tu':
             ref.update({
                 tuesday: flag
             })
             break;
         case 'we':
             ref.update({
                 wednesday: flag
             })
             break;
         case 'th':
             ref.update({
                 thursday: flag
             })
             break;
         case 'fr':
             ref.update({
                 friday: flag
             })
             break;
         case 'sa':
             ref.update({
                 saturday: flag
             })
             break;
         case 'su':
             ref.update({
                 sunday: flag
             })
             break;
         default:
         // code block
     }
 
     */

}

function openUpdateForm(id) {
    $("#update").show()
    $("#alarmMid").val(id)
    $("#updateTitle").val($(`#${id} #title`).text().trim())
    $("#updateTime").val($(`#${id} #time`).text().replace(/\s+/g, '').trim())

    $('#alarmID_mo1').prop('checked', isCheck(`#${id}_mo`))
    $('#alarmID_sa1').prop('checked', isCheck(`#${id}_sa`))
    $('#alarmID_fr1').prop('checked', isCheck(`#${id}_fr`))
    $('#alarmID_tu1').prop('checked', isCheck(`#${id}_tu`))
    $('#alarmID_we1').prop('checked', isCheck(`#${id}_we`))
    $('#alarmID_th1').prop('checked', isCheck(`#${id}_th`))
    $('#alarmID_su1').prop('checked', isCheck(`#${id}_su`))
    $('#alarmId_Repeat_Inpopupform4').prop('checked', $(`#${id} #recurring`).is(':checked'))
}

function openDeleteForm(id) {
    $("#delete").show()
    var idString = id.toString();
    document.getElementById('deleteForm').action = "/cancel/" + idString;

}

function isCheck(id) {
    if ($(id).css('color') == 'rgb(0, 128, 0)') {
        return true
    } else {
        return false
    }
}

// function changeColor(id) {
//     var flag = false;

//     if ($("#" + id).css('color') == 'rgb(0, 128, 0)') {
//         $("#" + id).css('color', 'rgb(128, 128, 128)')
//         flag = false
//         console.log("tat")
//     } else {
//         $("#" + id).css('color', 'rgb(0, 128, 0)')

//         flag = true
//         console.log("bat")
//     }


//     var ref = db.collection("alarms").doc(String(id));


//     ref.update({
//         started: flag
//     })
//         .then(function () {
//             console.log("Document successfully updated!");
//         })
//         .catch(function (error) {

//             console.error("Error updating document: ", error);
//         });
// }