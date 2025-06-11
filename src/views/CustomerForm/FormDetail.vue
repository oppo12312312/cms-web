<template>
  <div class="form-detail" :class="'detail-' + type" v-loading="loading">
    <div class="form-title" v-if="params.title">{{ params.title }}</div>
    <div class="form-desc" v-if="params.remark">{{ params.remark }}</div>

    <!-- 注意: 这里使用value, 不使用v-model绑定，顺序拖拽手动update实现-->
    <draggable
      :value="listCopy"
      group="B"
      :disabled="type != 0"
      :scroll="true"
      animation="300"
      @add="onAdd"
      @update="onUpdate"
      class="drag-area"
    >
      <div
        class="list-item"
        :class="active == index && type == 0 ? 'item-active' : ''"
        v-for="(item, index) in listCopy"
        :key="index"
        @click="handleSelect(item, index)"
      >
        <div class="item-title">
          {{ index + 1 }}.
          <span class="item-required" v-if="item.config.required">*</span>
          {{ item.title }}
        </div>
        <div class="item-desc">{{ item.remark }}</div>
        <GuideComponent :value="item" :disabled="type == 2" class="guide" />

        <div class="item-btn">
          <div class="btn" @click.stop="copy(index)">
            <i class="el-icon-document-copy" />复制
          </div>
          <div class="btn" @click.stop="del(index)">
            <i class="el-icon-delete" />删除
          </div>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import GuideComponent from "./components/GuideComponent.vue";
