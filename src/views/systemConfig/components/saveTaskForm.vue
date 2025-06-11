<template>
  <v-form
    ref="ruleForm"
    :fields="fields"
    :fieldsData="ruleForm"
    labelWidth="220"
  >
    <p
      v-show="showElse == 'true'"
      style="position: absolute; left: 50%; top: 75px; margin-left: -20px"
    >
      秒
    </p>
    <el-col :span="24" v-show="showCron == 'true'">
      注：cron表达式格式请参照
      <a href="https://qqe2.com/cron" target="_blank" class="txt-highlight"
        >https://qqe2.com/cron</a
      >
    </el-col>
  </v-form>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import formMinxin from "_c/forms1/minxins/formMinxin.js";
import { validateCron } from "@/api/scheduleJob";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    //ydlbData: Array
  },
  data() {
    return {
      showCron: "false",
      showElse: "true",
      defaultType: "",
      ruleForm: {
        id: "",
        name: "",
        scheduleType: "",
        expression: "",
        status: "",
        triggerOnAbort: "",
        effectiveTime: "",
        expireTime: "",
        remark: "",
      },
    };
  },
  computed: {
    fields: function () {
      const me = this;
      const fields = [
        {
          label: "任务名称：",
          prop: "name",
          type: "text",
          placeholder: "请输入任务名称",
          span: 12,
          rule: [
            {
              required: true,
              message: `请输入任务名称`,
              trigger: "blur",
            },
          ],
        },
        {
          label: "定时器类型：",
          prop: "scheduleType",
          type: "select",
          span: 12,
          options: [
            {
              label: "固定频率",
              value: "fixedRate",
            },
            {
              label: "cron表达式",
              value: "cron",
            },
          ],
          rule: [
            {
              required: true,
              message: `请选择定时器类型`,
              trigger: "blur",
            },
          ],
        },
        /* {
          label: "定时器表达式：",
          prop: "expression",
          type: "text",
          span: 12,
          show: this.showCron,
          rule: [
            {
              required: true,
              message: `请输入表达式`,
              trigger: "blur",
            }
          ],
          blur: () => {
            let me = this;
            if(this.ruleForm.expression.trim()!=""){
              validateCron(this.ruleForm.expression).then( (data) => {
                if(!data.data){
                  me.toast('cron表达式格式不正确，请重新填写！','warning');
                  this.ruleForm.expression = "";
                  return false;
                }
              })
            }
          }
        },
        {
          label: "定时器表达式：",
          prop: "expression",
          type: "text",
          span: 12,
          show: this.showElse,
          rule: [
            {
              required: true,
              validator: this.validatorZzs,
              message: `请输入正整数`,
              trigger: "blur",
            }
          ],
        }, */
        {
          label: "任务状态：",
          prop: "status",
          type: "select",
          span: 12,
          options: [
            {
              label: "开启",
              value: "open",
            },
            {
              label: "关闭",
              value: "close",
            },
          ],
          rule: [
            {
              required: true,
              message: `请选择任务状态`,
              trigger: "blur",
            },
          ],
        },
        {
          label: "是否中断后启动立刻执行一次：",
          prop: "triggerOnAbort",
          type: "select",
          span: 12,
          options: [
            {
              label: "是",
              value: true,
            },
            {
              label: "否",
              value: false,
            },
          ],
          rule: [
            {
              required: true,
              message: `请选择`,
              trigger: "blur",
            },
          ],
        },
        {
          label: "生效时间：",
          prop: "effectiveTime",
          type: "datetime",
          dType: "datetime",
          format: "yyyy-MM-dd HH:mm:ss",
          formate: "yyyy-MM-dd HH:mm:ss",
          span: 12,
          /*  rule: [
            {
              required: true,
              message: `请选择生效时间`,
              trigger: "blur",
            },
          ], */
        },
        {
          label: "失效时间：",
          prop: "expireTime",
          type: "datetime",
          dType: "datetime",
          format: "yyyy-MM-dd HH:mm:ss",
          formate: "yyyy-MM-dd HH:mm:ss",
          span: 12,
          /*  rule: [
            {
              required: true,
              message: `请选择失效时间`,
              trigger: "blur",
            },
          ], */
        },
        {
          label: "备注：",
          prop: "remark",
          type: "textarea",
          placeholder: "请输入备注",
          span: 24,
        },
      ];
      if (this.showCron == "true") {
        fields.splice(2, 0, {
          label: "定时器表达式：",
          prop: "expression",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: `请输入表达式`,
              trigger: "blur",
            },
          ],
          blur: () => {
            const me = this;
            if (this.ruleForm.expression.trim() != "") {
              validateCron(this.ruleForm.expression).then((data) => {
                if (!data.data) {
                  me.toast("cron表达式格式不正确，请重新填写！", "warning");
                  this.ruleForm.expression = "";
                  return false;
                }
              });
            }
          },
        });
      } else {
        fields.splice(2, 0, {
          label: "定时器表达式：",
          prop: "expression",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              validator: this.validatorZzs,
              message: `请输入正整数`,
              trigger: "blur",
            },
          ],
        });
      }
      return fields;
    },
  },
  created() {
    this.init();
  },
  watch: {
    patchData: function () {
      this.init();
    },
    "ruleForm.scheduleType": function () {
      this.changeExpression();
      if (this.ruleForm.scheduleType != this.defaultType)
        this.ruleForm.expression = "";
    },
  },
  methods: {
    init() {
      this.initForm(this.patchData);
      this.defaultType = this.patchData.scheduleType;
      this.changeExpression();
    },
    changeExpression() {
      if (this.ruleForm.scheduleType == "cron") {
        this.showCron = "true";
        this.showElse = "false";
      } else {
        this.showCron = "false";
        this.showElse = "true";
      }
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
