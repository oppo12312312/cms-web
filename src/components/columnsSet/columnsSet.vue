<template>
  <div>
    <el-row v-if="comStatus == 2">
      <el-row :gutter="15">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="0"
        >
          <el-col :span="5">
            <el-form-item prop="name">
              <el-input
                type="text"
                placeholder="请输入文件名"
                @keyup.enter.native="keyUpSubmit"
                v-model="ruleForm.name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="status">
              <el-select
                v-model="ruleForm.temType"
                @change="changeTemType"
                placeholder="选择模板"
              >
                <el-option
                  v-for="md in moldList"
                  :key="md.moldid"
                  :label="md.moldname"
                  :value="md.moldid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
        <el-col :span="14" class="txt-right">
          <el-button type="primary" v-show="!showTem" @click="switchSaveTem()"
            >保存模板</el-button
          >
          <el-row v-show="showTem">
            <el-col :span="18">
              <el-form
                :model="temForm"
                status-icon
                :rules="temRules"
                ref="temForm"
              >
                <el-col :span="12">
                  <el-form-item prop="name">
                    <el-input
                      type="text"
                      placeholder="请输入模板名"
                      @keyup.enter.native="keyUpSubmit"
                      v-model="temForm.name"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="moldtype">
                    <el-radio-group v-model="temForm.moldtype">
                      <el-radio label="公有" name="moldtype"></el-radio>
                      <el-radio label="私有" name="moldtype"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>

            <el-col :span="6" class="txt-right">
              <el-button type="primary" @click="saveTem()">保存</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
    <transfer
      left-title="未选择字段"
      right-title="已选择字段"
      :origin-data="originData"
      label="columncn"
      :checked-data="checkedArr"
      v-model="checkedArr"
    ></transfer>
  </div>
</template>
<script>
import transfer from "_c/transfer";
import { saveMold, getMoldList, moldColumns } from "@/api/excel";

export default {
  props: {
    allColumns: Array,
    selectedColumns: Array,
    comStatus: {
      default: 1,
    },
    tableid: String,
  },
  components: {
    transfer,
  },
  data() {
    return {
      showTem: false,
      originData: [],
      checkedArr: [],
      moldList: [],
      ruleForm: {
        name: "excel",
      },
      rules: {
        name: {
          required: true,
          message: `请输入名称`,
          trigger: "blur",
        },
      },
      temRules: {
        name: {
          required: true,
          message: `请输入名称`,
          trigger: "blur",
        },
      },
      temForm: {
        name: "",
        moldtype: "私有",
      },
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    selectedColumns: function (val) {
      this.checkedArr = this.getChecked(this.selectedColumns);
    },
    allColumns: function (val) {
      this.originData = val;
    },
  },
  methods: {
    fetchData() {
      this.originData = this.allColumns;
      if (this.comStatus == 1) {
        this.checkedArr = this.getChecked(this.selectedColumns);
      }
      if (this.comStatus == 2) {
        this.getMoldList();
      }
    },
    getMoldList() {
      getMoldList(this.tableid).then((data) => {
        this.moldList = data.data;
      });
    },
    changeTemType(val) {
      moldColumns(val).then((data) => {
        this.checkedArr = [];
        for (const col of data.data.selectedColumns) {
          this.checkedArr.push(col.id);
        }
      });
    },
    getCheckedArr(cb) {
      if (this.comStatus == 1) {
        if (this.checkedArr.length) {
          return this.checkedArr;
        } else {
          this.toast("请选择字段", "warning");
        }
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let nArr = [];
            for (let i = 0; i < this.checkedArr.length; i++) {
              const nItem = this.allColumns.filter((item) => {
                return this.checkedArr[i] == item.id;
              });
              nArr = nArr.concat(nItem);
            }
            const columnObj = { columns: nArr, name: this.ruleForm.name };
            cb(columnObj);
          } else {
            return false;
          }
        });
      }
    },
    getChecked(arr) {
      const nArr = [];
      for (let i = 0; i < arr.length; i++) {
        nArr.push(arr[i].id);
      }
      return nArr;
    },
    switchSaveTem() {
      this.showTem = !this.showTem;
    },
    saveTem() {
      if (this.checkedArr.length) {
        this.$refs.temForm.validate((valid) => {
          if (valid) {
            saveMold({
              moldname: this.temForm.name,
              moldtype: this.temForm.moldtype,
              tableid: this.tableid,
              columns: this.checkedArr,
            }).then((data) => {
              this.toast("保存成功", "success");
              this.temForm.name = "";
              this.showTem = false;
              this.getMoldList();
            });
          } else {
            return false;
          }
        });
      } else {
        this.toast("至少选择一条", "warning");
      }
    },
  },
};
</script>
