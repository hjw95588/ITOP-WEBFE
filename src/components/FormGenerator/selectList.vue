<template>
  <div class="v5-template">
    <el-col :span="girdSpan">
      <el-form>
        <el-form-item :label="label">
          <el-select
            :multiple="multi"
            :value="value"
            @change="SelectVal"
            placeholder="请选择"
          >
            <el-option
              v-for="option in options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- <label>{{label}}</label>
    <el-select  :multiple="multi"
      :value="value"
      @change="SelectVal"
      placeholder="请选择">
      <el-option v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value">
      </el-option>
    </el-select> -->
  </div>
</template>
<script>
export default {
  name: "SelectList",
  props: ["multi", "options", "name", "label", "value", "girdSpan"],
  methods: {
    SelectVal(value) {
      this.$emit("input", value);
    }
  }
};
</script>
