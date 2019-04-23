VForm.components.VFormDate = VForm.components.VFormInput.extend({
    props: {
        step: {
            type:    Number,
            default: 1
        },
        min: {
            type:    [String, Boolean],
            default: false
        },
        max: {
            type:    [String, Boolean],
            default: false
        }
    },
    template: '<input ref="field" type="date" :id="_id" :name="_name" v-model="_value" :step="step" :min="min" :max="max" />'
});
