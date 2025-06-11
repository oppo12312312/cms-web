<template>
  <div class="upload-button-example">
    <el-card class="demo-card">
      <div slot="header">
        <span>按钮式Excel上传组件示例</span>
      </div>

      <!-- 基础按钮上传 -->
      <div class="demo-section">
        <h4>基础用法</h4>
        <excel-upload-button
          @upload-success="handleSuccess"
          @upload-error="handleError"
        />
      </div>

      <!-- 不同样式的按钮 -->
      <div class="demo-section">
        <h4>不同按钮样式</h4>
        <div class="button-row">
          <excel-upload-button
            button-text="导入订单"
            button-type="success"
            button-size="small"
            tip-text="只支持 .xlsx 格式"
            @upload-success="handleSuccess"
          />
        </div>
        <div class="button-row">
          <excel-upload-button
            button-text="批量导入"
            button-type="warning"
            button-size="medium"
            :show-tip="false"
            @upload-success="handleSuccess"
          />
        </div>
        <div class="button-row">
          <excel-upload-button
            button-text="数据导入"
            button-type="info"
            button-size="mini"
            tip-text="最大20MB"
            :max-size="20"
            @upload-success="handleSuccess"
          />
        </div>
      </div>

      <!-- 自动上传模式 -->
      <div class="demo-section">
        <h4>自动上传模式</h4>
        <excel-upload-button
          button-text="选择文件自动上传"
          button-type="primary"
          :auto-upload="true"
          tip-text="选择文件后自动开始上传"
          @file-select="handleFileSelect"
          @upload-success="handleAutoUploadSuccess"
          @upload-error="handleError"
        />
      </div>

      <!-- 在工具栏中使用 -->
      <div class="demo-section">
        <h4>工具栏场景</h4>
        <div class="toolbar">
          <el-button type="primary" icon="el-icon-plus">新增</el-button>
          <el-button type="success" icon="el-icon-edit">编辑</el-button>
          <excel-upload-button
            button-text="导入"
            button-type="warning"
            button-size="default"
            :show-tip="false"
            style="display: inline-block; margin-right: 8px"
            @upload-success="handleSuccess"
          />
          <el-button type="info" icon="el-icon-download">导出</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </div>
      </div>

      <!-- 上传结果显示 -->
      <div v-if="uploadResult" class="result-section">
        <el-alert
          :title="uploadResult.title"
          :type="uploadResult.type"
          :description="uploadResult.description"
          show-icon
          closable
          @close="clearResult"
        ></el-alert>
      </div>
    </el-card>

    <!-- 代码示例 -->
    <el-card class="code-card">
      <div slot="header">
        <span>使用代码</span>
      </div>
      <pre class="code-block"
        >{{ codeExample }}
      </pre>
    </el-card>
  </div>
</template>

<script>
import ExcelUploadButton from "./ExcelUploadButton.vue";

export default {
  name: "UploadButtonExample",
  components: {
    ExcelUploadButton,
  },
  data() {
    return {
      uploadResult: null,
      codeExample: `<!-- 基础用法 -->
<excel-upload-button 
  @upload-success="handleSuccess" 
  @upload-error="handleError" 
/>

<!-- 自定义样式 -->
<excel-upload-button
  button-text="导入数据"
  button-type="success"
  button-size="small"
  tip-text="支持 .xlsx、.xls 格式"
  :max-size="20"
  @upload-success="handleSuccess"
/>

<!-- 自动上传 -->
<excel-upload-button
  :auto-upload="true"
  tip-text="选择文件后自动上传"
  @file-select="handleFileSelect"
  @upload-success="handleSuccess"
/>

// JavaScript 使用方法
export default {
  methods: {
    handleSuccess(response) {
      console.log('上传成功:', response)
      this.$message.success('文件上传成功！')
    },
    handleError(error) {
      console.error('上传失败:', error)
      this.$message.error('文件上传失败！')
    },
    handleFileSelect(file) {
      console.log('选择文件:', file.name)
    }
  }
}`,
    };
  },
  methods: {
    // 文件选择回调
    handleFileSelect(file) {
      console.log("选择的文件:", file.name);
      this.$message.info(`已选择文件: ${file.name}`);
    },

    // 上传成功回调
    handleSuccess(response) {
      console.log("上传成功:", response);
      this.uploadResult = {
        type: "success",
        title: "文件上传成功！",
        description: "Excel文件已成功导入系统，数据处理完成。",
      };
    },

    // 自动上传成功回调
    handleAutoUploadSuccess(response) {
      console.log("自动上传成功:", response);
      this.uploadResult = {
        type: "success",
        title: "自动上传完成！",
        description: "文件选择后自动上传成功，无需手动操作。",
      };
    },

    // 上传失败回调
    handleError(error) {
      console.error("上传失败:", error);
      this.uploadResult = {
        type: "error",
        title: "文件上传失败！",
        description: error.message || "请检查文件格式和网络连接后重试。",
      };
    },

    // 清除结果
    clearResult() {
      this.uploadResult = null;
    },
  },
};
</script>

<style scoped>
.upload-button-example {
  padding: 20px;
}

.demo-card {
  margin-bottom: 20px;
}

.demo-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.demo-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.demo-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
}

.button-row {
  margin-bottom: 12px;
}

.button-row:last-child {
  margin-bottom: 0;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.result-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.code-card {
  border: 1px solid #e4e7ed;
}

.code-block {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #303133;
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
}
</style>
