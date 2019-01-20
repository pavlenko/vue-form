//TODO handle horizontal form
//TODO add date/time/duration pickers
//TODO add base html fields

Vue.component('vue-form-group', {
    props: {
        label: {type: [String, Boolean], default: ''}
    },
    template:
        '<div class="form-group">' +
        '    <label v-if="label !== false" class="control-label col-md-4">{{ label }}</label>' +
        '    <label v-else-if="label === true" class="col-md-4"></label>' +
        '    <div :class="label !== false ? \'col-md-8\' : \'col-md-12\'">' +
        '        <slot></slot>' +
        '    </div>' +
        '</div>'
});

var VueFormImport = Vue.component('vue-form-input', {
    props: {
        name:  {type: String},
        type:  {type: String, default: 'text'},
        value: {type: [String, Number]},
    },
    computed: {
        _value: {
            get: function () { return this.value; },
            set: function (val) { this.$emit('input', val); }
        }
    },
    template: '<input ref="field" class="form-control" :id="_uid" :name="name" :type="type" v-model="_value">'
});

Vue.component('vue-form-textarea', {
    props: {
        name:  {type: String},
        value: {type: [String, Number]},
    },
    computed: {
        _value: {
            get: function () { return this.value; },
            set: function (val) { this.$emit('input', val); }
        }
    },
    template: '<textarea ref="field" class="form-control" :id="_uid" :name="name" v-model="_value"></textarea>'
});

Vue.component('vue-form-checkbox', {
    props: {
        name:   {type: String},
        value:  {type: [Boolean, String, Number]},
        label:  {type: String},
        check:  {type: [Boolean, String, Number], default: true},
        inline: {type: Boolean, default: false}
    },
    computed: {
        _value: {
            get: function () { return this.value; },
            set: function (val) { this.$emit('input', val); }
        }
    },
    template:
        '<div :class="inline ? \'checkbox-inline\' : \'checkbox\'" :style="inline ? \'margin-left: 0; margin-right: 10px;\' : null">' +
        '    <label>' +
        '        <input ref="field" type="checkbox" :id="_uid" :name="name" v-model="_value" :value="check"> {{ label }}' +
        '    </label>' +
        '</div>'
});

Vue.component('vue-form-radio', {
    props: {
        name:   {type: String},
        value:  {type: [Boolean, String, Number]},
        label:  {type: String},
        check:  {type: [Boolean, String, Number], default: true},
        inline: {type: Boolean, default: false}
    },
    computed: {
        _value: {
            get: function () { return this.value; },
            set: function (val) { this.$emit('input', val); }
        }
    },
    template:
        '<div :class="inline ? \'radio-inline\' :  \'radio\'" :style="inline ? \'margin-left: 0; margin-right: 10px;\' : null">' +
        '    <label>' +
        '        <input ref="field" type="radio" :id="_uid" :name="name" v-model="_value" :value="check"> {{ label }}' +
        '    </label>' +
        '</div>'
});

