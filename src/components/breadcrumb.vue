<template>
  <el-breadcrumb   separator-class="el-icon-arrow-right" class="vl_breadcrumb">
    <template v-for="(item, index) in bdData">
      <el-breadcrumb-item :key="'vl_db_' + index" v-if="item.routerName" 
        :to="{ name: item.routerName, query: item.query, params: item.params }">{{item.name}}</el-breadcrumb-item>
      <el-breadcrumb-item :key="'vl_db_' + index" v-else>{{item.name}}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>
<script>
/* 
 * breadcrumbData {arrayObject} 面包屑数据
 *    name        {string} 面包屑名称/显示的标题
 *    routerName  {string} 需要跳转的路由名称
 *    query       {object} query 参数
 * e.g.
 *  [{name: '车辆侦查', routerName: 'vehicle', query: {plateNo: '001'}}, {name: '过车查看'}]
 */
export default {
  props: ['breadcrumbData'],
  data () {
    return {
      bdData: []
    }
  },
  watch: {
    breadcrumbData() {
      this.bdData = this.breadcrumbData;
    }
  },
  mounted() {
    this.bdData = this.breadcrumbData;
  }
}
</script>
<style lang="scss" scoped>
.vl_breadcrumb {
  height: 60px; 
  line-height: 60px;
  font-size: 14px;
}
</style>
<style lang="scss">
.vl_breadcrumb {
  .el-breadcrumb__inner{
    color:#999999
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner{
    color: #5357FD;
  }
}
</style>