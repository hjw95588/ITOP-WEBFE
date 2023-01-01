<template>
  <div>
    <div>我是孙子组件deaparture: {{ deaparture }}</div>
    <el-form ref="BaseForm" :nmodel="deaparture">
      <el-form-item label="员工资产" prop="code">
        <el-checkbox-group v-model="deaparture.code">
          <el-checkbox label="001">电脑</el-checkbox>
          <el-checkbox label="002">门禁卡</el-checkbox>
          <el-checkbox label="003">办公物品</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'DeaparTure',
  props: {
    deaparture: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>

</style>