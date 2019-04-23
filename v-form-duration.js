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
    data: function () {
        return {
            duration: {
                days:    null,
                hours:   null,
                minutes: null,
                seconds: null
            }
        }
    },
    template:
        '<table>' +
        '    <tr>' +
        '        <td v-if="displayDays"><VFormInput type="number" :name="_name" v-model="duration.days" /></td>' +
        '        <td><VFormInput type="number" :name="_name" v-model="duration.hours" /></td>' +
        '        <td><VFormInput type="number" :name="_name" v-model="duration.minutes" /></td>' +
        '        <td v-if="displaySeconds"><VFormInput type="number" :name="_name" v-model="duration.seconds" /></td>' +
        '    </tr>' +
        '    <tr>' +
        '        <td v-if="displayDays">Days</td>' +
        '        <td>Hours</td>' +
        '        <td>Minutes</td>' +
        '        <td v-if="displaySeconds">Seconds</td>' +
        '    </tr>' +
        '</table>',
    mounted: function () {
        if (this._value === '' || this._value === null) {
            this._value = 0;
        }

        var total = parseInt(this._value, 10);

        this.duration.seconds = total % 60;

        total = Math.floor(total / 60);

        this.duration.minutes = total % 60;

        total = Math.floor(total / 60);

        if (this.displayDays) {
            this.duration.hours = total % 24;
            this.duration.days  = Math.floor(total / 24);
        } else {
            this.duration.hours = total;
            this.duration.days  = 0;
        }
    },
    watch: {
        duration: {
            deep:    true,
            handler: function (value) {
                var days    = parseInt(value.days, 10) || 0;
                var hours   = parseInt(value.hours, 10) || 0;
                var minutes = parseInt(value.minutes, 10) || 0;
                var seconds = parseInt(value.seconds, 10) || 0;

                this._value = seconds + (minutes * 60) + (hours * 60 * 60) + (days * 24 * 60 * 60);
            }
        }
    }
});
