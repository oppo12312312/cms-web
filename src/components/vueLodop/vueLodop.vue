<template>
  <v-dialog ref="printDialog" :title="patchData.title" :show-confirm="false">
    <el-alert class="fn-mb15" title="" type="warning" :closable="false">
      系统提示您：
      <p>点击【打开设计】按钮进入模板设计。</p>
      <p>
        模板设计完成后，点击设计页面的【暂存】按钮，并关闭设计页面，点击【保存设计】按钮，将模板保存。
      </p>
    </el-alert>
    <div class="txt-center" v-if="needCLodop">
      您尚未安装打印控件<a :download="url" :href="url">点击下载</a>
      <p>安装完成之后请重新打开浏览器或者刷新页面</p>
    </div>
    <div class="txt-center" v-else>
      <el-button @click="displayDesign" type="primary">
        <span>打开设计</span>
      </el-button>
      <el-button @click="save" type="success">
        <span>保存设计</span>
      </el-button>
    </div>
  </v-dialog>
</template>

<script>
import { getLodop, needCLodop } from "@/assets/js/LodopFuncs.js";

export default {
  name: "vue-lodop",
  components: {},
  props: {
    patchData: Object,
  },
  data() {
    return {
      design: {},
      detail: {},
      getScheme: null,
      needCLodop: true,
      url:
        process.env.NODE_ENV === "production"
          ? `/${PROJECT.projectName}/static/zips/Lodop6.226_Clodop4.127.zip`
          : "/static/zips/Lodop6.226_Clodop4.127.zip",
    };
  },
  created() {
    if (getLodop()) {
      this.needCLodop = false;
    } else {
      setTimeout(() => {
        getLodop() && (this.needCLodop = false);
      }, 500);
    }
  },
  methods: {
    show(getScheme) {
      this.getScheme = getScheme;
      getScheme().then((data) => {
        this.design = data.data.scheme && (data.data.scheme.content || {});
        this.detail = data.data.scheme;
        this.$refs.printDialog.dialogVisible = true;
      });
    },
    print(design) {
      const me = this;
      LODOP = getLodop();
      // let nDes = '';
      // for(let i = 0; i < design.length; i ++){
      //   design[i] += 'LODOP.NewPage();';
      //   nDes += design[i];
      // }
      eval(design || {});
      if (LODOP.CVERSION) CLODOP.On_Return = null;
      LODOP.PRINT();
      //LODOP.PREVIEW();
    },
    displayDesign() {
      const that = this;
      LODOP = getLodop();
      eval(that.design);
      if (LODOP.CVERSION)
        CLODOP.On_Return = function (TaskID, Value) {
          that.design = Value;
        };
      that.design = LODOP.PRINT_DESIGN();
    },
    save() {
      this.$emit(
        "saveScheme",
        {
          id: this.detail.id,
          content: this.design,
        },
        () => {
          this.getScheme().then((data) => {
            this.design = data.data.scheme.content || {};
            this.detail = data.data.scheme;
          });
        }
      );
    },
  },
};
</script>