import draggable from "vuedraggable";
import {
  listByFormid,
  listByFormidAndUserId,
  submit,
} from "#/api/sysFormTopic";
import { businessId } from "@/api/pFile";
import { uploadFiles } from "@/api/file";
import { mapGetters } from "vuex";
export default {
  components: {
    GuideComponent,
    draggable,
  },
  props: {
    // 表单有三种状态：编辑时的表单 0，填写时的表单 1，只读查看填写结果时的表单 2
    type: {
      type: String | Number,
      dafault: 1,
    },
    params: {
      type: Object,
      dafault: () => ({}),
    },
    // 预览时表单题目数据
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      list: [],
      listData: [],
      active: -1,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    listCopy() {
      const arr = this.data?.length ? this.data : this.list;
      return arr.map((v) => {
        const obj = this.listData.find((o) => v.topicid == o.topicid);
        obj && Object.assign(v.config, JSON.parse(obj.formjson));
        if (
          this.listData.length &&
          (v.topictype == "upload" || v.topictype == "image")
        ) {
          Object.assign(v, { files: [] });
        }
        return v;
      });
    },
  },
  watch: {
    params: {
      handler() {
        if (this.params.formid) {
          this.loadData();
        }
        if (this.params.formid && this.params.bizid && this.params.userId) {
          this.initData();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  // created() {
  //   console.log(this.params)
  //   if (this.params.formid) {
  //     this.loadData()
  //   }
  //   if (this.params.formid && this.params.userId) {
  //     this.initData()
  //   }
  // },
  methods: {
    loadData() {
      this.list = [];
      this.loading = true;
      listByFormid({ formid: this.params.formid }).then((res) => {
        this.list = (res.data || []).map((v) => {
          return {
            topictype: v.topictype,
            title: v.title,
            remark: v.remark,
            config: JSON.parse(v.formjson),
            biztype: v.biztype,
            formid: v.formid,
            topicid: v.topicid,
          };
        });
        this.loading = false;
      });
    },
    initData() {
      this.listData = [];
      listByFormidAndUserId({
        bizid: this.params.bizid,
        formid: this.params.formid,
        userId: this.params.userId,
      }).then((res) => {
        this.listData = res.data || [];
      });
    },
    onAdd(e) {
      this.$emit("add", e);
    },
    handleAdd(obj, index) {
      if (index == undefined) {
        this.list.push(obj);
        this.active = this.list.length - 1;
      } else {
        this.list.splice(index, 0, obj);
        this.active = index;
      }
      this.$emit("select", obj);
    },
    onUpdate(e) {
      const oldIndex = e.oldIndex,
        newIndex = e.newIndex,
        item = this.list[oldIndex];
      this.list.splice(oldIndex, 1);
      this.list.splice(newIndex, 0, item);
      this.active = e.newIndex;
      this.$emit("select", item);
    },

    handleSelect(item, index) {
      this.active = index;
      this.$emit("select", item);
    },
    copy(index) {
      this.list.splice(index, 0, JSON.parse(JSON.stringify(this.list[index])));
      this.active = index + 1;
      this.$emit("select", this.list[this.active]);
    },
    del(index) {
      this.list.splice(index, 1);
      this.$emit("select", {});
    },
    handleUpdate(data) {
      this.list.splice(this.active, 1, data);
    },

    async save(cb, fail) {
      let flag = false;
      for (let i = 0; i < this.listCopy.length; i++) {
        if (this.listCopy[i].config.required) {
          const v = this.listCopy[i];
          if (
            ((v.topictype == "input" ||
              v.topictype == "textarea" ||
              v.topictype == "date" ||
              v.topictype == "radio") &&
              v.config.value === "") ||
            ((v.topictype == "upload" || v.topictype == "image") &&
              !v.files?.length) ||
            (v.topictype == "checkbox" && !v.config.value.length)
          ) {
            flag = true;
            this.$message.warning(`请回答第${i + 1}题：${v.title}`);
            break;
          }
        }
      }
      if (flag) {
        if (fail) fail();
        return;
      }
      const data = [];
      for (let i = 0; i < this.listCopy.length; i++) {
        const files = this.listCopy[i].files; // 所有文件：包括原本上传的和本次上传的
        const v = JSON.parse(JSON.stringify(this.listCopy[i]));
        if (files && (v.topictype == "upload" || v.topictype == "image")) {
          if (!v.config.value) {
            const res = await businessId();
            v.config.value = res.data;
          }
          const newFiles = files.filter((v) => !v.fileId);
          if (newFiles.length) {
            await uploadFiles(
              `/pFile/${v.biztype}/uploadFile`,
              { bussinessId: v.config.value },
              newFiles
            );
          }
        }
        data.push({
          formid: v.formid,
          topicid: v.topicid,
          topictype: v.topictype,
          bizid: this.params.bizid,
          biztype: v.biztype,
          data: JSON.stringify(v.config),
          answerValue:
            v.topictype == "checkbox"
              ? v.config.value.join(",")
              : v.config.value,
          answerName:
            v.topictype == "checkbox"
              ? v.config.options
                  .filter((o) => v.config.value.includes(o.value))
                  .map((o) => o.label)
                  .join(",")
              : v.topictype == "radio"
              ? v.config.options.find((o) => o.value == v.config.value).label
              : "",
        });
      }
      await submit(data).then((res) => {
        if (res.code == 200) {
          cb();
        } else {
          if (fail) fail();
          this.$message.warning(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-detail {
  width: 100%;
  min-height: 100%;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .form-title {
    height: 40px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 24px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    margin-bottom: 24px;
  }

  .form-desc {
    height: 20px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;

    padding: 0 40px;
    margin-bottom: 24px;
  }

  .drag-area {
    flex: 1;
  }

  .list-item {
    padding: 16px 40px 40px;

    .item-title {
      font-family: PingFangSC-Medium;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #333333;
      letter-spacing: 0;

      .item-required {
        font-family: PingFangSC-Medium;
        font-weight: 500;
        font-size: 14px;
        color: #f05f60;
        letter-spacing: 0;
      }
    }

    .item-desc {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #999999;
      letter-spacing: 0;
      margin: 10px 0 8px;
    }

    .item-btn {
      display: none;
    }
  }
}

.detail-0 {
  .list-item {
    position: relative;

    &:hover,
    &.item-active {
      background-color: #f4f6fb;

      .item-btn {
        opacity: 0.4;
      }
    }

    &:active {
      cursor: move;
    }

    .item-btn {
      position: absolute;
      bottom: 8px;
      right: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;

      .btn {
        width: 56px;
        height: 24px;
        background: #ffffff;
        border: 1px solid #cbd3df;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        i {
          margin-right: 4px;
        }

        & + .btn {
          margin-left: 4px;
        }
      }
    }
  }
}

.detail-0 {
  .guide {
    position: relative;
    z-index: 1;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 0;
      z-index: 2;
    }
  }
}
</style>
