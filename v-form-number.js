VForm.components.VFormNumber = VForm.components.VFormInput.extend({
    props: {
        min: {
            type: Number,
            default: null
        },
        max: {
            type: Number,
            default: null
        },
        step: {
            type:    Number,
            default: 1
        }
    },
    template: '<input ref="field" type="number" :id="_id" :name="_name" v-model="_value" :step="step" :min="min" :max="max" v-on:keypress="isNumber($event)" />',
    methods: {
        isNumber: function(event) {
            var charCode = (event.which) ? event.which : event.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                event.preventDefault();
            } else {
                return true;
            }
        },
        decrement: function () {
            this._value -= this.step;
            this.$emit('decrement')
        },
        increment: function () {
            this._value += this.step;
            this.$emit('increment')
        }
    }
});
