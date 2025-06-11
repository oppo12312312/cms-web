<template>
  <div class="con-form-container" v-loading="loading">
    <el-form size="medium" status-icon ref="ruleForm" label-width="auto">
      <el-form-item label="请假类型设置：">
        <el-tag
          style="margin-right: 5px"
          v-for="(ca, index) in ruleForm.types"
          :key="index"
          @close="delCa(ca, index)"
          closable
        >
          {{ ca.typename }}
        </el-tag>
        <p style="width: 80px">
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="typeValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else type="text" icon="el-icon-plus" @click="showInput"
            >添加请假类型</el-button
          >
        </p>
      </el-form-item>
      <el-form-item class="rule-row" label="请假规则设置：">
        <el-row v-for="(ru, index) in ruleForm.rules" :key="index">
          <el-col :span="4">
            <el-form-item
              label=""
              :prop="'rules.' + index + '.name'"
              :rules="rules.name"
            >
              <el-input
                type="text"
                @keyup.enter.native="keyUpSubmit"
                v-model="ru.name"
                autocomplete="off"
                placeholder="请输入规则名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="请假时间大于"
              :prop="'rules.' + index + '.min'"
              :rules="rules.minDays"
            >
              <el-input
                type="text"
                @keyup.enter.native="keyUpSubmit"
                v-model.number="ru.min"
                autocomplete="off"
                placeholder="请输入天数"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="小于等于"
              :prop="'rules.' + index + '.max'"
              :rules="rules.maxDays"
            >
              <el-input
                type="text"
                @keyup.enter.native="keyUpSubmit"
                v-model.number="ru.max"
                autocomplete="off"
                placeholder="请输入天数"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
              type="text"
              @click="$refs.saveFormDialog.dialogVisible = true"
              >配置请假单</el-button
            >
            <i
              style="margin-left: 15px"
              class="el-icon-delete"
              @click="delRule(index)"
            ></i>
          </el-col>
        </el-row>
        <p>
          <el-button type="text" icon="el-icon-plus" @click="addRule"
            >添加种类</el-button
          >
        </p>
      </el-form-item>
      <el-form-item label="请假须知：" prop="remark" :rules="rules.remark">
        <tinymce ref="editor" v-model="ruleForm.remark"></tinymce>
      </el-form-item>
      <el-form-item style="padding: 20px 0 15px 340px">
        <el-button type="primary" :loading="posting" @click="onSubmit"
          >保存</el-button
        >
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <v-dialog
      width="640px"
      ref="saveFormDialog"
      @handleClose="saveItem"
      title="配置请假单"
    >
      <save-leave-set-form
        :patch-data="currentItem"
        ref="saveItemForm"
        @keyUpSubmit="saveItem"
      ></save-leave-set-form>
    </v-dialog>
    <v-dialog ref="saveDialog" @handleClose="saveItem" title="请假类型">
      <save-leave-type-form
        :patch-data="currentItem"
        ref="saveItemForm"
        @keyUpSubmit="saveItem"
      ></save-leave-type-form>
    </v-dialog>
    <v-dialog ref="saveDialog1" @handleClose="saveRule" title="请假规则">
      <save-leave-rule-form
        :patch-data="currentItem"
        ref="saveItemForm"
        @keyUpSubmit="saveRule"
      ></save-leave-rule-form>
    </v-dialog>
  </div>
</template>

<script>
import basicTable from "_c/tables/";
import tinymce from "_c/tinymce";
import saveLeaveTypeForm from "_c/forms/saveLeaveTypeForm";
import saveLeaveRuleForm from "_c/forms/saveLeaveRuleForm";
import saveLeaveSetForm from "./components/saveLeaveSetForm";

