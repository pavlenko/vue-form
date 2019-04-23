VForm.components.VFormDuration = VForm.components.VFormInput.extend({
    props: {
        displayDays: {
            type:    Boolean,
            default: true
        },
        displaySeconds: {
            type:    Boolean,
            default: false
        }
    },
    computed: {
        days: {
            get: function () { return this.decode(this._value).days; },
            set: function (value) { this._value = this.encode({days: value, hours: this.hours, minutes: this.minutes, seconds: this.seconds}); }
        },
        hours: {
            get: function () { return this.decode(this._value).hours; },
            set: function (value) { this._value = this.encode({days: this.days, hours: value, minutes: this.minutes, seconds: this.seconds}); }
        },
        minutes: {
            get: function () { return this.decode(this._value).minutes; },
            set: function (value) { this._value = this.encode({days: this.days, hours: this.hours, minutes: value, seconds: this.seconds}); }
        },
        seconds: {
            get: function () { return this.decode(this._value).seconds; },
            set: function (value) { this._value = this.encode({days: this.days, hours: this.hours, minutes: this.minutes, seconds: value}); }
        }
    },
    template:
        '<table>' +
        '    <tr>' +
        '        <td v-if="displayDays"><VFormInput type="number" :name="_name" v-model="days" /></td>' +
        '        <td><VFormInput type="number" :name="_name" v-model="hours" /></td>' +
        '        <td><VFormInput type="number" :name="_name" v-model="minutes" /></td>' +
        '        <td v-if="displaySeconds"><VFormInput type="number" :name="_name" v-model="seconds" /></td>' +
        '    </tr>' +
        '    <tr>' +
        '        <td v-if="displayDays">Days</td>' +
        '        <td>Hours</td>' +
        '        <td>Minutes</td>' +
        '        <td v-if="displaySeconds">Seconds</td>' +
        '    </tr>' +
        '</table>',
    methods: {
        decode: function (value) {
            var days = Math.floor(value / 86400);

            value = value % 86400;

            var hours = Math.floor(value / 3600);

            value = value % 3600;

            var minutes = Math.floor(value / 60);

            value = value % 3600;

            var seconds = Math.floor(value);

            return {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
        },
        encode: function (value) {
            return ((value.days || 0) * 86400)
                + ((value.hours || 0) * 3600)
                + ((value.minutes || 0) * 60)
                + (value.seconds || 0);
        }
    }
});
