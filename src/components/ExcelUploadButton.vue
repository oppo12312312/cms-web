<template>
  <div class="excel-upload-button">
    <div class="upload-section">
      <!-- 主要上传按钮 -->
      <el-button
        :type="buttonType"
        :size="buttonSize"
        :icon="uploading ? 'el-icon-loading' : 'el-icon-upload'"
        :disabled="uploading"
        @click="selectFile"
      >
        {{ uploading ? "上传中..." : buttonText }}
      </el-button>

      <!-- 文件格式提示 -->
      <span v-if="showTip" class="format-tip">{{ tipText }}</span>
    </div>

    <!-- 已选择文件信息（紧凑显示） -->
    <div v-if="file && !uploading" class="file-preview">
      <div class="file-detail">
        <i class="el-icon-document"></i>
        <span class="file-name">{{ file.name }}</span>
        <span class="file-size">({{ formatFileSize(file.size) }})</span>
      </div>
      <div class="file-operations">
        <el-button
          type="success"
          size="mini"
          @click="handleUpload"
          icon="el-icon-check"
          >上传</el-button
        >
        <el-button size="mini" @click="selectFile" icon="el-icon-refresh"
          >重选</el-button
        >
        <el-button
          type="danger"
          size="mini"
          @click="removeFile"
          icon="el-icon-close"
          >删除</el-button
        >
      </div>
    </div>

    <!-- 上传进度（紧凑显示） -->
    <div v-if="uploading" class="progress-section">
      <div class="progress-header">
        <i class="el-icon-loading spinning"></i>
        <span>{{ progressText }}</span>
        <span class="progress-percent">{{ Math.round(uploadProgress) }}%</span>
      </div>
      <el-progress
        :percentage="uploadProgress"
        :status="uploadStatus || undefined"
        :stroke-width="6"
        :show-text="false"
      ></el-progress>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept=".xlsx,.xls"
      style="display: none"
      @change="handleFileSelect"
    />
  </div>
</template>

<script>
import { importExcel } from "@/projects/tms/api/dispatchSchedules";

export default {
  name: "ExcelUploadButton",
  props: {
    // 按钮文本
    buttonText: {
      type: String,
      default: "选择Excel文件",
    },
    // 按钮类型
    buttonType: {
      type: String,
      default: "primary",
    },
    // 按钮大小
    buttonSize: {
      type: String,
      default: "default",
    },
    // 是否显示格式提示
    showTip: {
      type: Boolean,
      default: true,
    },
    // 提示文本
    tipText: {
      type: String,
      default: "支持 .xlsx、.xls 格式",
    },
    // 最大文件大小（MB）
    maxSize: {
      type: Number,
      default: 10,
    },
    // 是否自动上传
    autoUpload: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      file: null,
      uploading: false,
      uploadProgress: 0,
      uploadStatus: "",
      progressText: "准备上传...",
    };
  },
  methods: {
    // 触发文件选择
    selectFile() {
      this.$refs.fileInput.click();
    },

    // 文件选择处理
    handleFileSelect(event) {
      const files = event.target.files;
      if (files.length > 0) {
        this.processFile(files[0]);
      }
    },

    // 处理选择的文件
    processFile(file) {
      // 验证文件类型
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (
        !allowedTypes.includes(file.type) &&
        !file.name.match(/\.(xlsx|xls)$/i)
      ) {
        this.$message.error("只能上传 Excel 格式的文件！");
        return;
      }

      // 验证文件大小
      if (file.size > this.maxSize * 1024 * 1024) {
        this.$message.error(`文件大小不能超过 ${this.maxSize}MB！`);
        return;
      }

      this.file = file;
      this.uploadProgress = 0;
      this.uploadStatus = "";

      // 触发文件选择事件
      this.$emit("file-select", file);

      // 自动上传
      if (this.autoUpload) {
        this.handleUpload();
      }
    },

    // 开始上传
    async handleUpload() {
      if (!this.file) {
        this.$message.warning("请先选择文件！");
        return;
      }

      this.uploading = true;
      this.uploadProgress = 0;
      this.uploadStatus = "";
      this.progressText = "正在上传...";

      let progressTimer = null;

      try {
        // 模拟上传进度
        progressTimer = setInterval(() => {
          if (this.uploadProgress < 90) {
            this.uploadProgress += Math.random() * 10;
          }
        }, 200);

        const response = await importExcel(this.file);

        clearInterval(progressTimer);
        this.uploadProgress = 100;
        this.uploadStatus = "success";
        this.progressText = "上传成功！";

        this.$message.success("文件上传成功！");

        // 触发上传成功事件
        this.$emit("upload-success", response);

        // 重置状态
        setTimeout(() => {
          this.resetUpload();
        }, 1500);
      } catch (error) {
        if (progressTimer) {
          clearInterval(progressTimer);
        }
        this.uploadProgress = 100;
        this.uploadStatus = "exception";
        this.progressText = "上传失败！";

        // const errorMsg = error.response?.data?.message || error.message || '上传失败，请重试'
        // this.$message.error(errorMsg)

        // 触发上传失败事件
        this.$emit("upload-error", error);

        this.uploading = false;
      }
    },

    // 删除文件
    removeFile() {
      this.file = null;
      this.uploadProgress = 0;
      this.uploadStatus = "";
      this.$refs.fileInput.value = "";
      this.$emit("file-remove");
    },

    // 重置上传状态
    resetUpload() {
      this.file = null;
      this.uploading = false;
      this.uploadProgress = 0;
      this.uploadStatus = "";
      this.progressText = "准备上传...";
      this.$refs.fileInput.value = "";
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },
  },
};
</script>

<style scoped>
.excel-upload-button {
  display: flex;
  width: 100%;
}

.upload-section {
  display: flex;
  align-items: center;
  gap: 12px;
  /* margin-bottom: 8px; */
}

.format-tip {
  color: #909399;
  font-size: 12px;
}

.file-preview {
  margin-top: 12px;
  padding: 12px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.file-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.file-detail .el-icon-document {
  color: #409eff;
  font-size: 16px;
}

.file-name {
  font-weight: 500;
  color: #303133;
  flex: 1;
  word-break: break-all;
}

.file-size {
  color: #909399;
  font-size: 12px;
}

.file-operations {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.progress-section {
  margin-top: 12px;
  padding: 12px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
}

.progress-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #409eff;
  font-size: 13px;
}

.progress-percent {
  margin-left: auto;
  font-weight: 500;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
