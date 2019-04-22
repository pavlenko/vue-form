VForm.components.VFormCheckbox = VForm.components.VFormInput.extend({
    props: {
        label: {
            type: String
        },
        value: {
            type: [String, Number, Boolean]
        },
        check:  {
            type:    [Boolean, String, Number],
            default: true
        }
    },
    template:
        '<label>' +
        '    <input ref="field" type="checkbox" :id="_id" :name="_name" v-model="_value" :value="check"> {{ label }}' +
        '</label>'
});
