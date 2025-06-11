<template>
  <div class="template-edit">
    <div class="template-body">
      <div class="template-left">
        <h3>常用控件</h3>
        <draggable
          v-model="widgets"
          :options="{ group: { name: 'B', pull: 'clone' }, sort: false }"
          class="widget-list"
          :class="{ disabled: !editable }"
        >
          <div
            class="widget-item"
            v-for="(item, index) in widgets"
            :key="index"
            @click="handleAdd(item)"
          >
            <i class="iconfont" :class="item.icon" /> {{ item.text }}
          </div>
        </draggable>
      </div>
      <div class="template-content">
        <FormDetail
          ref="form"
          :type="editable ? 0 : 2"
          :params="params"
          @add="add"
          @select="handleSelect"
        />
      </div>
      <div class="template-right">
        <FormDesc
          :patch-data="current"
          :class="{ disabled: !editable }"
          v-if="current.topictype"
          @change="changeDesc"
        />
        <FormConfig
          :data="current"
          :class="{ disabled: !editable }"
          @change="changeConfig"
        />
      </div>
    </div>
    <div class="template-btn">
      <div class="btn" @click="$router.go(-1)">
        <i class="el-icon-circle-close" />取消
      </div>
      <div class="btn" @click="preview"><i class="el-icon-view" />预览</div>
      <div class="btn" @click="handleSave" v-if="editable">
        <i :class="!loading ? 'el-icon-s-promotion' : 'el-icon-loading'" />保存
      </div>
    </div>

    <el-dialog title="模版预览" :visible.sync="visible" width="680px">
      <FormDetail :type="1" :params="params" :data="previewList" />
      <span slot="footer" class="dialog-footer" v-if="editable">
        <el-button type="primary" :loading="loading" @click="handleSave"
          >保 存</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormDetail from "./FormDetail.vue";
import FormDesc from "./FormDesc.vue";
import FormConfig from "./FormConfig.vue";
import draggable from "vuedraggable";
import { form } from "#/api/sysFormTopic";
export default {
  components: {
    FormDetail,
    FormDesc,
    FormConfig,
    draggable,
  },
  props: {
    params: {
      type: Object,
      default: () => {},
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      widgets: [
        {
          type: "input",
          text: "单行文本",
          icon: "icon-danhangwenben",
          config: {
            value: "",
            required: true,
          },
        },
        {
          type: "textarea",
          text: "多行文本",
          icon: "icon-duohangwenben",
          config: {
            value: "",
            required: true,
          },
        },
        {
          type: "radio",
          text: "单选框",
          icon: "icon-danxuan",
          config: {
            value: "",
            required: true,
            options: [
              { label: "选项一", value: 0 },
              { label: "选项二", value: 1 },
            ],
          },
        },
        {
          type: "checkbox",
          text: "复选框",
          icon: "icon-duoxuan",
          config: {
            value: [],
            required: true,
            options: [
              { label: "选项一", value: 0 },
              { label: "选项二", value: 1 },
            ],
          },
        },
        {
          type: "date",
          text: "日期时间",
          icon: "icon-riqishijian",
          config: {
            value: "",
            required: true,
            format: "yyyy-MM-dd",
          },
        },
        {
          type: "image",
          text: "图片",
          icon: "icon-tupian",
          config: {
            value: "",
            required: true,
            limit: 1,
            size: "",
          },
        },
        {
          type: "upload",
          text: "附件",
          icon: "icon-fujian",
          config: {
            value: "",
            required: true,
            limit: 1,
            size: "",
            accept: [],
          },
        },
      ],
      current: {},
      visible: false,
      previewList: [],
      loading: false,
    };
  },
  computed: {
    biztype() {
      return this.params.biztype || "cy";
    },
  },
  methods: {
    add(e) {
      const widget = this.widgets[e.oldIndex];
      this.handleAdd(widget, e.newIndex);
    },
    handleAdd(widget, index) {
      const obj = {
        topictype: widget.type,
        title: widget.text,
        remark: "",
        config: { ...widget.config },
      };
      this.$refs.form.handleAdd(obj, index);
    },
    handleSelect(item) {
      this.current = item;
    },
    changeDesc(data) {
      if (this.current.topictype) {
        Object.assign(this.current, data);
        this.$refs.form.handleUpdate(this.current);
      }
    },
    changeConfig(config) {
      if (this.current.topictype) {
        Object.assign(this.current, { config });
        this.$refs.form.handleUpdate(this.current);
      }
    },
    preview() {
      const list = this.$refs.form.list;
      if (!list.length) {
        return this.$message.warning("请为表单添加一个控件");
      }
      this.previewList = JSON.parse(JSON.stringify(list));
      this.visible = true;
    },
    handleSave() {
      if (this.loading) {
        return;
      }
      const list = this.$refs.form.list;
      if (!list.length) {
        return this.$message.warning("请为表单添加一个控件");
      }

      const data = Object.assign({
        formid: this.params.formid,
        biztype: this.biztype,
        sysFormTopicDTOs: list.map((v, i) => {
          return {
            title: v.title,
            remark: v.remark,
            topictype: v.topictype,
            orderno: i,
            formjson: JSON.stringify(v.config),
          };
        }),
      });
      this.loading = true;
      form(data).then((res) => {
        if (res.code == 200) {
          this.$message.success("保存成功");
          this.$emit("success");
        } else {
          this.$message.warning(res.msg);
        }
        this.visible = false;
        this.loading = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.template-edit {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .template-btn {
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn {
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;

      &:nth-child(2) {
        color: #21a778;
      }

      &:nth-child(3) {
        background: #21a778;
        color: #fff;
      }

      i {
        margin-right: 12px;
      }
    }
  }

  .template-body {
    width: 100%;
    flex: 1;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;

    .template-left {
      width: 246px;
      height: 100%;
      background: #fff;
      padding: 18px 16px;

      h3 {
        height: 20px;
        margin-bottom: 8px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #2a2a2a;
        letter-spacing: 0;
      }

      .widget-list {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;

        &.disabled {
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

        .widget-item {
          width: 100px;
          height: 36px;
          background: #f9fafc;
          border: 1px solid #ebedf7;
          border-radius: 3px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 14px;
          color: #2a2a2a;
          letter-spacing: 0;
          padding: 0 10px;
          margin-bottom: 14px;

          &:hover,
          &:active {
            cursor: pointer;
          }

          &:nth-child(2n + 1) {
            margin-right: 14px;
          }

          i {
            margin-right: 6px;
          }
        }
      }
    }

    .template-content {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      background: #fff;
      margin: 0 12px;
    }

    .template-right {
      width: 346px;
      height: 100%;
      padding: 16px;
      overflow-y: auto;
      background: #fff;

      .disabled {
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
  }
}
</style>
