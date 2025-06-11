<template>
  <el-form size="medium" label-width="auto">
    <el-row class="set-form">
      <el-col :span="12">
        <el-form-item label="姓名："> {{ student.xm }} </el-form-item>
        <el-form-item label="性别：">
          {{ student.xb || "暂无" }}
        </el-form-item>
        <el-form-item label="年级：">
          {{ student.nj || "暂无" }}
        </el-form-item>
        <el-form-item label="联系电话：" prop="lxdh">
          {{ patchData.lxdh || "暂无" }}
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
          {{ patchData.qjlx }}
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="请假时间：" prop="dateTime">
          {{ dateTimeRangeFormate(patchData.qssj, patchData.zzsj) }}
        </el-form-item>
        <el-form-item label="请假理由：" prop="qjyy">
          {{ patchData.qjyy }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="紧急联系人：" prop="lxr">
          {{ patchData.lxr || "暂无" }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="紧急联系电话：" prop="lxrdh">
          {{ patchData.lxrdh || "暂无" }}
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="寝室信息：" prop="qsinfo">
          {{ patchData.qsinfo || "暂无" }}
        </el-form-item>
      </el-col>
      <el-col v-if="patchData.fileInfo.length">
        <el-form-item label="附件：" prop="files">
          <file-list
            :props-files="patchData.fileInfo"
            url="/pFile/downFile"
            down-url="/pFile/downFile"
          ></file-list>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="请假承诺：" prop="xm">
          本人已阅读了学校有官学生请假的管理制度，履行了规定的请假手续。本着对自己负责的态度，现郑重承诺：一、本人请假期间，遵守各项国家法律法规和学校各项规定，注意个人人身及财产安全，交通安全。在请假期间的一切安全责任由本人自负。二、本人及时汇报自己请假期间的居住地址，电话号码，保持通讯畅通，以便联系，如联系不上，所产生的的后果由本人承担。
        </el-form-item>
      </el-col>
    </el-row>
    <approve-track
      ref="approveTrack"
      :defid="patchData.defid"
      :businessid="patchData.applyid"
    ></approve-track>
  </el-form>
</template>
<script>
import fileList from "_c/fileList";
import approveTrack from "_c/approveTrack";

export default {
  components: {
    fileList,
    approveTrack,
  },
  props: {
    patchData: Object,
    student: Object,
  },
  data() {
    return {};
  },
  methods: {
    getSteps() {
      return this.$refs.approveTrack.getSteps();
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