Vue.component('vue-form-choice', {
    props: {
        name:     {type: String},
        value:    {type: [Boolean, String, Number, Array]},
        choices:  {type: Object},
        expanded: {type: Boolean},
        multiple: {type: Boolean},
        nullable: {type: Boolean},
        inline:   {type: Boolean, default: false}
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
        '<select ref="field" v-if="!expanded" class="form-control" :name="name" :multiple="multiple">' +
        '    <option v-for="choice in _choices" v-bind:value="choice.id">{{ choice.label }}</option>' +
        '</select>' +
        '<div v-else-if="!multiple">' +
        '    <vue-form-radio v-for="choice in _choices" :key="choice.id" :name="name" :label="choice.label" :inline="inline" v-bind:value="choice.id" :check="choice.id"></vue-form-radio>' +
        '</div>' +
        '<div v-else>' +
        '    <vue-form-checkbox v-for="choice in _choices" :key="choice.id" :name="name" :label="choice.label" :inline="inline" v-bind:value="choice.id" :check="choice.id"></vue-form-checkbox>' +
        '</div>',
    mounted: function () {
        if (!this.expanded) {
            $(this.$el).val(this.value).on('change', function (event) {
                this.$emit('input', this.multiple ? $(event.target).val() || [] : $(event.target).val());
            }.bind(this));
        } else if (!this.multiple) {
            $(this.$el).find(':radio').val([this.value]).on('change', function (event) {
                this.$emit('input', $(event.target).val());
            }.bind(this));
        } else {
            $(this.$el).find(':checkbox').val(this.value).on('change', function (event) {
                this.$emit('input', $(this.$el).find(':checkbox:checked').map(function(){ return $(this).val(); }).get());
            }.bind(this));
        }
    }
});

Vue.component('vue-form-duration', {
    extends: VueFormImport,
    mounted: function () {
        $(this.$refs.field).durationPicker({
            onChanged: function (value) { this.$emit('input', value); }.bind(this)
        });
    }
});

Vue.component('vue-form-date', {
    extends: VueFormImport,
    props: {
        name:        {type: String},
        value:       {type: String},
        inline:      {type: Boolean, default: false},
        formatValue: {type: String, default: 'YYYY-MM-DD'},
        formatView:  {type: String, default: 'L'},
    },
    template:
        '<div>' +
        '    <input ref="field" type="hidden" :id="_uid" :name="name" v-model="_value">' +
        '    <div v-if="inline" ref="picker"></div>' +
        '    <div v-else class="input-group">' +
        '        <input ref="picker" type="text" class="form-control">' +
        '        <span class="input-group-addon">' +
        '            <span class="fa fa-calendar"></span>' +
        '        </span>' +
        '    </div>' +
        '</div>',
    mounted: function () {
        $(this.$refs.picker).datetimepicker({
            format: this.formatView,
            date:   moment(this.value, this.formatValue),
            inline: this.inline
        }).on('dp.change', function (event) {
            var time = event.date.format(this.formatValue);

            this.$refs.field.value = time;
            this.$emit('input', time);
        }.bind(this))
    }
});

Vue.component('vue-form-time', {
    extends: VueFormImport,
    props: {
        name:        {type: String},
        value:       {type: String},
        inline:      {type: Boolean, default: false},
        formatValue: {type: String, default: 'HH:mm:ss'},
        formatView:  {type: String, default: 'LTS'},
    },
    template:
        '<div>' +
        '    <input ref="field" type="hidden" :id="_uid" :name="name" v-model="_value">' +
        '    <div v-if="inline" ref="picker"></div>' +
        '    <div v-else class="input-group">' +
        '        <input ref="picker" type="text" class="form-control">' +
        '        <span class="input-group-addon">' +
        '            <span class="fa fa-clock-o"></span>' +
        '        </span>' +
        '    </div>' +
        '</div>',
    mounted: function () {
        $(this.$refs.picker).datetimepicker({
            format: this.formatView,
            date:   moment(this.value, this.formatValue),
            inline: this.inline
        }).on('dp.change', function (event) {
            var time = event.date.format(this.formatValue);

            this.$refs.field.value = time;
            this.$emit('input', time);
        }.bind(this))
    }
});

Vue.component('vue-form-range', {
    extends: VueFormImport,
    props: {
        name:  {type: String},
        value: {type: [String, Number, Array]},
        range: {type: Boolean, default: false},
        step:  {type: Number, default: 1},
        min:   {type: Number, default: 0},
        max:   {type: Number, default: 100}
    },
    template:
        '<input ref="field" type="range" :id="_uid" :name="name" :min="min" :max="max" :step="step" v-model="_value">',
    mounted: function () {
        new Slider(this.$refs.field, {
            range: this.range,
            step:  this.step,
            min:   this.min,
            max:   this.max,
            value: this.range && !(this.value instanceof Array) ? [this.min, this.max] : this.value
        }).on('change', function (data) {
            this.$emit('input', data.newValue);
        }.bind(this));
    }
});