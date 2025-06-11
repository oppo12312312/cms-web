<template>
  <div>
    <header style="background: #fff">
      <div style="max-width: 1200px; margin: auto">
        <img
          style="width: 240px; height: 50px; margin: 15px 0"
          src="@p/static/imgs/cxlogo.webp"
        />
      </div>
    </header>
    <div>
      <img style="width: 100%; height: 320px" src="@p/static/imgs/cxbg.webp" />
      <div
        style="
          max-width: 1200px;
          position: relative;
          margin: -240px auto 0;
          border-radius: 8px;
          background: #fff;
          padding: 30px;
        "
      >
        <div
          style="
            font-weight: 500;
            font-size: 32px;
            color: #455166;
            text-align: center;
            margin-bottom: 30px;
          "
        >
          普通高考录取结果查询
        </div>
        <v-form
          :fields="fields"
          :fieldsData="fieldsData"
          style="max-width: 430px; margin: auto"
        >
          <el-col :span="24" style="text-align: center">
            <el-button
              type="primary"
              @click="fecthData"
              style="width: 112px; background: #06705f"
              >查询</el-button
            >
          </el-col>
        </v-form>
        <div v-if="initShow && queryRes">
          <div
            style="
              width: 880px;
              margin: 24px auto;
              font-size: 18px;
              color: #455166;
            "
          >
            查询结果：<span style="color: #198061">成功</span>
          </div>
          <div class="lqinfotitle">新生基本信息</div>
          <table>
            <thead>
              <tr>
                <th>考生号</th>
                <th>准考证号</th>
                <th>姓名</th>
                <th>性别</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ queryRes.ksh }}</td>
                <td>{{ queryRes.zkzh }}</td>
                <td>{{ queryRes.xm }}</td>
                <td>{{ queryRes.xb }}</td>
              </tr>
            </tbody>
          </table>
          <div class="lqinfotitle">新生录取信息</div>
          <table>
            <thead>
              <tr>
                <th>批次名称</th>
                <th>考生状态</th>
                <th colspan="2">专业</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ queryRes.pc }}</td>
                <td>{{ queryRes.ksztStr }}</td>
                <td colspan="2">{{ queryRes.lqzymc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="initShow && !queryRes">
          <div
            style="
              width: 880px;
              margin: 24px auto;
              font-size: 18px;
              color: #455166;
            "
          >
            查询结果：<span style="color: #f05f60">失败</span>
          </div>
          <div
            style="
              width: 880px;
              margin: 0 auto;
              height: 242px;
              background: #f5f7fc;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <img
              style="width: 40px; height: 40px; margin-right: 24px"
              src="@p/static/imgs/failicon.webp"
            />
            <div>
              <p style="color: #455166; margin: 8px 0">
                请确认输入的考生号是否正确
              </p>
              <p style="color: #455166; margin: 8px 0">
                请确认输入的身份证号是否正确
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer style="text-align: center; position: fixed; width: 100%; bottom: 0">
      <div
        style="font-weight: 400; font-size: 14px; color: #455166; margin: 8px"
      >
        地址：湖北省十堰市人民南路30号
      </div>
      <div
        style="
          font-weight: 400;
          font-size: 14px;
          color: #455166;
          margin-bottom: 12px;
        "
      >
        邮编：442000&nbsp;&nbsp;&nbsp;&nbsp;联系方式：0719-8891088
      </div>
      <div
        style="
          font-size: 14px;
          color: #b5bac9;
          height: 44px;
          line-height: 44px;
          border-top: 1px solid #dde0ee;
        "
      >
        版权所有：©
        湖北医药学院&nbsp;&nbsp;&nbsp;&nbsp;鄂ICP05003342&nbsp;&nbsp;&nbsp;&nbsp;建议使用IE6.0以上浏览器
      </div>
    </footer>
  </div>
</template>

<script>
import { lqcx } from "#/api/common";
export default {
  name: "QueryLqinfo",
  data() {
    return {
      fields: [
        {
          label: "身份证：",
          type: "text",
          span: 24,
          placeholder: "请输入身份证",
          prop: "sfzh",
        },
        {
          label: "考生号：",
          type: "text",
          span: 24,
          placeholder: "请输入考生号",
          prop: "ksh",
        },
      ],
      fieldsData: {},
      queryRes: {},
      initShow: false,
    };
  },
  methods: {
    fecthData() {
      lqcx(this.fieldsData).then((res) => {
        this.queryRes = res.data;
        this.initShow = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.lqinfotitle {
  width: 880px;
  margin: 24px auto 16px;
  font-weight: 500;
  color: #455166;
  padding-left: 8px;
  border-left: 4px solid #cde2df;
}

table {
  width: 880px;
  margin: 0 auto;
  font-weight: 400;
  font-size: 14px;
  color: #455166;
  text-align: center;

  th {
    border: 1px solid #edf1f8;
    background: #e4eff4;
    height: 40px;
    line-height: 40px;
  }

  td {
    width: 25%;
    border: 1px solid #edf1f8;
    height: 40px;
    line-height: 24px;
    padding: 0 10px;
  }
}
</style>
