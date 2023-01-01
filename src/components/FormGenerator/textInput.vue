<template>
  <div class="v5-template">
    <!-- <el-form-item :label="label" prop="roleName">
      <el-input style="width: 135px;" :name="name"
      :value="value"
      @input="TextInput"
      :placeholder="placeholder" clearable></el-input>
    </el-form-item> -->

    <el-col :span="girdSpan">
      <el-form>
        <el-form-item :label="label">
          <el-input
            style="width: 135px;"
            :name="name"
            :value="value"
            @input="TextInput"
            :placeholder="placeholder"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- <label>{{label}}</label>
    <el-input style="width: 135px;" :name="name"
      :value="value"
      @input="TextInput"
      :placeholder="placeholder" clearable></el-input> -->
  </div>
</template>
<script>
export default {
  name: "TextInput",
  props: ["placeholder", "label", "name", "value", "girdSpan"],
  methods: {
    TextInput(value) {
      this.$emit("input", value);
    }
  }
};
</script>
