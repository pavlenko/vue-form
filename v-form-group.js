VForm.components.VFormGroup = Vue.extend({
    props: {
        label: {
            type: String
        },
        error: {
            type:    Object,
            default: function () { return {}; }
        }
    },
    computed: {
        _length: function () {
            var keys = Object.keys(this.error);

            if (keys.length === 0) {
                return -1;
            }

            return Object.keys(this.error).filter(function (key) {
                return this.error[key] === false;
            }.bind(this)).length
        }
    },
    template:
        '<div :class="{success: _length == 0, error: _length > 0}">' +
        '    <label v-html="label" />' +
        '    <slot />' +
        '</div>'
});
