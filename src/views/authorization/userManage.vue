<template>
  <div>
    <div class="tableFiltersWrap">
      <el-row class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="4" class="txt-left">
              <el-button type="primary" @click="fecthData">查询</el-button>
              <el-button type="default" @click="reloadData">清空</el-button>
            </el-col>
          </v-form>
        </el-col>
      </el-row>
    </div>
    <v-page>
      <el-card shadow="never" class="card-header-tabs">
        <div slot="header" class="clearfix">
          <div class="txt-right fn-pr15">
            <v-btn type="add" @handleClick="openSaveDialog"></v-btn>
            <v-btn type="del" @handleClick="del"></v-btn>
            <v-btn type="add" txt="初始化密码" @handleClick="initPass"></v-btn>
          </div>
        </div>
        <div class="text item">
          <basic-table
            ref="basicTable"
            :columns="columns"
            :call-server="callServer"
            @selectionChange="selectionChange"
            :height="height"
            v-model="tableParamsCopy"
          ></basic-table>
        </div>
        <v-dialog
          ref="saveDialog"
          width="600px"
          @handleClose="saveItem"
          :title="isEmptyObject(currentItem) ? '新增用户' : '修改用户'"
        >
          <save-user-form ref="saveItemForm" :patch-data="currentItem"></save-user-form>
        </v-dialog>

        <v-dialog
          ref="dialog"
          width="440px"
          confirmBtnTxt="确认"
          @handleClose="handleInit"
          title="初始化密码"
        >
          <el-form
            :model="form"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="0"
          >
            <el-form-item prop="pwd">
              <div>{{ "初始化用户：" + form.dels + "。" }}</div>
              <el-radio-group v-model="form.radio">
                <el-radio label="0">默认规则</el-radio>
                <el-radio label="1">
                  指定密码
                  <el-input
                    type="password"
                    v-model="form.pwd"
                    size="small"
                    minlength="6"
                    maxlength="20"
                    autocomplete="off"
                    placeholder="请输入密码"
                    style="width: 160px; margin-left: 16px"
                    v-if="form.radio == '1'"
                  />
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </v-dialog>
      </el-card>
    </v-page>
  </div>
</template>

<script>
import { userList, userAdd, userDelete, initPass, changeStatus } from "@/api/userManage";
import { listRole } from "@/api/sysRole";
// import { queryDeptlist } from "#/api/public";
import basicTable from "_c/tables";
import saveUserForm from "./components/saveUserForm";
import { encrypt } from "@/utils/util";