export default {
  components: {
    basicTable,
    tinymce,
    saveLeaveTypeForm,
    saveLeaveRuleForm,
    saveLeaveSetForm,
  },
  data() {
    return {
      posting: false,
      loading: false,
      inputVisible: false,
      typeValue: "",
      currentItem: {},
      dialogTitle: "",
      rules: {
        types: [{ required: true, message: `请输入类型名称`, trigger: "blur" }],
        name: [{ required: true, message: `请输入规则名称`, trigger: "blur" }],
        minDays: [
          {
            type: "number",
            min: 0,
            message: `请输入正确数字`,
            trigger: "blur",
          },
        ],
        maxDays: [
          {
            type: "number",
            min: 0,
            message: `请输入正确数字`,
            trigger: "blur",
          },
          { validator: this.validateMax, trigger: "blur" },
        ],
      },
      ruleForm: {
        remark: "",
        rules: [],
        types: [],
      },
    };
  },
  created() {},
  methods: {
    validateMax(rule, value, callback) {
      const index = rule.field.split(".")[1];
      const min = this.ruleForm.rules[index].min;
      const max = this.ruleForm.rules[index].max;
      if (value) {
        if (min > max) {
          callback(new Error("需要大于最小天数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      const typeValue = this.typeValue;
      if (typeValue) {
        this.ruleForm.types.push({
          typename: typeValue,
        });
      }
      this.inputVisible = false;
      this.typeValue = "";
    },
    delCa(ca, index) {
      this.ruleForm.types.splice(index, 1);
      // let me = this;
      // this.alert("确定删除选中校区？", "删除", {
      //   type: "error",
      //   request() {
      //     return delZsConfig({
      //       codeitemid: ca.codeitemid,
      //     });
      //   },
      //   success() {
      //     me.toast("删除成功", "success");
      //     me.types.splice(index, 1);
      //   },
      // });
    },
    addRule() {
      this.ruleForm.rules.push({
        name: "",
        min: "",
        max: "",
      });
    },
    delRule(index) {
      this.ruleForm.rules.splice(index, 1);
    },
    setItemForm() {},
    openSaveDialog(type) {
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem(item) {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;
        switch (this.currentItem.type) {
          case "1":
            addZsConfig(data)
              .then(() => {
                this.$refs.saveDialog.close();
                me.toast("添加成功", "success");
                me.types.unshift(data);
              })
              .catch((err) => {
                this.$refs.saveDialog.posting = false;
              });
            break;
          case "2":
            addZsConfig(data)
              .then(() => {
                this.$refs.saveDialog.close();
                me.toast("添加成功", "success");
                me.perTypes.unshift(data);
              })
              .catch((err) => {
                this.$refs.saveDialog.posting = false;
              });
            break;
          case "3":
            addZsConfig(data)
              .then(() => {
                this.$refs.saveDialog.close();
                me.toast("添加成功", "success");
                me.attTypes.unshift(data);
              })
              .catch((err) => {
                this.$refs.saveDialog.posting = false;
              });
            break;
          case "4":
            addZsConfigRule(data)
              .then(() => {
                this.$refs.saveDialog.close();
                me.toast("添加成功", "success");
                getZbRuleTypeOptions().then((data1) => {
                  me.oAttTypes = data1;
                  this.dutPlans = [];
                  ruleList({}).then((data) => {
                    for (const da of data.data) {
                      this.dutPlans.push(da);
                    }
                  });
                });
              })
              .catch((err) => {
                this.$refs.saveDialog.posting = false;
              });
            break;
          case "5":
            const oData = {
              subid: data.subid,
              list: data.list,
            };
            addZsConfigRuleDay(oData)
              .then(() => {
                this.$refs.saveDialog.close();
                me.toast("添加成功", "success");
                me.getRuleDayList();
              })
              .catch((err) => {
                this.$refs.saveDialog.posting = false;
              });
            break;
        }
      });
    },
    saveRule() {},

    onSubmit() {
      const me = this;
      this.$refs.ruleForm.validate((data) => {
        this.posting = true;
        addZsConfig(data)
          .then(() => {
            this.posting = false;
            me.toast("设置成功", "success");
          })
          .catch((err) => {
            this.posting = false;
          });
      });
    },
  },
};
</script>

<style lang="scss">
.rule-row {
  .el-row {
    margin-bottom: 15px;
  }
  .el-form-item {
    padding-right: 15px;
    &.is-required {
      padding-left: 5px;
      .el-input {
        position: relative;
        &::before {
          content: "*";
          position: absolute;
          color: #f56c6c;
          left: -10px;
          top: -5px;
        }
      }
    }
  }
  .el-icon-delete {
    cursor: pointer;
  }
}
</style>
