var VueForm = {
    components: {},
    install: function (vue, options) {
        Object.keys(VueForm.components).forEach(function (key) {
            vue.component(key, VueForm.components[key]);
        });
    }
};

VueForm.components['v-form-label'] = Vue.extend({
    template: '<label />'
});

VueForm.components['v-form-error'] = Vue.extend({
    template: '<div>ERROR</div>'
});

VueForm.components.VFormGroup = Vue.extend({
    mounted: function () {
        //console.log(this.$children.filter(function (component) { return component instanceof VueForm.components.VFormInput; }))
    },
    template:
        '<div>' +
        '    <slot />' +
        '</div>',
    methods: {
        validate: function () {
            var valid = true;

            this.$children.forEach(function (child) {
                valid = child.validate() && valid;
            });

            return valid;
        }
    }
});

VueForm.components.VFormInput = Vue.extend({
    props: {
        id: String,
        name: String,
        value: [String, Number]
    },
    computed: {
        _id: function () { return this.id || 'v-form-' + this._uid; },
        _name: function () { return this.name || 'v-form-' + this._id; },
        _value: {
            get: function () { return this.value; },
            set: function (value) { this.$emit('input', value); }
        }
    },
    template: '<div><input :id="_id" :name="_name" v-model="_value"><slot /></div>',
    methods: {
        validate: function () {
            //TODO must return boolean true if valid, false otherwise
            //TODO must fill internal errors property
        }
    }
});

