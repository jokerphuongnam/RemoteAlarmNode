 class Alarm {
    constructor (alarmId, hour, minute, title, started) {
        this.alarmId = alarmId;
        this.hour = hour;
        this.minute = minute;
        this.title = title;
        this.created = new Date().getMilliseconds();
        this.started = started;
        this.recurring = false;
        this.monday = false;
        this.tuesday = false;
        this.wednesday = false;
        this.thursday = false;
        this.friday = false;
        this.saturday = false;
        this.sunday = false;
    }
    toString() {
        return this.alarmId + ', ' + this.hour + ', ' + this.minute;
    }
}

// Firestore data converter
var alarmConverter = {
    toFirestore: function(alarm) {
        return {
            alarmId: alarm.alarmId,
            hour: alarm.hour,
            minute: alarm.minute,
            title: alarm.title,
            created: alarm.created,
            started: alarm.started,
            recurring: alarm.recurring,
            monday: alarm.monday,
            tuesday: alarm.tuesday,
            wednesday: alarm.wednesday,
            thursday: alarm.thursday,
            friday: alarm.friday,
            saturday: alarm.saturday,
            sunday: alarm.sunday
            }
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new City(data.alarmId, data.hour, data.minute, data.title, data.started)
    }
}

exports.Converter = alarmConverter
exports.Alarm = Alarm