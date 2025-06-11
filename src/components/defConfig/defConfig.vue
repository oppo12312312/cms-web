<template>
  <v-page>
    <div class="page-content">
      <el-form
        size="medium"
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="auto"
        class="step-form"
      >
        <el-steps direction="vertical" :active="ruleForm.stepList.length + 1">
          <el-step
            v-for="(pro, index) in ruleForm.stepList"
            :key="index"
            title=""
            icon=""
          >
            <template #icon>
              {{ index + 1 }}
            </template>
            <template #title class="stepList-title">
              <el-form-item
                class="step-item"
                label="环节名称："
                :props="'stepList.' + index + '.stepname'"
              >
                <el-input
                  type="text"
                  placeholder="请输入环节名称"
                  autocomplete="off"
                  v-model="pro.stepname"
                  :rules="rules.stepname"
                ></el-input>
                <i class="el-icon-delete" @click="delProcess(index)"></i>
              </el-form-item>
              <el-form-item
                label="环节角色："
                :props="'stepList.' + index + '.shjsid'"
              >
                <span>
                  {{ pro.shjsmc }}
                </span>
                <span class="user-settings-wrap" @click="chooseRole(index)">
                  <img
                    src="@p/static/imgs/svg/riLine-user-settings-line.svg"
                    style="width: 18px; max-width: 240px"
                  />
                </span>

                <el-input
                  type="hidden"
                  placeholder="请选择环节角色"
                  autocomplete="off"
                  v-model="pro.shjsid"
                ></el-input>
              </el-form-item>
            </template>
          </el-step>
          <el-step title="" icon="" class="add-step">
            <template #icon>
              <i @click="addStep" class="el-icon-plus cursorPoint"> </i>
            </template>
          </el-step>
        </el-steps>
        <el-form-item style="text-align: center; margin-top: 20px">
          <el-button type="primary" :loading="posting" @click="onSubmit"
            >保存</el-button
          >
          <el-button @click="reset">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <v-dialog
      ref="roleDialog"
      width="600px"
      @handleClose="saveRole"
      title="选择角色"
    >
      <role-tree :is-radio="true" ref="roleTree"></role-tree>
    </v-dialog>
  </v-page>
</template>

<script>
import basicTable from "_c/tables/";
import roleTree from "@/views/authorization/components/roleTree";
import { getFlow, updateFlow } from "@/api/process";

export default {
  components: {
    basicTable,
    roleTree,
  },
  props: {
    defid: String,
    module: String,
  },
  data() {
    return {
      posting: false,
      currentIndex: "",
      originSteps: [],
      rules: {
        stepname: [
          { required: true, message: `请输入环节名称`, trigger: "blur" },
        ],
      },
      ruleForm: {
        defid: "",
        mc: "",
        subsystem: "",
        stepList: [
          {
            stepid: "",
            stepname: "",
            role: "",
            defid: "leavedef",
            shjsid: "",
            shjsmc: "",
          },
        ],
      },
    };
  },
  created() {
    this.getSteps();
  },
  methods: {
    getSteps() {
      getFlow(this.module).then((data) => {
        this.originSteps = this.copy(data.data.stepList);
        this.ruleForm.stepList = data.data.stepList;
        this.ruleForm.defid = data.data.defid;
        this.ruleForm.mc = data.data.mc;
        this.ruleForm.subsystem = data.data.subsystem;
      });
    },
    addStep() {
      this.ruleForm.stepList.push({
        stepname: "",
        role: "",
        icon: "el-icon-circle-plus-outline",
        detail: {},
      });
    },
    delProcess(index) {
      if (this.ruleForm.stepList.length > 1) {
        this.ruleForm.stepList.splice(index, 1);
      } else {
        this.toast("至少保留一条", "warning");
      }
    },
    chooseRole(index) {
      this.currentIndex = index;
      this.$refs.roleDialog.dialogVisible = true;
    },
    saveRole() {
      const checkedNodes = this.$refs.roleTree.getRadioCheckedNodes();
      if (checkedNodes) {
        this.$refs.roleDialog.close();
        const ids = checkedNodes.data.roleid;
        const names = checkedNodes.data.name;
        this.$set(this.ruleForm.stepList[this.currentIndex], "shjsid", ids);
        this.$set(this.ruleForm.stepList[this.currentIndex], "shjsmc", names);
      } else {
        this.toast("请选择一个角色", "warning");
      }
    },
    reset() {
      this.ruleForm.stepList = this.originSteps;
    },
    onSubmit() {
      const me = this;
      this.$refs.ruleForm.validate((data) => {
        this.posting = true;
        updateFlow(this.ruleForm)
          .then(() => {
            this.posting = false;
            me.toast("保存成功", "success");
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
.step-form {
  padding: 20px 60px;
  width: 600px;
  .el-step__main {
    .el-step__title {
      background: #f4f5f8;
      padding: 20px 40px 0 20px;
    }
  }
}
.step-item {
  position: relative;

  .el-icon-delete {
    position: absolute;
    cursor: pointer;
    right: -30px;
    top: 10px;
  }
}
.add-step {
  .el-step__title {
    padding: 0 !important;
  }
}
.user-settings-wrap {
  display: inline-block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  text-align: center;
  cursor: pointer;
  img {
    vertical-align: middle;
  }
}
.el-step__icon-inner {
  font-style: normal;
}
</style>
