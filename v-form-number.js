VForm.components.VFormNumber = VForm.components.VFormInput.extend({
    props: {
        step: {
            type:    Number,
            default: 1
        }
    },
    template: '<input type="number" :id="_id" :name="_name" v-model="_value" :step="step" />'
});
