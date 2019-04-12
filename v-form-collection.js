VueForm.components['v-form-collection'] = VueForm.components['v-form-input'].extend({
    props: {
        value: {
            type:    Array,
            default: function () { return []; }
        },
        minChildren: {
            type:    Number,
            default: 0
        },
        maxChildren: {
            type:    Number,
            default: 0
        },
        allowInsert: {
            type:    Boolean,
            default: false
        },
        allowDelete: {
            type:    Boolean,
            default: false
        },
        entryType: {
            type:    String,
            default: 'v-form-input'
        },
        entryOptions: {
            type:    Object,
            default: function () { return {}; }
        },
        entryDefaults: {
            type:    [String, Number, Array, Object],
            default: function () { return null; }
        }
    },
    template:
        '<div>' +
        '    <div v-for="(item, index) in _value" :key="index">' +
        '        <component :is="entryType" ref="children" v-bind="entryOptions" v-model="_value[index]" />' +
        '        <button type="button" v-if="allowDelete" :disabled="_value.length <= minChildren" v-on:click="remove(index)">Delete</button>' +
        '    </div>' +
        '    <button type="button" v-if="allowInsert" :disabled="_value.length >= maxChildren && maxChildren > 0" v-on:click="insert(entryDefaults)">Insert</button>' +
        '</div>',
    mounted: function () {
        if (this.minChildren > 0) {
            while (this._value.length < this.minChildren) {
                this._value.push(this.entryDefaults);
            }
        }
    },
    methods: {
        insert: function (value) {
            this._value.push(value);
        },
        remove: function (index) {
            this._value.splice(index, 1);
        },
        validate: function () {
            var valid = true;

            if (Array.isArray(this.$refs.children)) {
                this.$refs.children.forEach(function (child) {
                    valid = child.validate() && valid
                });
            }

            return valid;
        }
    }
});
