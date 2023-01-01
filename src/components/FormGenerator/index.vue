<template>
  <div>
    <component
      v-for="(field, index) in schema"
      :key="index"
      :is="field.fieldType"
      :value="formData[field.name]"
      @input="updateForm(field.name, $event)"
      v-bind="field"
    >
    </component>
  </div>
</template>

<script>
import NumberInput from "./numberInput";
import SelectList from "./selectList";
import TextInput from "./textInput";
export default {
  name: "FormGenerator",
  components: { NumberInput, SelectList, TextInput },
  props: ["schema", "value"],
  data() {
    return {
      formData: this.value || {}
    };
  },
  methods: {
    updateForm(fieldName, value) {
      this.$set(this.formData, fieldName, value);
      this.$emit("input", this.formData);
    }
  }
};
</script>
<style>
.v5-template {
  margin: 10px auto;
}
</style>
