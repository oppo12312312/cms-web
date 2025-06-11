<template>
  <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"> </v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import { getDefultId } from "@/projects/hbmu-suguan/api/sgApt";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  data() {
    return {
      ruleForm: {},
      fields: [],
      rules: {},
    };
  },
  created() {
    this.init();
  },
  watch: {
    patchData: function () {
      this.init(this.patchData);
    },
  },
  methods: {
    init() {
      let code = "";
      const query = {
        aptId: "",
        aptLevel: "top",
      };
      if (this.patchData.currentNode) {
        query.aptId = this.patchData.currentNode.aptId;
        query.aptLevel = this.patchData.aptId
          ? this.patchData.currentNode.parent.data.aptLevel
          : this.patchData.currentNode.aptLevel;
        query.nextLevel = this.patchData.nextLevel;
      }
      if (!this.patchData.aptId) {
        getDefultId(query).then((data) => {
          code = data.data;
          this.setForm(query.aptLevel, code);
        });
      } else {
        this.setForm(query.aptLevel, "");
      }
    },
    setForm(level, code) {
      let form = {};
      let fields = [
        {
          label: "编号：",
          prop: "campusCode",
          type: "text",
          disabled: true,
        },
        {
          label: "名称：",
          prop: "campusName",
          type: "text",
          rule: [
            {
              required: true,
              message: `请输入校区名称`,
              trigger: "blur",
            },
          ],
        },
        {
          label: "备注：",
          prop: "remark",
          type: "text",
        },
        {
          label: "图片：",
          prop: "files",
          type: "image",
          oFid:
            this.patchData.files && this.patchData.files.length
              ? this.patchData.files[0].fileId
              : "",
        },
      ];
      const fields1 = [
        {
          label: "编号：",
          prop: "zoneCode",
          type: "text",
          disabled: true,
        },
        {
          label: "名称：",
          prop: "zoneName",
          type: "text",
          rule: [
            {
              required: true,
              message: `请输入公寓区名称`,
              trigger: "blur",
            },
          ],
        },
        {
          label: "备注：",
          prop: "remark",
          type: "text",
        },
        {
          label: "图片：",
          prop: "files",
          type: "image",
          oFid:
            this.patchData.files && this.patchData.files.length
              ? this.patchData.files[0].fileId
              : "",
        },
      ];
      const rules = [];
      const isEdit = this.patchData.aptId ? true : false;
      switch (level) {
        case "campus":
          form = {
            campusId: isEdit
              ? this.patchData.currentNode.parent.data.aptId
              : this.patchData.currentNode.aptId,
            campusCode: isEdit
              ? this.patchData.currentNode.parent.data.aptCode
              : this.patchData.currentNode.aptCode,
            campusName: isEdit
              ? this.patchData.currentNode.parent.data.aptName
              : this.patchData.currentNode.aptName,
            zoneId: isEdit ? this.patchData.currentNode.aptId : code,
            zoneCode: isEdit ? this.patchData.currentNode.aptCode : code,
            zoneName: isEdit ? this.patchData.currentNode.aptName : "",
            remark: isEdit ? this.patchData.currentNode.remark : "",
            files: "",
          };
          fields = fields1;
          break;
        default:
          if (this.patchData.isSpect) {
            if (this.patchData.nextLevel == "campus") {
              form = {
                campusId: isEdit ? this.patchData.currentNode.aptId : code,
                campusCode: isEdit ? this.patchData.currentNode.aptCode : code,
                campusName: isEdit ? this.patchData.currentNode.aptName : "",
                remark: isEdit ? this.patchData.currentNode.remark : "",
                files: "",
              };
            } else {
              form = {
                zoneId: isEdit ? this.patchData.currentNode.aptId : code,
                zoneCode: isEdit ? this.patchData.currentNode.aptCode : code,
                zoneName: isEdit ? this.patchData.currentNode.aptName : "",
                remark: isEdit ? this.patchData.currentNode.remark : "",
                files: "",
              };
              fields = fields1;
            }
          } else {
            form = {
              campusId: isEdit ? this.patchData.currentNode.aptId : code,
              campusCode: isEdit ? this.patchData.currentNode.aptCode : code,
              campusName: isEdit ? this.patchData.currentNode.aptName : "",
              remark: isEdit ? this.patchData.currentNode.remark : "",
              files: "",
            };
          }
      }
      form.aptLevel = this.patchData.aptLevel;

      this.$set(this, "ruleForm", form);
      this.$set(this, "fields", fields);
    },
  },
};
</script>
<style lang="scss">
.set-form {
  .el-checkbox {
    margin-right: 5px;
  }
}
</style>
