VForm.components.VFormRadio = VForm.components.VFormInput.extend({
    props: {
        value: {
            type: [String, Number, Boolean]
        },
        check:  {
            type:    [Boolean, String, Number],
            default: true
        }
    },
    template: '<input ref="field" type="radio" :id="_id" :name="_name" v-model="_value" :value="check">'
});
