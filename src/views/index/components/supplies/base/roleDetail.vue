<!-- 
* @module role-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 查看角色权限/配置角色权限
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <main class="main_content">
    <div id="container" style="height:100%">

    </div>
    </main>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";

// import _xor from "lodash/xor";

export default {
  name: "role-permission",
  components: {
    visBreadcrumb,
  },
  props: {
    uid: "",
    roleName: "",
    flag: "",
  },
  data: () => ({
    breadcrumbData: [
      { name: "系统管理" },
      { name: "角色管理", routerName: "roleManagement" },
    ],
    title: "",
    treeData: [],
    authUidList: [],
    defaultProps: {
      children: "children",
      label: "resourceName",
    },
  }),

  mounted() {
  //  this.init()
  },
  methods: {
    // init(){
    //      // 创建地图实例
    //     var map = new AMap.Map("container", {
    //         viewMode: '3D',
    //         // pitch: 30,
    //         // rotation: 25,
    //         zoom: 18,
    //         center: [115.849867,28.681421],
    //         mapStyle: 'amap://styles/ee615cd8827db9ee531e251e6fc30f55',
    //         showIndoorMap: false,
    //         showBuildingBlock:false

    //     });

    //     // 创建Object3DLayer图层
    //     var object3Dlayer = new AMap.Object3DLayer();
    //     map.add(object3Dlayer);

    //     var druckMeshes, cityMeshes;


    //     map.plugin(["AMap.GltfLoader"], function () {
    //         var urlCity = 'http://localhost:9102/static/img/gltf/ko_lbs_108b75e9a265c3d01f1a456e73d3c4a3.gltf';
    //         var paramCity = {
    //             position: new AMap.LngLat(115.849867,28.681621), // 必须
    //             scale: 0.17, // 非必须，默认1
    //             height: 10,  // 非必须，默认0
    //             scene: 0, // 非必须，默认0
    //         };

    //         var gltfObj = new AMap.GltfLoader();

    //         gltfObj.load(urlCity, function (gltfCity) {
    //             cityMeshes = gltfCity;
    //             gltfCity.setOption(paramCity);
    //             gltfCity.rotateX(90);
    //             gltfCity.rotateZ(102);
    //             object3Dlayer.add(gltfCity);
    //         });


    //     });
    //     this.addPoint(map)
    // },
    // addPoint(map){
    //    let label = new AMap.Text({
    //   content: '',
    //   zIndex: 131,
    //   map: map
    // });
    // let html = `<div class="marker-name"><span></span><i></i></div>`
    //  label.show()
    //   label.setPosition([115.849867,28.681421]);
    //   label.setOffset(new AMap.Pixel(0, 0))
    //   label.setText(html)
   
    // }
  },
};
</script>
<style  lang="scss">
.amap-overlay-text-container{
  background: none;
  border: none;
}
.marker-name{
  background: transparent;
  height: 70px;
  position: relative;
  color: #ff0000;
  span{
    border: 1px solid #ff00ff;
    // background: #fff;
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url('//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png') center no-repeat;
    background-size: contain;
    padding: 3px;
    img{
      width: 20px;
      height: 20px;
    }
  }
  &:after{
    display: block;
    content: '';
    height: 50px;
    width: 2px;
    background: #ff00ff;
    position: absolute;
    bottom: 0px;
    left: 50%;
  }
  i{
    display: block;
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #ff00ff;
    bottom: 0px;
    left: 50%;
    margin-left: -3px;
  }
}
</style>
<style lang="scss" scoped>
.main_content {
  height: calc(100% - 40px);
  overflow-y: auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
}
.title {
  color: #5458fe;
  font-size: 16px;
  height: 40px;
}
.tree {
  width: 60%;
  height: 80%;
  border: 1px solid $border_color;
  padding: 20px 0 0 20px;
}
.footer_buttons {
  margin-top: 20px;
  display: flex;
  align-items: center;
  .el-button + .el-button {
    margin-left: 10px;
  }
}
</style>
