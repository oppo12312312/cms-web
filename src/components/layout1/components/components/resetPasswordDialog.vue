<template>
  <v-dialog
    ref="saveDialog"
    width="620px"
    @handleClose="saveItem"
    title="修改密码"
  >
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
    >
      <el-form-item label="旧密码：" prop="oldPass" required>
        <el-input
          type="password"
          v-model="ruleForm.oldPass"
          minlength="6"
          maxlength="20"
          autocomplete="off"
          placeholder="输入旧密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPass" required>
        <el-input
          type="password"
          v-model="ruleForm.newPass"
          minlength="6"
          maxlength="20"
          autocomplete="off"
          placeholder="新密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirmPass" required>
        <el-input
          type="password"
          v-model="ruleForm.confirmPass"
          minlength="6"
          maxlength="20"
          autocomplete="off"
          placeholder="确认密码"
        ></el-input>
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import { editPass } from "@/api/userManage";
import { encrypt } from "@/utils/util";
export default {
  data() {
    return {
      ruleForm: {
        oldPass: "",
        newPass: "",
        confirmPass: "",
      },
      rules: {
        oldPass: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入旧密码"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
          { required: true, message: "请输入旧密码", trigger: "change" },
        ],
        newPass: [
          {
            validator: (rule, value, callback) => {
              // let reg = new RegExp(/((?=.*[A-Z])|(?=.*[a-z])|(?=.*[0-9])|(?=.*[\W])).{6,20}/)
              const reg =
                /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_]+$)(?![a-z0-9]+$)(?![a-z\\W_]+$)(?![0-9\\W_]+$)[a-zA-Z0-9\\W_]{8,}$/;

              if (value === "") {
                callback(new Error("请输入新密码"));
              } else if (!reg.test(value)) {
                callback(
                  new Error(
                    "长度不小于8位，必须为大写字母、小写字母、数字、特殊字符中3种及以上的组合!"
                  )
                );
              } else {
                if (this.ruleForm.confirmPass !== "") {
                  this.$refs.ruleForm.validateField("confirmPass");
                }
                callback();
              }
            },
            trigger: "blur",
          },
          { required: true, message: "请输入新密码", trigger: "change" },
        ],
        confirmPass: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.ruleForm.newPass) {
                callback(new Error("两次输入密码不一致!"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
          { required: true, message: "请再次输入密码", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    init() {
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$refs.saveDialog.posting = true;
          editPass({
            oldPass: encrypt(this.ruleForm.oldPass),
            newPass: encrypt(this.ruleForm.newPass),
            confirmPass: encrypt(this.ruleForm.confirmPass),
          })
            .then((res) => {
              this.$refs.saveDialog.posting = false;
              if (res.code == 200) {
                this.$message.success("修改成功");
                this.$refs.saveDialog.dialogVisible = false;
                this.$refs.ruleForm.resetFields();
              } else {
                this.$message.warning(res.msg);
              }
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
