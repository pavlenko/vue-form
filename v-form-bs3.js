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
    template:
        '<div class="input-group">' +
        '    <input class="form-control" ref="field" type="date" :id="_id" :name="_name" v-model="_value" :step="step" />' +
        '    <span class="input-group-addon">' +
        '        <i class="fa fa-fw fa-calendar"></i>' +
        '    </span>' +
        '</div>'
});

VForm.components.VFormTime = VForm.components.VFormTime.extend({
    template:
        '<div class="input-group">' +
        '    <input class="form-control" ref="field" type="time" :id="_id" :name="_name" v-model="_value" :step="step" />' +
        '    <span class="input-group-addon">' +
        '        <i class="fa fa-fw fa-clock-o"></i>' +
        '    </span>' +
        '</div>'
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
            default: 'round'
        }
    },
    mounted: function () {
        this.$refs.field.style.width = '100%';

        //TODO display value in handle block
        new Slider(this.$refs.field, {
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
    }
});
