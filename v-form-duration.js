VForm.components.VFormDuration = VForm.components.VFormInput.extend({
    computed: {
        days: {
            get: function () { return this.decode(this._value).days; },
            set: function () { this._value = this.encode(); }
        },
        hours: {
            get: function () { return this.decode(this._value).hours; },
            set: function () { this._value = this.encode(); }
        },
        minutes: {
            get: function () { return this.decode(this._value).minutes; },
            set: function () { this._value = this.encode(); }
        },
        seconds: {
            get: function () { return this.decode(this._value).seconds; },
            set: function () { this._value = this.encode(); }
        }
    },
    template:
        '<div>' +
        '    <VFormNumber :name="_name" v-model="days" />' +
        '    <VFormNumber :name="_name" v-model="hours" />' +
        '    <VFormNumber :name="_name" v-model="minutes" />' +
        '    <VFormNumber :name="_name" v-model="seconds" />' +
        '   {{_value}}' +
        '</div>',
    methods: {
        decode: function () {
            var value = this._value;
            var days = value / 86400;

            value = value % 86400;

            var hours = value / 3600;

            value = value % 3600;

            var minutes = value / 60;

            value = value % 3600;

            var seconds = value;

            return {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
        },
        encode: function () {
            return ((this.days || 0) * 86400)
                + ((this.hours || 0) * 3600)
                + ((this.minutes || 0) * 60)
                + (this.seconds || 0);
        }
    }
});
