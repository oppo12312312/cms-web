<template>
  <div>
    <div class="header">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 48px;
        "
      >
        <div @click="$emit('back')" class="title">
          <i
            class="el-icon-back"
            style="font-size: 22px; cursor: pointer; margin-right: 12px"
          ></i
          >分配用户
        </div>
      </div>
    </div>
    <div class="tableFiltersWrap">
      <el-row class="txt-right">
        <el-col>
          <v-form :fields="fields" :fieldsData="tableParams">
            <el-col :span="6" class="txt-left">
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
            <v-btn
              type="add"
              @handleClick="openSaveDialog"
              txt="添加授权"
            ></v-btn>
            <v-btn type="del" @handleClick="del" txt="批量取消授权"></v-btn>
          </div>
        </div>
        <div class="text item">
          <basic-table
            ref="basicTable"
            :columns="columns"
            :call-server="callServer"
            @selectionChange="selectionChange"
            v-model="tableParamsCopy"
          ></basic-table>
        </div>
      </el-card>
    </v-page>

    <v-dialog
      ref="saveDialog"
      width="840px"
      @handleClose="saveItem"
      title="添加授权"
    >
      <save-role-user-form
        ref="saveItemForm"
        :patch-data="info"
      ></save-role-user-form>
    </v-dialog>
  </div>
</template>

<script>
import basicTable from "_c/tables";
import { userList } from "@/api/userManage";
import { queryDeptlist } from "#/api/public";
import { roleGrantedUserList, deleteRoleUsers } from "@/api/roleManage";
import saveRoleUserForm from "_c/forms/saveRoleUserForm";

export default {
  props: {
    info: Object,
  },
  components: {
    basicTable,
    saveRoleUserForm,
  },
  created() {
    queryDeptlist({ level: 3, pageSize: 1000, pageIndex: 1 }).then((res) => {
      this.deptOpts = res.data.map((d) => ({
        label: d.deptName,
        value: d.deptId,
      }));
    });
  },
  data() {
    return {
      deptOpts: [],
      tableParams: {},
    };
  },
  computed: {
    tableParamsCopy() {
      return Object.assign({ roleid: this.info.roleid }, this.tableParams);
    },
    fields() {
      return [
        {
          label: "",
          prop: "truename",
          span: 4,
          type: "text",
          placeholder: "请输入姓名",
        },
        {
          label: "",
          prop: "username",
          span: 4,
          type: "text",
          placeholder: "请输入用户名",
        },
        // {
        //   label: "",
        //   prop: "deptid",
        //   span: 4,
        //   type: "select",
        //   placeholder: "请选择部门",
        //   options: this.deptOpts,
        // }
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
        //   prop: "qywx",
        //   render: (h, row) => {
        //     return <div>{ row.qywx ? '是' : '否' }</div>;
        //   },
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
        // {
        //   label: "角色名称",
        //   prop: "roleListName",
        // },
        // {
        //   label: "标签",
        //   prop: "tag",
        //   width: 120,
        // },
        // {
        //   label: "用户状态",
        //   prop: "yhzt"
        // },
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
          width: 90,
          render: (h, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.del(row)}
                  size="middle"
                  class="txt-highlight"
                >
                  取消授权
                </el-button>
              </div>
            );
          },
        },
      ];
    },
  },
  methods: {
    callServer() {
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
    openSaveDialog(item) {
      this.$refs.saveDialog.dialogVisible = true;
    },
    saveItem() {
      const me = this;
      if (this.$refs.saveItemForm.multipleSelection.length) {
        this.$refs.saveDialog.posting = true;
        const ids = [];
        for (const ml of this.$refs.saveItemForm.multipleSelection) {
          ids.push(ml.userid);
        }
        roleGrantedUserList({
          roleid: me.info.roleid,
          userids: ids.join(","),
        }).then((data) => {
          me.toast("操作成功", "success");
          this.$refs.saveDialog.posting = false;
          this.$refs.saveDialog.close();
          me.fecthData();
        });
      } else {
        this.toast("请选择用户", "warning");
      }
    },
    del(item) {
      const me = this;
      const dels = [];
      const ids = [];
      if (item) {
        dels.push(item.truename);
        ids.push(item.userid);
      } else {
        if (this.multipleSelection.length) {
          for (const ml of this.multipleSelection) {
            dels.push(ml.truename);
            ids.push(ml.userid);
          }
        }
      }
      this.alert(
        "用户取消授权：" + dels.join(",") + "。",
        "确认要进行取消授权吗？",
        {
          type: "warning",
          request() {
            return deleteRoleUsers({
              roleid: me.info.roleid,
              userids: ids.join(","),
            });
          },
          success() {
            me.toast("取消授权成功", "success");
            me.fecthData();
          },
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 0px 16px 0 16px;
  background: #fff;
  .title {
    display: flex;
    align-items: center;
    font-size: 18px;
  }
}
</style>
