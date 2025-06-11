<template>
  <div class="excel-upload">
    <!-- 上传按钮和文件信息 -->
    <div class="upload-container">
      <!-- 上传按钮 -->
      <div v-if="!uploading" class="upload-button-area">
        <el-button
          type="primary"
          icon="el-icon-upload"
          :disabled="uploading"
          @click="$refs.fileInput.click()"
        >
          选择Excel文件
        </el-button>
        <span class="upload-tip"
          >支持 .xlsx、.xls 格式，最大 {{ maxSize }}MB</span
        >
      </div>

      <!-- 已选择的文件信息 -->
      <div v-if="file && !uploading" class="selected-file">
        <div class="file-info">
          <i class="el-icon-document"></i>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">({{ formatFileSize(file.size) }})</span>
          <el-button
            type="text"
            icon="el-icon-delete"
            size="small"
            @click="removeFile"
            >删除</el-button
          >
        </div>
        <div class="file-actions">
          <el-button type="success" size="small" @click="handleUpload">
            <i class="el-icon-upload"></i>
            开始上传
          </el-button>
          <el-button size="small" @click="$refs.fileInput.click()">
            <i class="el-icon-refresh"></i>
            重新选择
          </el-button>
        </div>
      </div>

      <!-- 上传进度 -->
      <div v-if="uploading" class="upload-progress">
        <div class="progress-info">
          <i class="el-icon-loading"></i>
          <span>{{ progressText }}</span>
        </div>
        <el-progress
          :percentage="uploadProgress"
          :status="uploadStatus || undefined"
          :stroke-width="8"
        ></el-progress>
      </div>

      <!-- 隐藏的文件输入框 -->
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls"
        style="display: none"
        @change="handleFileSelect"
      />
    </div>
  </div>
</template>

<script>
import { importExcel } from "@/projects/tms/api/dispatchSchedules";

export default {
  name: "ExcelUpload",
  props: {
    // 是否自动上传
    autoUpload: {
      type: Boolean,
      default: false,
    },
    // 最大文件大小（MB）
    maxSize: {
      type: Number,
      default: 10,
    },
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
    // 文件选择
    handleFileSelect(event) {
      const files = event.target.files;
      if (files.length > 0) {
        this.selectFile(files[0]);
      }
    },

    // 选择文件
    selectFile(file) {
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
        }, 2000);
      } catch (error) {
        if (progressTimer) {
          clearInterval(progressTimer);
        }
        this.uploadProgress = 100;
        this.uploadStatus = "exception";
        this.progressText = "上传失败！";

        const errorMsg =
          error.response?.data?.message || error.message || "上传失败，请重试";
        this.$message.error(errorMsg);

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
.excel-upload {
  width: 100%;
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-button-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
}

.selected-file {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-info .el-icon-document {
  color: #409eff;
  font-size: 18px;
}

.file-name {
  font-weight: 500;
  color: #303133;
  flex: 1;
}

.file-size {
  color: #909399;
  font-size: 12px;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #409eff;
  font-size: 14px;
}

.progress-info .el-icon-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.el-progress {
  margin-top: 4px;
}
</style>
