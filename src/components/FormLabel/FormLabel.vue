<template>
  <div class="form-label" :class="{required:required!==undefined}">
    {{label}}
  </div>
</template>
<script>
  export default {
    name: "form-label",
    props: ['required', 'label'],
    data(){
      return{

      }
    }
  }
</script>
<style lang="scss" scoped>
.form-label{
  text-align: right;
  font-size: 14px;
  line-height: 16px;
  padding: 8px 15px;
  &.required::before{
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}
</style>
