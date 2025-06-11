<template>
  <el-form
    size="medium"
    :model="ruleForm"
    status-icon
    ref="ruleForm"
    :rules="rules"
    label-width="auto"
  >
    <el-row class="set-form" :gutter="15">
      <el-col :span="12">
        <el-form-item label="姓名："> {{ student.xm }} </el-form-item>
        <el-form-item label="性别：">
          {{ student.xb || "暂无" }}
        </el-form-item>
        <el-form-item label="年级：">
          {{ student.nj || "暂无" }}
        </el-form-item>
        <el-form-item label="联系电话：" prop="lxdh">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.lxdh"
            autocomplete="off"
            placeholder="请输入"
            v-if="isPatch"
          ></el-input>
          <span v-else>{{ patchData.lxdh || "暂无" }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="学号：">
          {{ student.xh }}
        </el-form-item>
        <el-form-item :label="lang_college + '：'">
          {{ student.xy || "暂无" }}
        </el-form-item>
        <el-form-item label="班级：">
          {{ student.bjmc || "暂无" }}
        </el-form-item>
        <el-form-item label="请假类型：" prop="qjlx">
          <el-select
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.qjlx"
            autocomplete="off"
            placeholder="请选择请假类型"
            v-if="isPatch"
          >
            <el-option
              v-for="lx in lxOpts"
              :key="lx.value"
              :label="lx.label"
              :value="lx.label"
            ></el-option>
          </el-select>
          <span v-else>{{ patchData.qjlx }}</span>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="请假时间：" prop="dateTime">
          <el-row v-if="isPatch">
            <el-col :span="16"
              ><el-date-picker
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm"
                v-model="ruleForm.dateTime"
              >
              </el-date-picker
            ></el-col>
            <el-col :span="8" class="fn-pl10"
              >共{{ ruleForm.qjts ? ruleForm.qjts : "N" }}天</el-col
            >
          </el-row>
          <span v-else>{{
            dateTimeRangeFormate(patchData.qssj, patchData.zzsj)
          }}</span>
        </el-form-item>
        <el-form-item label="请假理由：" prop="qjyy">
          <el-input
            type="textarea"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.qjyy"
            autocomplete="off"
            placeholder="请输入"
            v-if="isPatch"
          ></el-input>
          <span v-else>{{ patchData.qjyy }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="紧急联系人：" prop="lxr">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.lxr"
            autocomplete="off"
            placeholder="请输入"
            v-if="isPatch"
          ></el-input>
          <span v-else>{{ patchData.lxr || "暂无" }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="紧急联系电话：" prop="lxrdh">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.lxrdh"
            autocomplete="off"
            placeholder="请输入"
            v-if="isPatch"
          ></el-input>
          <span v-else>{{ patchData.lxrdh || "暂无" }}</span>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="寝室信息：" prop="qsinfo">
          <el-input
            type="text"
            @keyup.enter.native="keyUpSubmit"
            v-model="ruleForm.qsinfo"
            autocomplete="off"
            placeholder="请输入"
            v-if="isPatch"
          ></el-input>
          <span v-else>{{ patchData.qsinfo || "暂无" }}</span>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="附件：" prop="files">
          <div v-if="isPatch">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="asdas"
              :on-change="onChangeFile"
              :on-remove="handleRemove"
              :file-list="ruleForm.files"
              :auto-upload="false"
            >
              <el-button icon="el-icon-upload" type="primary">上传</el-button>
            </el-upload>
            <div v-if="fileInfo.length">
              <h4>已上传文件</h4>
              <file-list
                ref="fileList"
                style="margin-top: -10px"
                :operate="true"
                :props-files="fileInfo"
                @del="delFile"
              ></file-list>
            </div>
          </div>
          <div v-else>
            <file-list
              v-if="patchData.fileInfo.length"
              :props-files="patchData.fileInfo"
            ></file-list>
            <span v-else>暂无</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="请假承诺：" prop="xm">
          本人已阅读了学校有官学生请假的管理制度，履行了规定的请假手续。本着对自己负责的态度，现郑重承诺：一、本人请假期间，遵守各项国家法律法规和学校各项规定，注意个人人身及财产安全，交通安全。在请假期间的一切安全责任由本人自负。二、本人及时汇报自己请假期间的居住地址，电话号码，保持通讯畅通，以便联系，如联系不上，所产生的的后果由本人承担。
        </el-form-item>
      </el-col>
    </el-row>
    <approve-track
      v-if="!isPatch"
      :defid="patchData.defid"
      :businessid="patchData.applyid"
    ></approve-track>
  </el-form>
</template>
<script>
import { queryStudentInfo } from "@/api/common";
import { getCodeOptions } from "@/filters/options";
import formMinxin from "_c/forms/minxins/formMinxin.js";
import fileList from "_c/fileList";
import approveTrack from "_c/approveTrack";
import { delFile } from "@/api/file";
export default {
  mixins: [formMinxin],
  components: {
    fileList,
    approveTrack,
  },
  props: {
    patchData: Object,
  },
  data() {
    return {
      student: {},
      ruleForm: {
        applyid: "",
        lxdh: "",
        qjlx: "",
        dateTime: "",
        qssj: "",
        zzsj: "",
        qjts: "",
        qjyy: "",
        lxr: "",
        lxrdh: "",
        qsinfo: "",
        files: [],
        xh: "",
        xm: "",
        xy: "",
        bjmc: "",
      },
      lxOpts: [],
      rules: {
        qjlx: [{ required: true, message: `请选择请假类型`, trigger: "blur" }],
        dateTime: [
          { required: true, message: `请选择请假时间`, trigger: "blur" },
        ],
        qjyy: [
          { required: true, message: `请选输入请假原因`, trigger: "blur" },
        ],
      },
      steps: [],
    };
  },
  computed: {
    isPatch() {
      return !this.patchData.applyid || this.patchData.isPatch;
    },
    fileInfo() {
      return this.patchData.fileInfo || [];
    },
  },
  created() {
    queryStudentInfo().then((data) => {
      this.student = data.data;
      this.init(this.patchData);

      this.ruleForm.lxdh = data.data.lxdh || "";
      this.ruleForm.xh = data.data.xh;
      this.ruleForm.xm = data.data.xm;
      this.ruleForm.xy = data.data.xy;
      this.ruleForm.bjmc = data.data.bjmc;
    });
    getCodeOptions("90003", true).then((data) => {
      this.lxOpts = data;
    });
  },
  watch: {
    patchData: function () {
      this.init(this.patchData);
    },
    "ruleForm.dateTime": function (val) {
      this.ruleForm.qssj = this.$filters.parseTime(
        val[0],
        "{y}-{m}-{d} {h}:{i}:{s}"
      );
      this.ruleForm.zzsj = this.$filters.parseTime(
        val[1],
        "{y}-{m}-{d} {h}:{i}:{s}"
      );
      this.ruleForm.qjts = parseFloat(
        this.$filters.secToDay(Date.parse(val[1]) - Date.parse(val[0]))
      );
    },
  },
  methods: {
    init() {
      this.initForm(this.patchData);
      this.ruleForm.dateTime = [this.patchData.qssj, this.patchData.zzsj];
    },
    onChangeFile(file, files) {
      this.ruleForm.files = files;
    },
    handleRemove(file, files) {
      this.ruleForm.files = files;
    },
    delFile(fileObj) {
      delFile({
        fileId: fileObj.file.fileId,
      }).then((data) => {
        this.$refs.fileList.$forceUpdate();
        this.fileInfo.splice(fileObj.index, 1);
      });
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