VueForm.components.VFormCollection = VueForm.components.VFormInput.extend({
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
            default: 'VFormInput'
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
        '        <!-- We need to pass both _value and index to slot for preserve reactivity -->' +
        '        <slot ref="children" v-bind:options="getEntryOptions(index)" v-bind:_value="_value" v-bind:index="index" />' +
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
        getEntryOptions: function (index) {
            return Object.assign({}, this.entryOptions, {
                id:   this._id + '_' + index,
                name: this._name + '[' + index + ']'
            });
        },
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

var VueFormInput = Vue.component('vue-form-input', {
    props: {
        size:     {type: String},
        name:     {type: String},
        type:     {type: String, default: 'text'},
        value:    {type: [String, Number]},
        readonly: {type: Boolean, default: false}
    },
    computed: {
        _value: {
            get: function () { return this.value; },
            set: function (val) { this.$emit('input', val); }
        }
    },
    template: '<input ref="field" :class="\'form-control\' + (size ? \' input-\' + size : \'\')" :id="_uid" :name="name" :type="type" v-model="_value">'
});

Vue.component('vue-form-number', {
    props: {
        size:     {type: String},
        name:     {type: String},
        value:    {type: [String, Number], default: 0},
        step:     {type: Number, default: 1, validator: function (value) { return value > 0; }},
        min:      {type: Number, default: null},
        max:      {type: Number, default: null},
        readonly: {type: Boolean, default: false}
    },
    computed: {
        _value: {
            get: function () { return (this.value * 1) || 0; },
            set: function (val) { this.$emit('input', val * 1); }
        }
    },
    template:
        '<div :class="\'input-group \' + (size ? \'input-group-\' + size : \'\')">' +
        '    <span class="input-group-btn">' +
        '        <button :disabled="null !== min && min >= _value" :class="\'btn btn-default \' + (size ? \'btn-\' + size : \'\')" type="button" v-on:click="decrement()">' +
        '            <i class="fa fa-fw fa-minus"></i>' +
        '        </button>' +
        '    </span>' +
        '    <input type="text" ref="field" class="form-control" :id="_uid" :name="name" :min="min" :max="max" :readonly="readonly" v-model="_value" v-on:keypress="isNumber($event)">' +
        '    <span class="input-group-btn">' +
        '        <button :disabled="null !== max && max <= _value" :class="\'btn btn-default \' + (size ? \'btn-\' + size : \'\')" type="button" v-on:click="increment()">' +
        '            <i class="fa fa-fw fa-plus"></i>' +
        '        </button>' +
        '    </span>' +
        '</div>',
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
        '<div :class="inline ? \'checkbox-inline\' : \'checkbox\'" :style="inline ? \'margin-left: 0; margin-right: 10px;\' : \'\'">' +
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
        '<div :class="inline ? \'radio-inline\' :  \'radio\'" :style="inline ? \'margin-left: 0; margin-right: 10px;\' : \'\'">' +
        '    <label>' +
        '        <input ref="field" type="radio" :id="_uid" :name="name" v-model="_value" :value="check"> {{ label }}' +
        '    </label>' +
        '</div>'
});

Vue.component('vue-form-choice', {
    props: {
        size:        {type: String},
        name:        {type: String},
        value:       {type: [Boolean, String, Number, Array]},
        placeholder: {type: String},
        choices:     {type: Object},
        expanded:    {type: Boolean},
        multiple:    {type: Boolean},
        nullable:    {type: Boolean},
        inline:      {type: Boolean, default: false}
    },
    computed: {
        _classes: function () {
            var classes = ['form-control'];

            if (this.size) { classes.push('input-' + this.size) }

            return classes.join(' ');
        },
        _choices: function () {
            var _choices = [];

            Object.keys(this.choices).forEach(function(key) {
                _choices.push({id: '' + key, label: this.choices[key]});
            }.bind(this));

            return this.nullable ? [{id: null, label: ''}].concat(_choices) : _choices;
        }
    },
    template:
        '<select ref="field" v-if="!expanded" :class="_classes" :name="name" :multiple="multiple" :placeholder="placeholder" :data-placeholder="placeholder">' +
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
                var value;

                if (this.multiple) {
                    value = ($(event.target).val() || []).filter(function (value) { return !!value });
                } else {
                    value = $(event.target).val();
                }

                this.$emit('input', value);
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
    extends: VueFormInput,
    props: {
        showSeconds: {type: Boolean, default: false},
        showDays:    {type: Boolean, default: false}
    },
    template: '<div><input ref="field" :class="\'form-control\' + (size ? \' input-\' + size : \'\')" :id="_uid" :name="name" :type="type" v-model="_value"></div>',
    mounted: function () {
        $(this.$refs.field).durationPicker({
            showSeconds: this.showSeconds,
            showDays:    this.showDays,
            onChanged:   function (value) { this.$emit('input', value); }.bind(this)
        });
    }
});

Vue.component('vue-form-date', {
    extends: VueFormInput,
    props: {
        size:        {type: String},
        name:        {type: String},
        value:       {type: String},
        inline:      {type: Boolean, default: false},
        formatValue: {type: String, default: 'YYYY-MM-DD'},
        formatView:  {type: String, default: 'L'},
        minDate:     {type: [String, Boolean], default: false},
        maxDate:     {type: [String, Boolean], default: false}
    },
    template:
        '<div v-if="inline">' +
        '    <input ref="field" type="hidden" :id="_uid" :name="name" v-model="_value">' +
        '    <div ref="picker"></div>' +
        '</div>' +
        '<div v-else :class="\'input-group\' + (size ? \' input-group-\' + size : \'\')">' +
        '    <input ref="field" type="hidden" :id="_uid" :name="name" v-model="_value">' +
        '    <input ref="picker" type="text" class="form-control">' +
        '    <span class="input-group-addon">' +
        '        <span class="fa fa-calendar"></span>' +
        '    </span>' +
        '</div>',
    mounted: function () {
        $(this.$refs.picker).datetimepicker({
            format:  this.formatView,
            date:    moment(this.value, this.formatValue),
            inline:  this.inline,
            minDate: this.minDate,
            maxDate: this.maxDate
        }).on('dp.change', function (event) {
            var time = event.date ? event.date.format(this.formatValue) : null;

            this.$refs.field.value = time;
            this.$emit('input', time);
        }.bind(this))
    },
    watch: {
        minDate: function (value) {
            $(this.$refs.picker).data("DateTimePicker").minDate(value ? moment(value, this.formatValue) : false);
        },
        maxDate: function (value) {
            $(this.$refs.picker).data("DateTimePicker").maxDate(value ? moment(value, this.formatValue) : false);
        }
    }
});

Vue.component('vue-form-time', {
    extends: VueFormInput,
    props: {
        size:        {type: String},
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
        '    <div v-else :class="\'input-group\' + (size ? \' input-group-\' + size : \'\')">' +
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
    extends: VueFormInput,
    props: {
        name:    {type: String},
        value:   {type: [String, Number, Array]},
        range:   {type: Boolean, default: false},
        step:    {type: Number, default: 1},
        min:     {type: Number, default: 0},
        max:     {type: Number, default: 100},
        tooltip: {type: String, validate: function (val) { return ['show', 'hide', 'always'].indexOf(val) !== -1; }},
        handle:  {type: String, validate: function (val) { return ['round', 'square'].indexOf(val) !== -1; }}
    },
    template:
        '<input ref="field" type="range" :id="_uid" :name="name" :min="min" :max="max" :step="step" v-model="_value" class="form-control">',
    mounted: function () {
        this.slider = new Slider(this.$refs.field, {
            range:   this.range,
            step:    this.step,
            min:     this.min,
            max:     this.max,
            value:   this.range && !(this.value instanceof Array) ? [this.min, this.max] : this.value || 0,
            tooltip: this.tooltip,
            handle:  this.handle || 'square'
        }).on('change', function (data) {
            this.$emit('input', data.newValue);
        }.bind(this));
    }
});
