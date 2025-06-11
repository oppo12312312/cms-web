<template>
  <v-page>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>选择入住学生</span>
      </div>
      <div>
        <div v-show="step == '1'" style="width: 500px">
          <v-form
            :label-width="150"
            ref="ruleForm"
            :fields="fields"
            :fieldsData="ruleForm"
          ></v-form>
          <div style="text-align: center">
            <el-button type="primary" :loading="posting" @click="nextStep"
              >下一步</el-button
            >
          </div>
        </div>
        <div v-show="step == '2'">
          <student-info
            ref="studentInfo"
            :patch-data="studentInfo"
          ></student-info>
          <v-form
            v-if="currentItem.xh"
            :label-width="150"
            ref="ruleForm1"
            :fields="fields1"
            :fieldsData="ruleForm1"
          ></v-form>
          <div style="text-align: center">
            <el-button type="primary" :loading="posting1" @click="onSubmit"
              >提交</el-button
            >
            <el-button @click="preStep">取消</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </v-page>
</template>

<script>
import { getStdInfo, rangeStd } from "@/projects/hbmu-suguan/api/sgAptRange";
import studentInfo from "../components/studentInfo.vue";
import { mapGetters, mapActions } from "vuex";
import basicTable from "_c/tables";
import { getStdScopeTree } from "@/projects/hbmu-suguan/api/sgAptRange";

export default {
  components: {
    basicTable,
    studentInfo,
  },
  created() {},
  data() {
    return {
      ruleForm: {
        xh: "",
        zjhm: "",
        rangeByDeptScope: "yes",
      },
      ruleForm1: {
        roomId: "",
      },
      posting: false,
      posting1: false,
      step: "1",
      currentItem: {},
      studentInfo: {},
    };
  },
  computed: {
    fields() {
      const me = this;
      return [
        {
          label: "学号：",
          prop: "xh",
          type: "text",
          placeholder: "请输入学号",
          rule: [
            {
              required: true,
              message: "请输入学号",
              trigger: "blur",
            },
          ],
        },
        {
          label: "证件号码：",
          prop: "zjhm",
          type: "text",
          placeholder: "请输入证件号码",
        },
        {
          label: "按院系范围划分：",
          prop: "rangeByDeptScope",
          type: "radio",
          options: [
            {
              label: "是",
              value: "yes",
            },
            {
              label: "否",
              value: "no",
            },
          ],
        },
      ];
    },
    fields1() {
      const me = this;
      return [
        {
          label: "选择房间：",
          prop: "roomId",
          type: "tree",
          placeholder: "请选择房间",
          nodeKey: "aptId",
          expandedKeys: ["node0"],
          defaultProps: {
            label: "aptName",
            value: "aptId",
            children: "children",
            isLeaf: "isLeaf",
            chooseLeaf: true,
            msg: "请选择房间",
          },
          loadNode: function (node, resolve) {
            // 一级节点处理
            if (node.level === 0) {
              getStdScopeTree({
                aptId: "",
                aptLevel: "",
                xh: me.currentItem.xh,
                rangeByDeptScope: me.currentItem.rangeByDeptScope,
              }).then((leafs) => {
                const data = leafs.data;
                return resolve([
                  {
                    aptName: data[0].aptName,
                    aptId: "node0",
                    aptLevel: data[0].aptLevel,
                    isLeaf: false,
                  },
                ]);
              });
            }
            if (node.level >= 1) resolve([]);
            if (node.data) {
              getStdScopeTree({
                aptId: node.key == "node0" ? "" : node.key,
                aptLevel: node.data.aptLevel,
                xh: me.currentItem.xh,
                rangeByDeptScope: me.currentItem.rangeByDeptScope,
              }).then((leafs) => {
                const data = leafs.data;
                const arr = [];
                for (let i = 0; i < data.length; i++) {
                  if (data[i].aptLevel == "room") {
                    if (
                      me.currentItem.defaultRooms.indexOf(data[i].aptId) > -1
                    ) {
                      arr.push({
                        aptName: data[i].aptName,
                        aptId: data[i].aptId,
                        aptLevel: data[i].aptLevel,
                        isLeaf: true,
                      });
                    }
                  } else {
                    arr.push({
                      aptName: data[i].aptName,
                      aptId: data[i].aptId,
                      aptLevel: data[i].aptLevel,
                      isLeaf: data[i].aptLevel == "room" ? true : false,
                    });
                  }
                }
                return resolve(arr);
              });
            }
          },
        },
      ];
    },
  },
  methods: {
    preStep() {
      this.step = "1";
    },
    nextStep() {
      this.posting = true;
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          getStdInfo(this.ruleForm)
            .then((data) => {
              this.step = "2";
              this.currentItem.xh = this.ruleForm.xh;
              this.currentItem.zjhm = this.ruleForm.zjhm;
              this.currentItem.rangeByDeptScope =
                this.ruleForm.rangeByDeptScope;
              this.currentItem.defaultRooms = [];
              if (data.data.rooms.length) {
                for (let i = 0; i < data.data.rooms.length; i++) {
                  this.currentItem.defaultRooms.push(data.data.rooms[i].roomId);
                }
              }
              this.ruleForm.defaultBed;
              this.studentInfo = data.data.stdInfo;
              this.posting = false;
            })
            .catch((err) => {
              this.posting = false;
            });
        }
      });
    },
    onSubmit() {
      this.posting1 = true;
      if (this.ruleForm1.roomId) {
        rangeStd({
          xh: this.currentItem.xh,
          roomId: this.ruleForm1.roomId,
          rangeByDeptScope: this.currentItem.rangeByDeptScope,
        })
          .then((data) => {
            this.toast("分配成功", "success");
            this.posting1 = false;
            this.step = "1";
            this.ruleForm.xh = "";
            this.ruleForm.zjhm = "";
            this.ruleForm.rangeByDeptScope = "yes";
          })
          .catch((err) => {
            this.posting1 = false;
          });
      } else {
        this.toast("请选择房间", "success");
      }
    },
  },
};
</script>
