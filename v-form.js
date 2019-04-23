var VForm = {
    components: {},
    validators: {},
    $validator: function (value, rules) {
        var error = {};

        Object.keys(rules).forEach(function (name) {
            if (typeof VForm.validators[name] === 'function') {
                error[name] = VForm.validators[name](value, rules[name]);
            }
        });

        return error;
    },
    install: function (vue, options) {
        Object.keys(VForm.components).forEach(function (key) {
            vue.component(key, VForm.components[key]);
        });

        vue.directive('validate', function (el, binding, vNode) {
            if (typeof binding.value === 'object' && vNode.componentInstance) {
                vNode.componentInstance.validators = binding.value;
            }
        });

        vue.mixin({
            watch: {
                _value: function (newValue, oldValue) {
                    if (typeof this.validators === 'object' && newValue !== oldValue) {
                        this.$emit('update:error', VForm.$validator(newValue, this.validators));
                    }
                }
            }
        });
    }
};

VForm.validators.required = function (value) {
    if (typeof value === 'string') {
        return !!String(value).trim().length;
    } else {
        return !!value;
    }
};

VForm.validators.email = function (value) {
    return true;//TODO
};

VForm.validators.phone = function (value) {
    return true;//TODO
};

VForm.validators.min_length = function (value, options) {
    return true;//TODO
};

VForm.validators.max_length = function (value, options) {
    return true;//TODO
};

VForm.validators.min_value = function (value, options) {
    return true;//TODO
};

VForm.validators.max_value = function (value, options) {
    return true;//TODO
};

VForm.components.VFormGroup = Vue.extend({
    props: {
        label: {
            type: String
        },
        error: {
            type:    Object,
            default: function () { return {}; }
        }
    },
    computed: {
        _length: function () {
            var keys = Object.keys(this.error);

            if (keys.length === 0) {
                return -1;
            }

            return Object.keys(this.error).filter(function (key) {
                return this.error[key] === false;
            }.bind(this)).length
        }
    },
    template:
        '<div :class="{success: _length == 0, error: _length > 0}">' +
        '    <label v-html="label" />' +
        '    <slot />' +
        '</div>'
});

VForm.components.VFormInput = Vue.extend({
    props: {
        id: {
            type: String
        },
        name: {
            type: String
        },
        type: {
            type: String
        },
        value: {
            type:    [String, Number],
            default: null
        },
        error: {
            type:    Object,
            default: function () { return {}; }
        },
        disabled: {
            type:    Boolean,
            default: false
        },
        readonly: {
            type:    Boolean,
            default: false
        }
    },
    computed: {
        _id: function () { return this.id || 'v-form-' + this._uid; },
        _name: function () { return this.name || 'v-form-' + this._uid; },
        _value: {
            get: function () { return this.value; },
            set: function (value) { this.$emit('input', value); }
        }
    },
    template: '<input ref="field" :id="_id" :name="_name" :type="type" v-model="_value" />'
});

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

VForm.components.VFormRadio = VForm.components.VFormInput.extend({
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
        '    <input ref="field" type="radio" :id="_id" :name="_name" v-model="_value" :value="check"> {{ label }}' +
        '</label>'
});

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

VForm.components.VFormNumber = VForm.components.VFormInput.extend({
    props: {
        min: {
            type: Number,
            default: null
        },
        max: {
            type: Number,
            default: null
        },
        step: {
            type:    Number,
            default: 1
        }
    },
    template: '<input ref="field" type="number" :id="_id" :name="_name" v-model="_value" :step="step" :min="min" :max="max" v-on:keypress="isNumber($event)" />',
    methods: {
        isNumber: function(event) {
            var charCode = (event.which) ? event.which : event.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                event.preventDefault();
            } else {
                return true;
            }
        },
        decrement: function () {
            this._value -= this.step;
            this.$emit('decrement')
        },
        increment: function () {
            this._value += this.step;
            this.$emit('increment')
        }
    }
});

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

VForm.components.VFormDate = VForm.components.VFormInput.extend({
    props: {
        step: {
            type:    Number,
            default: 1
        },
        min: {
            type:    [String, Boolean],
            default: false
        },
        max: {
            type:    [String, Boolean],
            default: false
        }
    },
    template: '<input ref="field" type="date" :id="_id" :name="_name" v-model="_value" :step="step" :min="min" :max="max" />'
});

VForm.components.VFormTime = VForm.components.VFormInput.extend({
    props: {
        step: {
            type:    Number,
            default: 60
        }
    },
    template: '<input ref="field" type="time" :id="_id" :name="_name" v-model="_value" :step="step"/>'
});

VForm.components.VFormDuration = VForm.components.VFormInput.extend({
    props: {
        displayDays: {
            type:    Boolean,
            default: true
        },
        displaySeconds: {
            type:    Boolean,
            default: false
        }
    },
    data: function () {
        return {
            duration: {
                days:    null,
                hours:   null,
                minutes: null,
                seconds: null
            }
        }
    },
    template:
        '<table>' +
        '    <tr>' +
        '        <td v-if="displayDays"><VFormInput type="number" :name="_name" v-model="duration.days" /></td>' +
        '        <td><VFormInput type="number" :name="_name" v-model="duration.hours" /></td>' +
        '        <td><VFormInput type="number" :name="_name" v-model="duration.minutes" /></td>' +
        '        <td v-if="displaySeconds"><VFormInput type="number" :name="_name" v-model="duration.seconds" /></td>' +
        '    </tr>' +
        '    <tr>' +
        '        <td v-if="displayDays">Days</td>' +
        '        <td>Hours</td>' +
        '        <td>Minutes</td>' +
        '        <td v-if="displaySeconds">Seconds</td>' +
        '    </tr>' +
        '</table>',
    mounted: function () {
        if (this._value === '' || this._value === null) {
            this._value = 0;
        }

        var total = parseInt(this._value, 10);

        this.duration.seconds = total % 60;

        total = Math.floor(total / 60);

        this.duration.minutes = total % 60;

        total = Math.floor(total / 60);

        if (this.displayDays) {
            this.duration.hours = total % 24;
            this.duration.days  = Math.floor(total / 24);
        } else {
            this.duration.hours = total;
            this.duration.days  = 0;
        }
    },
    watch: {
        duration: {
            deep:    true,
            handler: function (value) {
                var days    = parseInt(value.days, 10) || 0;
                var hours   = parseInt(value.hours, 10) || 0;
                var minutes = parseInt(value.minutes, 10) || 0;
                var seconds = parseInt(value.seconds, 10) || 0;

                this._value = seconds + (minutes * 60) + (hours * 60 * 60) + (days * 24 * 60 * 60);
            }
        }
    }
});

VForm.components.VFormRange = VForm.components.VFormInput.extend({
    props: {
        min: {
            type:    Number,
            default: 0
        },
        max: {
            type:    Number,
            default: 100
        },
        step: {
            type:    Number,
            default: 1
        }
    },
    template: '<input ref="field" type="range" :id="_id" :name="_name" v-model="_value" :step="step" :min="min" :max="max" />'
});
