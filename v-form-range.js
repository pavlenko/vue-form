VForm.components.VFormRange = VForm.components.VFormInput.extend({
    props: {
        step: {
            type:    Number,
            default: 1
        }
    },
    template: '<input type="range" :id="_id" :name="_name" v-model="_value" :step="step" />'
});
