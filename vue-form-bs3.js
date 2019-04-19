VueForm.components.VFormInput = VueForm.components.VFormInput.extend({
    template: '<input class="form-control" :id="_id" :name="_name" :disabled="disabled" :readonly="readonly" v-model="_value.value" />'
});
