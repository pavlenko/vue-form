### ```<VFormCollection />```

Example:

```vue
<template>
    <VFormCollection
        v-model="value"
        :min-children="2"
        :max-children="5"
        :allow-insert="true"
        :allow-delete="true">
        <VFormInput slot-scope="c" v-bind="c.options" v-model="c.value[c.index]" />
    </VFormCollection>
</template>

<script>
module.exports = {
    data: function () {
        return {
            value: ['Foo', 'Bar']
        }
    }
};
</script>
```
