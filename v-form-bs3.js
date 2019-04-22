VForm.components.VFormInput = VForm.components.VFormInput.extend({
    template: '<input class="form-control" :id="_id" :name="_name" v-model="_value" />'
});

VForm.components.VFormNumber = VForm.components.VFormNumber.extend({
    props: {
        displayButtons: {
            type:    Boolean,
            default: true
        }
    },
    template:
        '<div class="input-group">' +
        '    <span class="input-group-btn" v-if="displayButtons">' +
        '        <button :disabled="null !== min && min >= _value" class="btn btn-default" type="button" v-on:click="decrement()">' +
        '            <i class="fa fa-fw fa-minus"></i>' +
        '        </button>' +
        '    </span>' +
        '    <input class="form-control" ref="field" type="number" :id="_id" :name="_name" v-model="_value" :step="step" />' +
        '    <span class="input-group-btn" v-if="displayButtons">' +
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

VForm.components.VFormDuration = VForm.components.VFormDuration.extend({
    template:
        '<table>' +
        '    <tr>' +
        '        <td v-if="displayDays"><VFormNumber :name="_name" v-model="days" :display-buttons="false" /></td>' +
        '        <td><VFormNumber :name="_name" v-model="hours"  :display-buttons="false"/></td>' +
        '        <td><VFormNumber :name="_name" v-model="minutes"  :display-buttons="false"/></td>' +
        '        <td v-if="displaySeconds"><VFormNumber :name="_name" v-model="seconds"  :display-buttons="false"/></td>' +
        '    </tr>' +
        '    <tr>' +
        '        <td v-if="displayDays">Days</td>' +
        '        <td>Hours</td>' +
        '        <td>Minutes</td>' +
        '        <td v-if="displaySeconds">Seconds</td>' +
        '    </tr>' +
        '</table>'
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
