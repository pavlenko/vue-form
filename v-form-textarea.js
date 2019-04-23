VForm.components.VFormTextarea = VForm.components.VFormInput.extend({
    props: {
        cols: {
            type:    Number,
            default: 20
        },
        rows: {
            type:    Number,
            default: 2
        }
    },
    template: '<textarea ref="field" :id="_id" :name="_name" :cols="cols" :rows="rows" v-model="_value"></textarea>'
});
