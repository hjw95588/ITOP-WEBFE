<template>
  <div class="v5-template">
    <!-- <el-row>
      <el-col :span="3">
        <label>{{label}}</label>
      </el-col>
      <el-col :span="3">
        <el-input-number :name="name"
          :value="value"
          @change="InputNumber"
          :placeholder="placeholder" controls-position="right" :min="1" :max="10">
        </el-input-number>
      </el-col>
    </el-row> -->

    <el-col :span="girdSpan">
      <el-form>
        <el-form-item :label="label">
          <el-input-number
            :name="name"
            :value="value"
            @change="InputNumber"
            :placeholder="placeholder"
            controls-position="right"
            :min="1"
            :max="10"
          >
          </el-input-number>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- <label>{{label}}</label>
    <el-input-number :name="name"
      :value="value"
      @change="InputNumber"
      :placeholder="placeholder" controls-position="right" :min="1" :max="10">
    </el-input-number> -->
  </div>
</template>
<script>
export default {
  name: "NumberInput",
  props: ["placeholder", "label", "name", "value", "girdSpan"],
  methods: {
    InputNumber(value) {
      this.$emit("input", value);
    }
  }
};
</script>
