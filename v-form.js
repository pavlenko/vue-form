var VForm = {
    directives: {},
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

        Object.keys(VForm.directives).forEach(function (key) {
            vue.directive(key, VForm.directives[key]);
        });

        vue.mixin({
            validators: {},//TODO set from directive
            $validator: VForm.$validator,
            props: {
                error: {
                    type:    Object,
                    default: function () { return {}; }
                }
            },
            watch: {
                _value: function (newValue, oldValue) {
                    if (this.$validator && newValue !== oldValue) {
                        this.validator(newValue, this.validators);
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
