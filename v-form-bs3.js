VForm.components.VFormGroup = VForm.components.VFormGroup.extend({
    template:
        '<div :class="{\'form-group\': true, \'has-success\': _length == 0, \'has-error\': _length > 0}">' +
        '    <label class="control-label" v-html="label" />' +
        '    <slot />' +
        '</div>'
});

VForm.components.VFormInput = VForm.components.VFormInput.extend({
    template: '<input class="form-control" :id="_id" :name="_name" :type="type" v-model="_value" />'
});

VForm.components.VFormNumber = VForm.components.VFormNumber.extend({
    template:
        '<div class="input-group">' +
        '    <span class="input-group-btn">' +
        '        <button :disabled="null !== min && min >= _value" class="btn btn-default" type="button" v-on:click="decrement()">' +
        '            <i class="fa fa-fw fa-minus"></i>' +
        '        </button>' +
        '    </span>' +
        '    <input class="form-control" ref="field" type="number" :id="_id" :name="_name" v-model="_value" :step="step" />' +
        '    <span class="input-group-btn">' +
        '        <button :disabled="null !== min && min >= _value" class="btn btn-default" type="button" v-on:click="increment()">' +
        '            <i class="fa fa-fw fa-plus"></i>' +
        '        </button>' +
        '    </span>' +
        '</div>'
});

VForm.components.VFormDate = VForm.components.VFormDate.extend({
    props: {
        inline: {
            type:    Boolean,
            default: false
        },
        formatValue: {
            type:    String,
            default: 'YYYY-MM-DD'
        },
        formatView: {
            type:    String,
            default: 'L'
        }
    },
    template:
        '<div class="input-group">' +
        '    <input ref="picker" class="form-control" />' +
        '    <input ref="field" type="hidden" :id="_id" :name="_name" v-model="_value">' +
        '    <span class="input-group-addon">' +
        '        <i class="fa fa-fw fa-calendar"></i>' +
        '    </span>' +
        '</div>',
    mounted: function () {
        $(this.$refs.picker).datetimepicker({
            format:  this.formatView,
            date:    moment(this.value, this.formatValue),
            inline:  this.inline,
            minDate: this.min,
            maxDate: this.max
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

VForm.components.VFormTime = VForm.components.VFormTime.extend({
    props: {
        inline: {
            type:    Boolean,
            default: false
        },
        formatValue: {
            type:    String,
            default: 'HH:mm:ss'
        },
        formatView: {
            type:    String,
            default: 'LTS'
        }
    },
    template:
        '<div class="input-group">' +
        '    <input ref="picker" class="form-control" />' +
        '    <input ref="field" type="hidden" :id="_id" :name="_name" v-model="_value">' +
        '    <span class="input-group-addon">' +
        '        <i class="fa fa-fw fa-clock-o"></i>' +
        '    </span>' +
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

VForm.components.VFormCheckbox = VForm.components.VFormCheckbox.extend({
    props: {
        inline: {
            type:    Boolean,
            default: false
        }
    },
    template:
        '<label v-if="inline" class="checkbox-inline">' +
        '    <input ref="field" type="checkbox" :id="_id" :name="_name" v-model="_value" :value="check"> {{ label }}' +
        '</label>' +
        '<div v-else class="checkbox">' +
        '    <label>' +
        '        <input ref="field" type="checkbox" :id="_id" :name="_name" v-model="_value" :value="check"> {{ label }}' +
        '    </label>' +
        '</div>'
});

VForm.components.VFormRadio = VForm.components.VFormRadio.extend({
    props: {
        inline: {
            type:    Boolean,
            default: false
        }
    },
    template:
        '<label v-if="inline" class="radio-inline">' +
        '    <input ref="field" type="radio" :id="_id" :name="_name" v-model="_value" :value="check"> {{ label }}' +
        '</label>' +
        '<div v-else class="radio">' +
        '    <label>' +
        '        <input ref="field" type="radio" :id="_id" :name="_name" v-model="_value" :value="check"> {{ label }}' +
        '    </label>' +
        '</div>'
});

VForm.components.VFormChoice = VForm.components.VFormChoice.extend({
    template:
        '<select class="form-control" ref="field" v-if="!expanded" :name="_name" :multiple="multiple" v-model="_value">' +
        '    <option v-for="choice in _choices" v-bind:value="choice.id">{{ choice.label }}</option>' +
        '</select>' +
        '<div v-else-if="!multiple">' +
        '    <VFormRadio v-for="choice in _choices" ref="field" :inline="true" :key="choice.id" :name="_name" :label="choice.label" v-bind:value="choice.id" v-model="_value" :check="choice.id" />' +
        '</div>' +
        '<div v-else>' +
        '    <VFormCheckbox v-for="choice in _choices" ref="field" :inline="true" :key="choice.id" :name="_name" :label="choice.label" v-model="selected[choice.id]" :check="choice.id" />' +
        '</div>'
});

VForm.components.VFormRange = VForm.components.VFormRange.extend({
    props: {
        range: {
            type:    Boolean,
            default: false
        },
        tooltip: {
            type:    String,
            default: 'hide'
        },
        handle: {
            type:    String,
            default: 'square'
        }
    },
    mounted: function () {
        this.$refs.field.style.width = '100%';

        this.slider = new Slider(this.$refs.field, {
            range:   this.range,
            step:    this.step,
            min:     this.min,
            max:     this.max,
            value:   this.range && !(this.value instanceof Array) ? [this.min, this.max] : this.value || 0,
            tooltip: this.tooltip,
            handle:  this.handle
        }).on('change', function (data) {
            this.$emit('input', data.newValue);
        }.bind(this));

        if (this.tooltip === 'hide') {
            var updateStyle = function (el) {
                el.style.color      = '#fff';
                el.style.textAlign  = 'center';
                el.style.fontSize   = '12px';
                el.style.paddingTop = '2px';
            };

            var updateValue = function (data) {
                if (Array.isArray(data.newValue)) {
                    updateStyle(this.slider.handle1);
                    updateStyle(this.slider.handle2);

                    this.slider.handle1.innerHTML = data.newValue[0];
                    this.slider.handle2.innerHTML = data.newValue[1];
                } else {
                    updateStyle(this.slider.handle1);
                    this.slider.handle1.innerHTML = data.newValue;
                }
            }.bind(this);

            this.slider.on('change', updateValue);
            updateValue({newValue: this.slider.getValue()});
        }
    }
});

VForm.components.VFormTextarea = VForm.components.VFormTextarea.extend({
    template: '<textarea ref="field" class="form-control" :id="_id" :name="_name" :cols="cols" :rows="rows" v-model="_value"></textarea>'
});
