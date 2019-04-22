VForm.components.VFormInput = Vue.extend({
    props: {
        id: {
            type: String
        },
        name: {
            type: String
        },
        value: {
            type:    [String, Number],
            default: null
        },
        error: {
            type:    Object,
            default: function () { return {}; }
        },
        disabled: {
            type:    Boolean,
            default: false
        },
        readonly: {
            type:    Boolean,
            default: false
        }
    },
    computed: {
        _id: function () { return this.id || 'v-form-' + this._uid; },
        _name: function () { return this.name || 'v-form-' + this._id; },
        _value: {
            get: function () { return this.value; },
            set: function (value) { this.$emit('input', value); }
        }
    },
    template: '<input :id="_id" :name="_name" v-model="_value" />'
});
