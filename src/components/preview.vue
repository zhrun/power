<template>
  <div class="preview-wrap">
    <ul class="preview-list">
      <li v-for="(item, index) in eData" :key="index" v-show="index==currentEnclosIndex">
        <video v-if="item.fileType=='mp4'" class="video_item" controls>
          <source :src='item.fileFullPath' type="video/mp4">
        </video>
        <img v-else :src='item.fileFullPath' />
      </li>
    </ul>
    <el-button class="left-btn" icon="el-icon-arrow-left" circle @click="last" v-if="eData.length>1"></el-button>
    <el-button class="right-btn" icon="el-icon-arrow-right" circle @click="next" v-if="eData.length>1"></el-button>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'currentEnclosIndex',
    event: 'change'
  },
  props: ["eData",'currentEnclosIndex'],
  data() {
    return {
      // currentEnclosIndex: 0
    };
  },
  mounted() {
    console.log("this.eData=>", this.eData)
  },
  methods: {
    last() {
      let _index = this.currentEnclosIndex;
      if(_index>0) {
        _index--
      } else {
        _index = this.eData.length-1;
      }
      let videoEle = document.getElementsByClassName('video_item');
      for (let i = 0; i < videoEle.length; i++) {
        const element = videoEle[i];
        element.pause();
      }
      this.$emit('change', _index);
    },
    next() {
      let _index = this.currentEnclosIndex;
      if(_index < this.eData.length-1) {
        _index++
      } else {
        _index = 0;
      }
      let videoEle = document.getElementsByClassName('video_item');
      for (let i = 0; i < videoEle.length; i++) {
        const element = videoEle[i];
        element.pause();
      }
      this.$emit('change', _index);
    },
  }
};
</script>

<style lang="scss">
.preview-wrap {
  .el-button{
    background:#00000022;
    border-color: #cccccc;
    color: #aaaaaa;
  }
  .el-button:hover{
    background:#00000066;
    box-shadow: 0px 0px 5px 1px #333333;
    color: #ffffff;
  }
  height: 100%;
  position: relative;
  .preview-list {
    height: 100%;
    li {
      height: 100%;
      overflow: hidden;
      font-size: 0;
      text-align: center;
      img, video {
        display: inline-block;
        vertical-align: top;
        height: 70vh;
        // margin-top: 10vh;
        max-width: 100%;
      }
    }
  }
  .left-btn, .right-btn {
    position: absolute;
    min-width: auto;
    top: 50%;
    margin-top: -20px;
  }
  .left-btn {
    left: 10px;
  }
  .right-btn {
    right: 10px;
  }
}
</style>