<template>
  <ul class="vlb_idx clearfix">
    <li style="width: 70%;">
      <div class="idx_li1">
        <ul class="stat_11_ul">
          <li>
            <div id="stat11_1"></div>
          </li>
          <li>
            <div id="stat11_2"></div>
          </li>
        </ul>
      </div>
    </li>
    <li style="width: 30%;">
      <div class="idx_li1">
        <div class="stat_li_t">
          <h2>运行状况（实时）</h2>
        </div>
        <div class="stat_li_c">
          <ul class="stat_12_ul">
            <li>
              <div id="stat12_1"></div>
            </li>
            <li>
              <div id="stat12_2"></div>
            </li>
            <li>
              <div id="stat12_3"></div>
            </li>
          </ul>
        </div>
      </div>
    </li>
    <!-- 设备建设区域分布 -->
    <li>
      <div class="idx_li2">
        <div class="stat_li_t">
          <h2>设备建设区域分布</h2>
          <el-form :inline="true" :model="searchForm3" class="stat_li_tf" size="small">
            <el-form-item>
              <el-select class="stat_sel_w" v-model="searchForm3.area" placeholder="选择行政范围">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select class="stat_sel_w" v-model="searchForm3.year" placeholder="选择建设年份">
                <el-option label="2019" value="2019"></el-option>
                <el-option label="2018" value="2018"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchForm3Submit">统计</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="stat_li_c">
          <div class="stat_li_cc" id="charContainer3"></div>
        </div>
      </div>
    </li>
    <!-- 各单位的设备在线情况 -->
    <li>
      <div class="idx_li2">
        <div class="stat_li_t">
          <h2>各单位的设备在线情况</h2>
          <el-form :inline="true" :model="searchForm4" class="stat_li_tf" size="small">
            <el-form-item>
              <el-select class="stat_sel_w" v-model="searchForm4.dept" placeholder="选择上级单位">
                <el-option label="2019" value="2019"></el-option>
                <el-option label="2018" value="2018"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchForm4Submit">统计</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="stat_li_c">
          <div class="stat_li_cc" id="charContainer4"></div>
        </div>
      </div>
    </li>
    <!-- 设备报修区域统计 -->
    <li>
      <div class="idx_li2">
        <div class="stat_li_t">
          <h2>设备报修区域统计</h2>
          <el-form :inline="true" :model="searchForm5" class="stat_li_tf" size="small">
            <el-form-item>
              <el-select class="stat_sel_w" v-model="searchForm5.area" placeholder="选择行政范围">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select class="stat_sel_w" v-model="searchForm5.year" placeholder="选择建设年份">
                <el-option label="2019" value="2019"></el-option>
                <el-option label="2018" value="2018"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchForm5Submit">统计</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="stat_li_c">
          <div class="stat_li_cc" id="charContainer5"></div>
        </div>
      </div>
    </li>
    <!-- 设备状态变化趋势 -->
    <li>
      <div class="idx_li2">
        <div class="stat_li_t">
          <h2>设备状态变化趋势</h2>
          <el-form :inline="true" :model="searchForm6" class="stat_li_tf" size="small">
            <el-form-item>
              <el-select class="stat_sel_w" v-model="searchForm6.area" placeholder="选择行政范围">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select class="stat_sel_w" v-model="searchForm6.year" placeholder="选择建设年份">
                <el-option label="2019" value="2019"></el-option>
                <el-option label="2018" value="2018"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchForm6Submit">统计</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="stat_li_c">
          <div class="stat_li_cc" id="charContainer6"></div>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
