VForm.components.VFormCheckbox = VForm.components.VFormInput.extend({
    props: {
        value: {
            type: [String, Number, Boolean]
        },
        check:  {
            type:    [Boolean, String, Number],
            default: true
        }
    },
    template: '<input ref="field" type="checkbox" :id="_id" :name="_name" v-model="_value" :value="check">'
});
