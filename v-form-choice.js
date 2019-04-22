VForm.components.VFormChoice = VForm.components.VFormInput.extend({
    props: {
        value: {
            type: [String, Number, Boolean, Array]
        },
        choices: {
            type:    Object,
            default: function () { return {}; }
        },
        expanded: {
            type: Boolean
        },
        multiple: {
            type: Boolean
        },
        nullable: {
            type: Boolean
        }
    },
    data: function () {
        var choices = {};

        Object.keys(this.choices).forEach(function(key) {
            choices[key] = Array.isArray(this._value) && this.value.indexOf(key);
        }.bind(this));

        return {
            selected: choices
        };
    },
    computed: {
        _choices: function () {
            var _choices = [];

            Object.keys(this.choices).forEach(function(key) {
                _choices.push({id: '' + key, label: this.choices[key]});
            }.bind(this));

            return this.nullable ? [{id: null, label: ''}].concat(_choices) : _choices;
        }
    },
    template:
        '<select ref="field" v-if="!expanded" :name="_name" :multiple="multiple" v-model="_value">' +
        '    <option v-for="choice in _choices" v-bind:value="choice.id">{{ choice.label }}</option>' +
        '</select>' +
        '<div v-else-if="!multiple">' +
        '    <VFormRadio v-for="choice in _choices" ref="field" :key="choice.id" :name="_name" :label="choice.label" v-bind:value="choice.id" v-model="_value" :check="choice.id" />' +
        '</div>' +
        '<div v-else>' +
        '    <VFormCheckbox v-for="choice in _choices" ref="field" :key="choice.id" :name="_name" :label="choice.label" v-model="selected[choice.id]" :check="choice.id" />' +
        '</div>',
    mounted: function () {
        if (this.multiple && !Array.isArray(this._value)) {
            this._value = [];
        }
    },
    watch: {
        selected: {
            deep:    true,
            handler: function (value) {
                this._value = Object.keys(value).filter(function (key) {
                    return value[key];
                });
            }
        }
    }
});