import G2 from "@antv/g2";
import { View } from "@antv/data-set";
export default {
  data() {
    return {
      colors: [
        "l(0) 0:#6639B6 1:#AD7DFE",
        "l(0) 0:#0578DE 1:#1AA9FF",
        "l(0) 0:#29A43B 1:#45BF57"
      ],
      searchForm3: {
        area: "",
        year: ""
      },
      searchForm4: {
        dept: ""
      },
      searchForm5: {
        area: "",
        year: ""
      },
      searchForm6: {
        area: "",
        year: ""
      },
      // 图标集合
      charts: {
        chart11: null,
        chart3: null,
        chart4: null,
        chart5: null,
        chart6: null
      }
    };
  },
  mounted() {
    this.initSize();
    this.searchForm111Submit();
    this.searchForm112Submit();
    this.searchForm12Submit();
    this.searchForm3Submit();
    this.searchForm4Submit();
    this.searchForm5Submit();
    this.searchForm6Submit();
  },
  methods: {
    initSize() {
      let iw = $(".vlb_idx").width() - 40;
      console.log(iw);
      let ih1 = 200,
        ih2 = 200;
      ih1 = (iw * 600 * 0.25) / 405;
      ih2 = (iw * 443) / 2 / 830;
      $(".idx_li1").height(ih1);
      $(".idx_li2").height(ih2);
    },

    searchForm111Submit() {
      this.statistics111();
    },
    statistics111() {
      var data = [
        {
          type: "高清",
          sum: 20010
        },
        {
          type: "标清",
          sum: 6500
        }
      ];
      var total = 20010 + 6500;
      let dv = new View().source(data);
      let temp = document.getElementById("stat11_1");
      let chart = new G2.Chart({
        container: "stat11_1",
        forceFit: true,
        padding: [1 * 12, 6 * 12, 2 * 12, 0 * 12],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      chart.source(dv);
      chart.tooltip(true, {
        showTitle: false
      });
      chart.legend({
        position: "right-center",
        offsetX: -20,
        title: null,
        useHtml: true,
        hoverable: false,
        containerTpl:
          '<div class="g2-legend vi_stat11_leg"><div class="g2-legend-list"></div></div>',
        itemTpl: function itemTpl(value, color, checked, index) {
          const obj = dv.rows[index];
          let markerDom =
            '<div class="stat11_leg_mkm">' +
            '<div class="stat11_leg_marker" style="background-color:' +
            color +
            '"></div>' +
            '<i class="stat11_leg_marker2" style="background-color:' +
            color +
            '"></i></div>';
          let percentDom =
            '<div class="stat11_leg_percent">' +
            String(Math.round((obj.sum / total) * 100)) +
            "%" +
            "</div>";
          let nameDom =
            '<div class="stat11_leg_name com_keepall">' + obj.type + "</div>";
          return (
            '<div class="g2-legend-list-item">' +
            markerDom +
            percentDom +
            nameDom +
            "</div>"
          );
        }
      });
      chart.coord("theta", {
        radius: 0.75,
        innerRadius: 0.6
      });
      chart
        .intervalStack()
        .position("sum")
        .color("type", ["#0C70F8", "#3EBC50"])
        .opacity(1)
        .label("sum", {
          offset: -24,
          textStyle: {
            fill: "white",
            fontSize: 16,
            shadowBlur: 2,
            shadowColor: "rgba(0, 0, 0, .45)"
          },
          rotate: 0,
          autoRotate: false,
          formatter: function formatter(text, item) {
            return String(Math.round((item.point.sum / total) * 100)) + "%";
          }
        });
      chart.guide().html({
        position: ["50%", "50%"],
        html:
          "<div>" +
          '<p style="text-align: center; font-size: 30px; color: #333; font-weight: bold;">' +
          total +
          "</p>" +
          '<p style="text-align: center; font-size: 14px; color: #999;">设备智能化</p>' +
          "</div>"
      });
      chart.render();
    },

    searchForm112Submit() {
      this.statistics112();
    },
    statistics112() {
      var data = [
        {
          type: "人脸识别",
          sum: 4800
        },
        {
          type: "结构分析",
          sum: 1200
        },
        {
          type: "智能监控",
          sum: 2400
        },
        {
          type: "其它",
          sum: 3600
        }
      ];
      var total = 4800 + 1200 + 2400 + 3600;
      let dv = new View().source(data);
      let temp = document.getElementById("stat11_2");
      let chart = new G2.Chart({
        container: "stat11_2",
        forceFit: true,
        padding: [1 * 12, 6 * 12, 2 * 12, 0 * 12],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      chart.source(dv);
      chart.tooltip(true, {
        showTitle: false
      });
      chart.legend({
        position: "right-center",
        offsetX: -20,
        title: null,
        useHtml: true,
        hoverable: false,
        containerTpl:
          '<div class="g2-legend vi_stat11_leg"><div class="g2-legend-list"></div></div>',
        itemTpl: function itemTpl(value, color, checked, index) {
          const obj = dv.rows[index];
          let markerDom =
            '<div class="stat11_leg_mkm">' +
            '<div class="stat11_leg_marker" style="background-color:' +
            color +
            '"></div>' +
            '<i class="stat11_leg_marker2" style="background-color:' +
            color +
            '"></i></div>';
          let percentDom =
            '<div class="stat11_leg_percent">' +
            String(Math.round((obj.sum / total) * 100)) +
            "%" +
            "</div>";
          let nameDom =
            '<div class="stat11_leg_name com_keepall">' + obj.type + "</div>";
          return (
            '<div class="g2-legend-list-item">' +
            markerDom +
            percentDom +
            nameDom +
            "</div>"
          );
        }
      });
      chart.coord("theta", {
        radius: 0.75,
        innerRadius: 0.6
      });
      chart
        .intervalStack()
        .position("sum")
        .color("type", ["#0FB1FF", "#0C70F8", "#3EBC50", "#4C3EB4"])
        .opacity(1)
        .label("sum", {
          offset: -24,
          textStyle: {
            fill: "white",
            fontSize: 16,
            shadowBlur: 2,
            shadowColor: "rgba(0, 0, 0, .45)"
          },
          rotate: 0,
          autoRotate: false,
          formatter: function formatter(text, item) {
            return String(Math.round((item.point.sum / total) * 100)) + "%";
          }
        });
      chart.guide().html({
        position: ["50%", "50%"],
        html:
          "<div>" +
          '<p style="text-align: center; font-size: 30px; color: #333; font-weight: bold;">' +
          total +
          "</p>" +
          '<p style="text-align: center; font-size: 14px; color: #999;">设备智能化</p>' +
          "</div>"
      });
      chart.render();
    },

    searchForm12Submit() {
      const data = [
        { name: "房间", value: 90, count: 2645, unit: "间" },
        { name: "监控", value: 90, count: 2645, unit: "个" },
        { name: "路灯", value: 50, count: 4145, unit: "盏" }
      ];
      for (let i = 0; i < 3; i++) {
        this.statistics12(data[i], i + 1);
      }
    },
    statistics12(data, index) {
      // 极坐标下的柱状图
      // 构造数据
      data = [
        {
          item: "事例一",
          count: 70,
          percent: 0.7
        },
        {
          item: "事例二",
          count: 30,
          percent: 0.3
        }
      ];

      let temp026 = document.getElementById("stat12_" + index);
      const chart = new G2.Chart({
        container: "stat12_" + index,
        forceFit: true,
        padding: [1 * 12, 0, 2 * 12, 0 * 12],
        width: G2.DomUtil.getWidth(temp026),
        height: G2.DomUtil.getHeight(temp026)
      });
      chart.source(data, {
        percent: {
          formatter: function formatter(val) {
            val = val * 100 + "%";
            return val;
          }
        }
      });
      chart.coord("theta", {
        startAngle: -1 * Math.PI, // 极坐标的起始角度，单位为弧度
        endAngle: 0 * Math.PI, // 极坐标的结束角度，单位为弧度
        innerRadius: 0.7,
        radius: 0.9,
        innerRadius: 0.75
      });
      chart.tooltip(false);
      chart.legend(false);
      /* chart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      }); */
      // 辅助文本
      chart.guide().html({
        position: ["50%", "75%"],
        html:
          '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;font-size:20px">70%<br><span style="color:#8c8c8c;font-size:14px">视频达标率</span></div>',
        alignX: "middle",
        alignY: "middle"
      });
      chart
        .intervalStack()
        .position("percent")
        .color("item", [this.colors[index - 1], "#f2f2f2"])
        .style({
          lineWidth: 0,
          stroke: "#fff"
        });
      chart.render();
    },
    searchForm3Submit() {
      const data = [
        { genre: "卢峰镇", sold: 275 },
        { genre: "桥江镇", sold: 115 },
        { genre: "江口镇", sold: 120 },
        { genre: "大华镇", sold: 350 },
        { genre: "新田乡", sold: 150 },
        { genre: "卢峰镇2", sold: 190 },
        { genre: "外埠镇", sold: 220 }
      ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
      this.statistics3(data);
    },
    statistics3(data) {
      let chart = null;
      if (this.charts.chart3) {
        this.charts.chart3.clear();
        chart = this.charts.chart3;
      } else {
        let temp = document.getElementById("charContainer3");
        chart = new G2.Chart({
          container: "charContainer3",
          forceFit: true,
          padding: [12, 24, 60, 60],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      // Step 2: 载入数据源
      chart.source(data, {
        sold: {
          min: 0
        }
      });
      chart.legend(false);
      // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
      chart
        .interval()
        .position("genre*sold")
        .color("genre", ["l(270) 0:#00A2FF 1:#0C70F8"])
        .size(20)
        .shape("cylinder");
      // Step 4: 渲染图表
      chart.render();
      this.charts.chart3 = chart;
    },
    searchForm4Submit() {
      const data = [
        { name: "卢峰镇", 总数: 275, 在线: 140 },
        { name: "桥江镇", 总数: 250, 在线: 192 },
        { name: "江口镇", 总数: 360, 在线: 50 },
        { name: "大华镇", 总数: 180, 在线: 100 },
        { name: "新田乡", 总数: 255, 在线: 200 },
        { name: "卢峰镇2", 总数: 332, 在线: 90 },
        { name: "外埠镇", 总数: 180, 在线: 170 }
      ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
      this.statistics4(data);
    },
    statistics4(data) {
      let chart = null;
      if (this.charts.chart4) {
        this.charts.chart4.clear();
        chart = this.charts.chart4;
      } else {
        let temp = document.getElementById("charContainer4");
        chart = new G2.Chart({
          container: "charContainer4",
          forceFit: true,
          padding: [36, 24, 60, 60],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(data);
      dv.transform({
        type: "fold",
        fields: ["总数", "在线"], // 展开字段集
        key: "type", // key字段
        value: "value" // value字段
      });
      // Step 2: 载入数据源
      chart.source(dv, {
        name: {
          range: [0, 1]
        },
        value: {
          min: 0
        }
      });
      chart.legend({
        position: "top",
        title: null
      });
      chart.tooltip({
        crosshairs: {
          type: "y"
        }
      });
      // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
      chart
        .area()
        .position("name*value")
        .color("type", ["#8949f3", "#0c70f8"])
        .shape("smooth")
        .opacity(0.6);
      chart
        .line()
        .position("name*value")
        .color("type", ["#8949f3", "#0c70f8"])
        .size(2)
        .shape("smooth");
      chart.render();
      this.charts.chart4 = chart;
    },
    searchForm5Submit() {
      const data = [
        { area: "卢峰镇", 信号丢失: 38, 图像模糊: 23, 其他: 41 },
        { area: "桥江镇", 信号丢失: 21, 图像模糊: 12, 其他: 2 },
        { area: "江口镇", 信号丢失: 17, 图像模糊: 23, 其他: 3 },
        { area: "大华镇", 信号丢失: 22, 图像模糊: 11, 其他: 42 },
        { area: "新田乡", 信号丢失: 40, 图像模糊: 32, 其他: 21 },
        { area: "卢峰镇2", 信号丢失: 9, 图像模糊: 13, 其他: 13 },
        { area: "外埠镇", 信号丢失: 30, 图像模糊: 23, 其他: 19 }
      ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
      this.statistics5(data);
    },
    statistics5(data) {
      let chart = null;
      if (this.charts.chart5) {
        this.charts.chart5.clear();
        chart = this.charts.chart5;
      } else {
        let temp = document.getElementById("charContainer5");
        chart = new G2.Chart({
          container: "charContainer5",
          forceFit: true,
          padding: [36, 24, 60, 60],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(data);
      dv.transform({
        type: "fold",
        fields: ["信号丢失", "图像模糊", "其他"], // 展开字段集
        key: "报修原因", // key字段
        value: "报修次数", // value字段
        retains: ["area"] // 保留字段集，默认为除fields以外的所有字段
      });
      // Step 2: 载入数据源
      chart.source(dv, {
        报修次数: {
          min: 0
        }
      });
      chart.legend({
        position: "top",
        title: null
      });
      chart.coord();
      chart.axis("area", {
        label: {
          offset: 12
        }
      });
      chart
        .intervalStack()
        .position("area*报修次数")
        .color("报修原因", ["#6262FF", "#50CC62", "#0C70F8"])
        .size(20);
      chart.render();
      this.charts.chart5 = chart;
    },
    searchForm6Submit() {
      const data = [
        { month: "一月", 正常: 11, 报修: 23, 异常: 41 },
        { month: "二月", 正常: 23, 报修: 23, 异常: 41 },
        { month: "三月", 正常: 15, 报修: 23, 异常: 41 },
        { month: "四月", 正常: 32, 报修: 23, 异常: 41 },
        { month: "五月", 正常: 21, 报修: 23, 异常: 41 },
        { month: "六月", 正常: 13, 报修: 23, 异常: 41 },
        { month: "七月", 正常: 45, 报修: 23, 异常: 41 },
        { month: "八月", 正常: 23, 报修: 23, 异常: 41 },
        { month: "九月", 正常: 39, 报修: 23, 异常: 41 },
        { month: "十月", 正常: 12, 报修: 23, 异常: 41 },
        { month: "十一月", 正常: 31, 报修: 23, 异常: 41 },
        { month: "十二月", 正常: 22, 报修: 23, 异常: 41 }
      ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
      this.statistics6(data);
    },
    statistics6(data) {
      let chart = null;
      if (this.charts.chart6) {
        this.charts.chart6.clear();
        chart = this.charts.chart6;
      } else {
        let temp = document.getElementById("charContainer6");
        chart = new G2.Chart({
          container: "charContainer6",
          forceFit: true,
          padding: [36, 24, 60, 60],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(data);
      dv.transform({
        type: "fold",
        fields: ["正常", "报修", "异常"], // 展开字段集
        key: "状态", // key字段
        value: "数量" // value字段
        // retains: ['area'] // 保留字段集，默认为除fields以外的所有字段
      });
      // Step 2: 载入数据源
      chart.source(dv, {
        month: {
          range: [0, 1]
        },
        数量: {
          min: 0
        }
      });
      chart.tooltip({
        crosshairs: {
          type: "line"
        }
      });
      chart.axis("数量", {
        label: {
          formatter: function formatter(val) {
            return val;
          }
        }
      });
      chart.legend({
        position: "top",
        title: null
      });
      chart
        .line()
        .position("month*数量")
        .color("状态")
        .shape("smooth");
      chart
        .point()
        .position("month*数量")
        .color("状态")
        .size(4)
        .shape("circle")
        .style({
          stroke: "#fff",
          lineWidth: 1
        });
      chart.render();
      this.charts.chart6 = chart;
    }
  }
};
</script>
<style lang="scss" scoped>
.vlb_idx {
  padding: 10px;
  height: 100%;
  overflow: auto;
  > li {
    float: left;
    padding: 10px;
    width: 50%;
    min-height: 200px;
    > div {
      position: relative;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 5px #f6f6f6;
      > .stat_li_t {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 80px;
        overflow: hidden;
        > h2 {
          float: left;
          font-weight: bold;
          font-size: 16px;
          color: #333;
          height: 80px;
          line-height: 80px;
          padding-left: 30px;
        }
        > .stat_li_tf {
          float: right;
          padding-right: 10px;
          padding-top: 25px;
        }
        &.stat_li_t2 {
          height: 60px;
          > h2 {
            height: 60px;
            line-height: 60px;
          }
        }
      }
      > .stat_li_c {
        padding-top: 80px;
        height: 100%;
        > .stat_li_cc {
          width: 100%;
          height: 100%;
        }
        &.stat_li_c2 {
          padding-top: 60px;
        }
      }
    }
  }
}
.stat_sel_w {
  width: 130px;
}
.stat_11_ul {
  height: 100%;
  overflow: hidden;
  padding-right: 30px;
  > li {
    float: left;
    width: 50%;
    height: 100%;
    > div {
      width: 100%;
      height: 100%;
    }
  }
}
.stat_12_ul {
  overflow: hidden;
  height: 100%;
  > li {
    height: 33.33%;
    padding-bottom: 10px;
    > div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style>
.vi_stat11_leg,
.vi_stat11_leg .g2-legend-list {
  overflow: hidden;
}
.vi_stat11_leg .g2-legend-list-item {
  position: relative;
  margin: 0 !important;
  padding-left: 35px;
  padding-bottom: 15px;
}
.vi_stat11_leg .stat11_leg_mkm {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 20px;
  height: 20px;
}
.stat11_leg_mkm .stat11_leg_marker {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.4;
}
.vi_stat11_leg .stat11_leg_marker2 {
  position: absolute;
  top: 25%;
  left: 25%;
  z-index: 2;
  width: 50%;
  height: 50%;
  border-radius: 50%;
}
.vi_stat11_leg .stat11_leg_percent {
  color: #333;
  font-size: 22px;
}
.vi_stat11_leg .stat11_leg_name {
  padding-top: 5px;
  color: #666;
  font-size: 14px;
  overflow: hidden;
}
</style>
