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

        vue.directive('validate-rules', function (el, binding, vNode) {
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
    },
    deepGet: function (object, path, create) {
        var parts = path.split('.'), current = object, index = 0;

        for (index; index < parts.length; ++index) {
            if (current[parts[index]] === undefined) {
                if (create) {
                    //current[parts[index]]
                } else {
                    return undefined;
                }
            } else {
                current = current[parts[index]];
            }
        }

        return current;
    }
};
