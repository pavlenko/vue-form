VueForm.components.VFormInput = VueForm.components.VFormInput.extend({
    template: '<input class="form-control" :id="_id" :name="_name" :required="required" :disabled="disabled" :readonly="readonly" v-model="_value" />'
});