export default {
  components: {
    basicTable,
    saveUserForm,
  },
  created() {
    // queryDeptlist({ pageSize: 1000 }).then((res)=>{
    //   this.deptsListOptions = res.data.map(d => ({ label: d.deptName, value: d.deptId }));
    // });
    listRole({ pageSize: 1000 }).then((res) => {
      this.roleList = res.data.map((d) => ({ label: d.name, value: d.roleid }));
    });
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  data() {
    return {
      deptsListOptions: [],
      roleList: [],
      tableParams: {
        truename: "",
        username: "",
        deptid: "",
        usertype: "",
      },
      multipleSelection: [],
      form: {
        dels: "",
        ids: "",
        radio: "0",
        pwd: "",
      },
      rules: {
        pwd: [
          {
            validator: (rule, value, callback) => {
              const reg = new RegExp(
                /((?=.*[A-Z])|(?=.*[a-z])|(?=.*[0-9])|(?=.*[\W])).{6,20}/
              );
              if (this.form.radio === "1") {
                if (!this.form.pwd) {
                  callback(new Error("请输入密码"));
                  return;
                }
                if (!reg.test(value)) {
                  callback(new Error("密码长度为6-20位，数字或大小写字母或特殊符号！"));
                  return;
                }
              }
              callback();
            },
            trigger: "blur",
          },
        ],
      },
      currentItem: {},
      height: window.innerHeight - 420,
    };
  },
  computed: {
    tableParamsCopy() {
      const params = {};
      if (this.tableParams.username) {
        params.username = this.tableParams.username;
      }
      if (this.tableParams.truename) {
        params.truename = this.tableParams.truename;
      }
      if (this.tableParams.gx) {
        params.gx = this.tableParams.gx;
      }
      if (this.tableParams.qywx) {
        params.qywx = this.tableParams.qywx;
      }
      if (this.tableParams.xb) {
        params.xb = this.tableParams.xb;
      }
      if (this.tableParams.deptid) {
        params.deptid = this.tableParams.deptid;
      }
      if (this.tableParams.zw) {
        params.zw = this.tableParams.zw;
      }
      if (this.tableParams.officeTel) {
        params.officeTel = this.tableParams.officeTel;
      }
      if (this.tableParams.tel) {
        params.tel = this.tableParams.tel;
      }
      if (this.tableParams.qq) {
        params.qq = this.tableParams.qq;
      }
      if (this.tableParams.qq) {
        params.qq = this.tableParams.qq;
      }
      if (this.tableParams.roleid) {
        params.roleid = this.tableParams.roleid;
      }
      if (this.tableParams.tag) {
        params.tag = this.tableParams.tag;
      }
      if (this.tableParams.isvalid || this.tableParams.isvalid == 0) {
        params.isvalid = this.tableParams.isvalid;
      }
      if (this.tableParams.sfjrqywx || this.tableParams.sfjrqywx == 0) {
        params.sfjrqywx = this.tableParams.sfjrqywx;
      }
      if (this.tableParams.createXm) {
        params.createXm = this.tableParams.createXm;
      }
      if (this.tableParams.createTime && this.tableParams.createTime.length == 2) {
        params.beginTime = this.tableParams.createTime[0];
        params.endTime = this.tableParams.createTime[1];
      }
      return params;
    },
    fields() {
      return [
        {
          label: "",
          prop: "username",
          span: 4,
          type: "text",
          placeholder: "请输入账号名",
        },
        {
          label: "",
          prop: "truename",
          span: 4,
          type: "text",
          placeholder: "请输入真实姓名",
        },
        // {
        //   label: "",
        //   prop: "gx",
        //   span: 4,
        //   type: "text",
        //   placeholder: "请输入工号",
        // },
        // {
        //   label: "",
        //   prop: "qywx",
        //   span: 4,
        //   type: "text",
        //   placeholder: "请输入企业微信号",
        // },
        {
          label: "",
          prop: "xb",
          span: 4,
          type: "select",
          placeholder: "请选择性别",
          options: [
            { label: "男", value: "男" },
            { label: "女", value: "女" },
          ],
        },
        // {
        //   label: "",
        //   prop: "deptid",
        //   span: 4,
        //   type: "select",
        //   placeholder: "请选择所属单位",
        //   options: this.deptsListOptions,
        // },
        // {
        //   label: "",
        //   prop: "zw",
        //   span: 4,
        //   type: "text",
        //   placeholder: "请输入职称/职务",
        // },
        // {
        //   label: "",
        //   prop: "officeTel",
        //   span: 4,
        //   type: "text",
        //   placeholder: "请输入办公电话",
        // },
        {
          label: "",
          prop: "tel",
          span: 4,
          type: "text",
          placeholder: "请输入手机号码",
        },
        // {
        //   label: "",
        //   prop: "qq",
        //   span: 4,
        //   type: "text",
        //   placeholder: "请输入QQ号",
        // },
        {
          label: "",
          prop: "roleid",
          span: 4,
          type: "select",
          placeholder: "请选择角色",
          options: this.roleList,
        },
        // {
        //   label: "",
        //   prop: "tag",
        //   span: 4,
        //   type: "text",
        //   placeholder: "请输入标签名称",
        // },
        {
          label: "",
          prop: "isvalid",
          span: 4,
          type: "select",
          placeholder: "请选择用户状态",
          options: [
            { label: "禁用", value: 0 },
            { label: "启用", value: 1 },
          ],
        },
        {
          label: "",
          prop: "createXm",
          span: 4,
          type: "text",
          placeholder: "请输入创建人",
        },
        {
          label: "",
          prop: "createTime",
          span: 8,
          type: "daterange",
          sPlaceholder: "创建开始时间",
          ePlaceholder: "创建结束时间",
        },
      ];
    },
    columns() {
      return [
        {
          label: "用户编号",
          prop: "userid",
        },
        {
          label: "账号名",
          prop: "username",
        },
        {
          label: "真实姓名",
          prop: "truename",
        },
        // {
        //   label: "工号",
        //   prop: "gx",
        //   width: 120
        // },
        // {
        //   label: "是否已加入企微",
        //   width: 120,
        //   prop: "sfjrqywx"
        // },
        // {
        //   label: "企业微信号",
        //   prop: "qywx",
        //   width: 120,
        //   render: (h, row) => {
        //     return <div>{ row.qywx || '-' }</div>;
        //   },
        // },
        {
          label: "性别",
          prop: "xb",
        },
        // {
        //   label: "所属单位",
        //   prop: "deptName",
        //   width: 120,
        // },
        // {
        //   label: "职称/职务",
        //   prop: "zw",
        //   width: 120,
        // },
        // {
        //   label: "办公电话",
        //   prop: "officeTel",
        //   width: 120,
        // },
        {
          label: "手机号码",
          prop: "tel",
        },
        // {
        //   label: "QQ号",
        //   prop: "qq",
        //   width: 120,
        // },
        {
          label: "角色名称",
          prop: "roleListName",
          render: (h, row) => {
            return (
              <div>{row.roleList && row.roleList.map((r) => r.roleName).toString()}</div>
            );
          },
        },
        // {
        //   label: "标签",
        //   prop: "tag",
        //   width: 120,
        // },
        {
          label: "用户状态",
          render: (h, row) => {
            return (
              <div>
                <el-switch
                  value={row.isvalid}
                  active-value={1}
                  inactive-value={0}
                  on-change={(e) => {
                    this.changeStatus(row);
                  }}
                ></el-switch>
              </div>
            );
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: 180,
        },
        {
          label: "创建人",
          prop: "createXm",
          width: 120,
        },
        {
          label: "操作",
          fixed: "right",
          width: 120,
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.openSaveDialog(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.del(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  删除
                </el-button>
              </div>
            );
          },
        },
      ];
    },
  },
  methods: {
    handleResize() {
      this.height = window.innerHeight - 420;
    },
    callServer(pagination) {
      return userList;
    },
    fecthData() {
      this.$refs.basicTable.fecthData();
    },
    reloadData() {
      this.tableParams = {};
      this.$refs.basicTable.reload();
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    handleNodeClick(node) {
      if (node.children) {
        this.currentNode = node;
        this.fecthData(node.id);
      }
    },
    changeStatus(row) {
      changeStatus({ id: row.userid, status: row.isvalid == 0 ? 1 : 0 }).then((res) => {
        this.toast("更改状态成功", "success");
        row.isvalid = row.isvalid == 0 ? 1 : 0;
      });
    },
    openSaveDialog(item) {
      this.currentItem = item || {};
      this.currentItem.deptname =
        this.currentItem.deptname || this.currentItem.deptName || "";
      if (this.currentItem.roleList && this.currentItem.roleList.length) {
        this.currentItem.roleId = this.currentItem.roleList.map((r) => r.roleid);
      }
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      this.$refs.saveItemForm.validate((data) => {
        this.$refs.saveDialog.posting = true;

        if (data.roleId && data.roleId.length) {
          data.roleList = [{ roleid: data.roleId }];
          data.roleList = data.roleId.map((r) => ({ roleid: r }));
        }
        if (this.$refs.saveItemForm.status) {
          userAdd(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("修改成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        } else {
          userAdd(data)
            .then(() => {
              this.$refs.saveDialog.close();
              me.toast("添加成功", "success");
              me.fecthData();
            })
            .catch((err) => {
              this.$refs.saveDialog.posting = false;
            });
        }
      });
    },
    del(item) {
      const me = this;
      const dels = [];
      const ids = [];
      if (item) {
        dels.push(item.truename);
        ids.push(item.userid);
      } else {
        if (!this.multipleSelection.length) {
          this.toast("请选择至少一条数据", "warning");
          return;
        }
        for (const ml of this.multipleSelection) {
          dels.push(ml.truename);
          ids.push(ml.userid);
        }
      }
      this.alert("删除用户：" + dels.join(",") + "。", "确认要进行删除吗？", {
        type: "warning",
        request() {
          return userDelete(ids.join(","));
        },
        success() {
          me.toast("删除成功", "success");
          me.fecthData();
        },
      });
    },
    initPass(item) {
      const dels = [];
      const ids = [];
      if (item) {
        dels.push(item.truename);
        ids.push(item.userid);
      } else {
        if (!this.multipleSelection.length) {
          this.toast("请选择至少一条数据", "warning");
          return;
        }
        for (const ml of this.multipleSelection) {
          dels.push(ml.truename);
          ids.push(ml.userid);
        }
      }
      Object.assign(this.form, { dels: dels.join(","), ids: ids.join(",") });
      this.$refs.dialog.dialogVisible = true;
      // this.alert(
      //   "初始化用户：" + dels.join(",") + "。",
      //   "确认要进行初始化吗？",
      //   {
      //     type: "warning",
      //     request() {
      //       return initPass(ids.join(","));
      //     },
      //     success() {
      //       me.toast("初始化成功", "success");
      //     },
      //   }
      // );
    },
    handleInit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$refs.dialog.posting = true;
          initPass(
            this.form.ids,
            this.form.radio == "1" ? encrypt(this.form.pwd) : undefined
          )
            .then((res) => {
              this.$refs.dialog.posting = false;
              if (res.code == 200) {
                this.$message.success("初始化成功");
                this.$refs.dialog.dialogVisible = false;
                this.$refs.ruleForm.resetFields();
              } else {
                this.$message.warning(res.msg);
              }
            })
            .catch((err) => {
              this.$refs.dialog.posting = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
