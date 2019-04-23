VForm.components.VFormRange = VForm.components.VFormInput.extend({
    props: {
        min: {
            type:    Number,
            default: 0
        },
        max: {
            type:    Number,
            default: 100
        },
        step: {
            type:    Number,
            default: 1
        }
    },
    template: '<input ref="field" type="range" :id="_id" :name="_name" v-model="_value" :step="step" :min="min" :max="max" />'
});
