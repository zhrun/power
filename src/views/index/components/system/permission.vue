<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
    <span class="tip">
      没有权限！
    </span>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
export default {
  components: { visBreadcrumb },
  name: 'NoPermission',
  
  data() {
    return {
      breadcrumbData: [{ name: "系统" }, { name: "无权限" }],
    }
  },
  methods: {
    
  }
}
</script>

<style lang='scss' scoped>
.tip {
  color: #333;
  font-size: 42px;
}
</style>