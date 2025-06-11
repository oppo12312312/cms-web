<template>
  <div class="table-with-tab">
    <basic-table
      :call-server="callServer"
      ref="basicTable"
      :columns="columns"
      :muti="false"
    ></basic-table>
  </div>
  <!-- <el-form label-width="120px">
    <el-row :gutter="15">
      <el-col :span="12">
        <el-form-item label="任务名称：">
          {{ dto.name || '暂无' }}
        </el-form-item>
        <el-form-item label="执行开始时间：">
          {{ dto.startTime || '暂无' }}
        </el-form-item>
        <el-form-item label="执行情况：" v-if="dto.result=='fail'">
          {{ dto.errorMassage || '暂无' }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="执行结果：" v-if="dto.result=='success'">成功</el-form-item>
        <el-form-item label="执行结果：" v-else-if="dto.result=='fail'">失败</el-form-item>
        <el-form-item label="执行结果：" v-else-if="dto.result=='running'">运行中</el-form-item>
        <el-form-item label="执行结果：" v-else-if="dto.result=='abort'">取消</el-form-item>
        <el-form-item label="执行结果：" v-else>暂无</el-form-item>
        <el-form-item label="执行完成时间：">
          {{ dto.endTime || '暂无' }}
        </el-form-item>
      </el-col>
    </el-row>
  </el-form> -->
</template>
<script>
import basicTable from "_c/tables/";
import formMinxin from "_c/forms/minxins/formMinxin.js";
import { logList } from "@/api/scheduleJob";
export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
  },
  components: {
    basicTable,
  },
  data() {
    return {
      columns: [
        {
          label: "任务名称",
          prop: "name",
        },
        {
          label: "执行结果",
          prop: "result",
          render: (h, row) => {
            switch (row.result) {
              case "success":
                return <span class="txt-success">成功</span>;
                break;
              case "fail":
                return <span class="txt-danger">失败</span>;
                break;
              case "running":
                return <span class="txt-warning">进行中</span>;
                break;
              case "abort":
                return <span class="txt-warning">取消</span>;
                break;
            }
          },
        },
        {
          label: "执行开始时间",
          prop: "startTime",
        },
        {
          label: "执行完成时间",
          prop: "endTime",
        },
        {
          label: "执行情况",
          prop: "errorMassage",
        },
      ],
      tableParams: {
        jobId: this.patchData.id,
      },
    };
  },
  methods: {
    callServer(pagination) {
      return () => {
        return new Promise((resolve, reject) => {
          logList(
            Object.assign(
              { jobId: this.patchData.id },
              this.tableParams,
              pagination
            )
          )
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        });
      };
    },
    fecthData(keep) {
      if (keep) {
        this.tableParams = {
          jobId: this.patchData.id,
        };
      }
      this.$refs.basicTable.fecthData();
    },
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
    },
  },
};
</script>
