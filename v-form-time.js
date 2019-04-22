VForm.components.VFormTime = VForm.components.VFormInput.extend({
    props: {
        step: {
            type:    Number,
            default: 60
        }
    },
    template: '<input type="time" :id="_id" :name="_name" v-model="_value" :step="step"/>'
});
