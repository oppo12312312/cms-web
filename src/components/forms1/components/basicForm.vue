<template>
  <el-form
    ref="form"
    :model="fieldsData"
    :size="options.size"
    :inline="options.inline || false"
    @validate="validated"
  >
    <template v-for="(v, i) in mapFields">
      <el-row :key="i" :gutter="15">
        <template v-for="(item, index) in v">
          <el-col :key="index" :span="item.span || 24" :xs="item.xs || 24">
            <el-form-item
              :label-width="
                labelWidth
                  ? labelWidth + 'px'
                  : item.label == ''
                  ? '0px'
                  : '120px'
              "
              :rules="item.rule"
              :label="item.label"
              :prop="item.prop"
              :style="item.style"
              v-show="item.show == 'false' ? false : true"
            >
              <template v-if="item.type == 'desc'">
                {{ item.prop || "暂无" }}
              </template>
              <template
                v-if="
                  ['text', 'textarea', 'number', 'email'].indexOf(item.type) !==
                  -1
                "
              >
                <el-input
                  class="input"
                  v-model="fieldsData[item.prop]"
                  inline-message
                  :placeholder="item.placeholder"
                  :disabled="item.disabled"
                  :type="item.type"
                  @blur="item.blur ? item.blur(fieldsData[item.prop]) : ''"
                  @input="item.input ? item.input(fieldsData[item.prop]) : ''"
                  :rows="4"
                  @change="change(item, index, 'change')"
                  :readonly="item.readonly"
                  @click="item.click()"
                >
                  <span
                    v-if="item.prepend"
                    slot="prepend"
                    @click.stop="click(item, index)"
                  >
                    <template v-if="/^(el-icon|my-icon).*/.test(item.prepend)">
                      <i :class="item.prepend"></i>
                    </template>
                    <template v-else>{{ item.prepend }}</template>
                  </span>
                  <span
                    v-if="item.append"
                    slot="append"
                    @click.stop="click(item, index)"
                  >
                    <template v-if="/^(el-icon|my-icon).*/.test(item.append)">
                      <i :class="item.append"></i>
                    </template>
                    <template v-else>{{ item.append }}</template>
                  </span>
                </el-input>
              </template>
              <template v-if="item.type == 'password'">
                <el-input
                  class="input"
                  v-model="fieldsData[item.prop]"
                  inline-message
                  :placeholder="item.placeholder"
                  :disabled="item.disabled"
                  type="password"
                  autocomplete="off"
                  auto-complete="new-password"
                  :show-password="item.showPassword"
                  @blur="item.blur ? item.blur(fieldsData[item.prop]) : ''"
                  @input="
                    item.input ? item.input(fieldsData[item.prop]) : () => {}
                  "
                  :rows="4"
                  @change="change(item, index, 'change')"
                  clearable
                >
                  <span
                    v-if="item.prepend"
                    slot="prepend"
                    @click.stop="click(item, index)"
                  >
                    <template v-if="/^(el-icon|my-icon).*/.test(item.prepend)">
                      <i :class="item.prepend"></i>
                    </template>
                    <template v-else>{{ item.prepend }}</template>
                  </span>
                  <span
                    v-if="item.append"
                    slot="append"
                    class="cursor-p"
                    @click.stop="item.appendClick(item, index)"
                  >
                    <template v-if="/^(el-icon|my-icon).*/.test(item.append)">
                      <i :class="item.append"></i>
                    </template>
                    <template v-else>{{ item.append }}</template>
                  </span>
                </el-input>
              </template>
              <template v-if="item.type == 'rate'">
                <el-rate
                  style="margin-top: 12px"
                  v-model="fieldsData[item.prop]"
                  :colors="item.colors"
                ></el-rate>
              </template>
              <template v-if="item.type == 'selectDialog'">
                <div
                  @click="item.readonly ? '' : selectDialogShow(item)"
                  style="position: relative"
                >
                  <el-input
                    class="input"
                    :value="getVal(item)"
                    :placeholder="item.placeholder"
                    :readonly="item.readonly"
                    :disabled="item.disabled"
                    @focus="item.focus ? item.focus(fieldsData[item.prop]) : ''"
                  >
                    <i class="el-icon-search" slot="suffix" style="right: 10px">
                    </i>
                  </el-input>
                  <el-input
                    class="input"
                    v-model="fieldsData[item.prop]"
                    :placeholder="item.placeholder"
                    type="hidden"
                    style="position: absolute; left: 0; top: 0"
                  ></el-input>
                </div>
              </template>
              <template v-if="item.type == 'click'">
                <div @click="item.click" style="position: relative">
                  <el-input
                    class="input"
                    v-model="fieldsData[item.prop]"
                    :placeholder="item.placeholder"
                    :readonly="item.readonly"
                  >
                    <i class="el-icon-search" slot="suffix" style="right: 10px">
                    </i>
                  </el-input>
                </div>
              </template>
              <template v-if="item.type == 'select'">
                <el-select
                  v-if="!item.readonly"
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                  :multiple="item.multiple"
                  :collapse-tags="item.collapse ? item.collapse : false"
                  :placeholder="item.placeholder"
                  @change="change(item, index, 'change')"
                >
                  <el-option
                    v-for="(k, i) in item.options"
                    :key="i"
                    :disabled="k.disabled"
                    :value-id="k.id"
                    :label="k.label"
                    :value="k.value"
                    v-show="!k.hidden"
                  />
                </el-select>
                <el-input
                  v-else
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                  :readonly="item.readonly"
                ></el-input>
              </template>
              <template v-if="item.type == 'tree'">
                <el-select
                  v-if="!item.readonly"
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder"
                  @change="change(item, index, 'change')"
                  popper-class="tree-select"
                  ref="selectTree"
                >
                  <el-option
                    :value="item.treeValue"
                    :label="item.treeLabel"
                    :key="item.treeValue"
                    style="height: auto"
                  >
                    <el-tree
                      :default-expand-all="true"
                      node-key="id"
                      ref="tree"
                      highlight-current
                      :props="item.defaultProps"
                      :load="item.loadNode"
                      :expand-on-click-node="false"
                      lazy
                      @check-change="handleCheckChange(item)"
                      @node-click="
                        (node) => {
                          handleNodeClick(node, item);
                        }
                      "
                    ></el-tree>
                  </el-option>
                  <!-- <el-option v-else :value="treeValue" style="height: auto">
                    <el-tree
                      :data="item.treeData"
                      show-checkbox
                      node-key="id"
                      ref="tree"
                      highlight-current
                      :props="item.defaultProps"
                      @check-change="handleCheckChange(item.prop)"
                    ></el-tree>
                  </el-option> -->
                </el-select>
              </template>
              <template v-if="item.type == 'switch'">
                <el-switch
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                />
              </template>
              <template v-if="item.type == 'slider'">
                <el-slider
                  v-model="fieldsData[item.prop]"
                  :format-tooltip="item.formatTooltip"
                  :disabled="item.disabled"
                />
              </template>
              <template v-if="item.type == 'checkbox'">
                <template v-if="item.options && item.options.length">
                  <el-checkbox
                    @change="change(item, index, 'change')"
                    v-model="fieldsData[item.prop]"
                    v-for="(k, i) in item.options"
                    :key="i"
                    :label="k.value || k[item.config.value] || k.id || k.label"
                    :disabled="k.disabled"
                    :checked="k.checked"
                    >{{ k.label || k[item.config.label] }}</el-checkbox
                  >
                </template>
                <el-checkbox
                  v-else
                  v-model="fieldsData[item.prop]"
                  :label="item.options.value"
                  :disabled="item.disabled"
                  :checked="item.checked"
                  >{{ item.options.label }}</el-checkbox
                >
              </template>
              <template v-if="item.type == 'cascader'">
                <el-cascader
                  v-if="!item.readonly"
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                  :readonly="item.readonly"
                  :checkStrictly="true"
                  :emitPath="false"
                  :options="item.options"
                  :props="item.config || { label: 'name', value: 'id' }"
                  @change="change(item, index, 'change')"
                ></el-cascader>
                <el-input
                  v-else
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                  :readonly="item.readonly"
                ></el-input>
              </template>
              <template v-if="item.type == 'checkboxgroup'">
                <el-checkbox-group
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                >
                  <el-checkbox
                    v-for="(k, i) in item.options"
                    :label="k.value || k.id || k.label"
                    :key="i"
                    :disabled="k.disabled"
                    :checked="k.checked"
                    >{{ k.label || k[item.config.label] }}</el-checkbox
                  >
                </el-checkbox-group>
              </template>
              <template v-if="item.type == 'radio'">
                <template v-if="item.options && item.options.length">
                  <el-radio
                    v-model="fieldsData[item.prop]"
                    v-for="(k, i) in item.options"
                    :key="i"
                    :label="k.value"
                    :disabled="item.disabled"
                    @change="change(item, index, 'change')"
                    >{{ k.label }}</el-radio
                  >
                </template>
                <el-radio
                  v-else
                  v-model="fieldsData[item.prop]"
                  :label="item.options.value"
                  :disabled="item.disabled"
                  >{{ item.options.label }}</el-radio
                >
              </template>
              <template v-if="item.type == 'radiogroup'">
                <el-radio-group
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                >
                  <el-radio
                    v-for="(k, i) in item.options"
                    :label="k.value"
                    :key="i"
                    :disabled="k.disabled"
                    >{{ k.label }}</el-radio
                  >
                </el-radio-group>
              </template>
              <template v-if="item.type == 'button'">
                <div v-if="item.options && item.options.length">
                  <el-button
                    v-for="(k, i) in item.options"
                    :key="i"
                    :type="k.style"
                    @click.stop="click(k, i, item)"
                    >{{ k.label }}</el-button
                  >
                </div>
                <div v-else>
                  <el-button
                    :key="index"
                    :type="item.options.style"
                    @click.stop="click(item.options, index, item)"
                    >{{ item.options.label }}</el-button
                  >
                </div>
              </template>
              <template v-if="['date', 'datetime'].indexOf(item.type) >= 0">
                <el-date-picker
                  :type="item.dType"
                  :editable="false"
                  :value-format="
                    item.formate ? item.formate : 'yyyy-MM-dd HH:mm:ss'
                  "
                  :format="item.format"
                  :picker-options="expireTimeOption(item.disabledDate)"
                  v-model="fieldsData[item.prop]"
                  :placeholder="item.placeholder"
                  :disabled="item.disabled"
                  :readonly="item.readonly"
                ></el-date-picker>
              </template>
              <template v-if="item.type == 'daterange'">
                <el-date-picker
                  type="daterange"
                  :editable="false"
                  :value-format="
                    item.formate ? item.formate : 'yyyy-MM-dd HH:mm:ss'
                  "
                  :format="item.format"
                  v-model="fieldsData[item.prop]"
                  :start-placeholder="
                    item.sPlaceholder ? item.sPlaceholder : '开始日期'
                  "
                  :end-placeholder="
                    item.ePlaceholder ? item.ePlaceholder : '结束日期'
                  "
                  :range-separator="item.rangeSep ? item.rangeSep : '至'"
                  :disabled="item.disabled"
                  :readonly="item.readonly"
                ></el-date-picker>
              </template>
              <template v-if="item.type == 'image'">
                <div :key="key" class="image">
                  <el-upload
                    class="avatar-uploader"
                    action=""
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="
                      (file, fileList) => onChange(file, fileList, item)
                    "
                    :on-success="onSuccess"
                    :before-upload="beforeUpload"
                    :disabled="item.disabled"
                  >
                    <div v-if="item.oFid || item.query">
                      <img
                        style="width: 140px; height: 80px"
                        v-if="imageUrl"
                        :src="imageUrl"
                        class="avatar"
                      />
                      <v-image
                        v-else
                        style="width: 140px; height: 80px"
                        :placeholder="require('@p/static/imgs/no_pic.jpg')"
                        :query="item.oFid ? { id: item.oFid } : item.query"
                        fit="fill"
                        :url="item.url"
                      ></v-image>
                    </div>
                    <div v-else>
                      <img
                        style="width: 120px; height: 80px"
                        v-if="imageUrl"
                        :src="imageUrl"
                        class="avatar"
                      />
                      <i v-else class="el-icon-camera avatar-uploader-icon"></i>
                    </div>
                  </el-upload>
                  <p
                    v-if="item.tip"
                    class="txt-danger"
                    style="font-size: 10px; line-height: 18px"
                  >
                    ({{ item.tip }})
                  </p>
                  <el-input
                    class="not-show"
                    type="hidden"
                    style="width: 1px; position: absolute; bottom: 0; left: 0"
                    v-model="fieldsData[item.prop]"
                    autocomplete="off"
                  ></el-input>
                  <!-- <el-input
                    v-model="files[item.prop]"
                    type="text"
                    @paste.native.capture.prevent="onPaste($event, item, index)"
                    placeholder="粘贴截图上传"
                  >
                    <el-button
                      slot="append"
                      @click.native.stop="$refs.upload[0].click()"
                      >本地上传</el-button
                    >
                  </el-input> -->
                  <div
                    v-if="fieldsData[item.prop] && fieldsData[item.prop].length"
                    class="image-box"
                  >
                    <template v-for="(v, i) in fieldsData[item.prop]">
                      <div class="image-item" :key="i">
                        <el-image
                          :src="v"
                          :preview-src-list="fieldsData[item.prop]"
                          fit="cover"
                        />
                        <i
                          class="el-icon-delete"
                          @click="onDelImage(item, i)"
                        ></i>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
              <template v-if="item.type == 'upload'">
                <el-upload
                  action=""
                  ref="upload"
                  class="upload-demo"
                  :multiple="item.multiple"
                  :on-change="
                    (file, fileList) => onChangeFile(file, fileList, item)
                  "
                  :on-preview="handlePreview"
                  :on-remove="
                    (file, fileList) => handleRemove(file, fileList, item)
                  "
                  :file-list="item.fileList"
                  :auto-upload="false"
                  :on-error="onErr"
                  :on-success="onSuccess"
                >
                  <el-button size="small" type="primary">选择文件</el-button>
                  <span class="txt-danger" v-if="item.multiple"
                    >（可多选）</span
                  >
                </el-upload>
                <div>
                  <file-table
                    v-if="item.oFiles"
                    :files="item.oFiles"
                  ></file-table>
                  <div v-if="item.oFiles1 && item.oFiles1.length">
                    <h4>已上传文件</h4>
                    <file-list
                      :props-files="item.oFiles1"
                      :url="item.prevUrl"
                      :down-url="item.downUrl"
                      :operate="true"
                      @del="item.delFile"
                    ></file-list>
                  </div>

                  <ul class="el-upload-list">
                    <li
                      class="el-upload-list__item"
                      v-for="(file, index) in item.files"
                      :key="file.id"
                    >
                      <a
                        class="el-upload-list__item-name cursorPoint"
                        @click="item.download ? item.download(file) : ''"
                      >
                        <i class="el-icon-document"></i>
                        {{ file.filename || file.fileName }}
                      </a>
                      <i
                        class="el-icon-close"
                        @click="item.delFile ? item.delFile(file, index) : ''"
                      ></i>
                    </li>
                  </ul>
                </div>
                <p
                  class="txt-danger"
                  style="font-size: 10px; line-height: 18px"
                  v-if="item.tip"
                >
                  ({{ item.tip }})
                </p>
                <div
                  class="txt-danger normal-font flex"
                  v-if="item.tips.length"
                >
                  <p>注：</p>
                  <div class="flex-grow">
                    <p v-for="(t, index) in item.tips" :key="index">{{ t }}</p>
                  </div>
                </div>
              </template>
              <template v-if="item.type == 'plan'">
                <el-progress
                  :percentage="fieldsData[item.prop]"
                  text-inside
                  type="line"
                  :stroke-width="25"
                ></el-progress>
              </template>
            </el-form-item>
          </el-col>
        </template>
        <slot></slot>
      </el-row>
    </template>
    <v-dialog
      ref="selectDialog"
      @handleClose="saveSelectData"
      width="640px"
      title="请选择"
      :dialog-class="diaClass"
    >
      <select-dialog
        ref="selectForm"
        :opts="currentItem.selectData"
        :init-id="fieldsData[currentItem.prop]"
      ></select-dialog>
    </v-dialog>
  </el-form>
</template>
<script>
import selectDialog from "./selectDialog";
import fileList from "_c/fileList";
import fileTable from "_c/fileTable";

export default {
  name: "mixForm",
  model: {
    prop: "fieldsData",
    prop: "diaClass",
  },
  components: {
    selectDialog,
    fileList,
    fileTable,
  },
  props: {
    labelWidth: "",
    diaClass: {
      type: String,
      default: "xrsz-dialog",
    },
    fields: {
      type: Array,
      default: () => [
        {
          label: "菜单名称",
          prop: "title",
          type: "text",
          rule: null,
          append: "arrow-right",
          click: (item, index) => {},
        },
        {
          label: "菜单名称",
          prop: "title",
          type: "text",
          rule: null,
          append: "el-icon-arrow-right",
        },
        {
          label: "菜单名称",
          prop: "title",
          type: "text",
          rule: null,
          prepend: "el-icon-arrow-left",
        },
        { label: "菜单名称", prop: "switch", type: "switch", rule: null },
        { label: "单选框", prop: "radio", type: "radio", rule: null },
        {
          label: "单选框组",
          prop: "radiogroup",
          type: "radio",
          options: [
            { label: "a", value: "a" },
            { label: "b", value: "b" },
          ],
          rule: null,
        },
        { label: "复选框", prop: "checkbox", type: "checkbox", rule: null },
        {
          label: "复选框",
          prop: "checkboxgroup",
          type: "checkbox",
          options: [
            { label: "a", value: "a" },
            { label: "b", value: "b" },
          ],
          rule: null,
        },
      ],
    },
    fieldsData: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      key: "key",
      imageUrl: "",
      mapFields: [],
      files: [],
      fileList: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      currentItem: {},
    };
  },
  watch: {
    fields() {
      this.onMapFields();
    },
    fieldsData() {
      this.key = Math.random();
    },
  },

  created() {
    this.onMapFields();
  },
  methods: {
    async onUpload(event, item) {
      this.fileList = event.target.files || [];
      const formData = new FormData();
      this.fileList.forEach((e) => {
        formData.append("files", e);
      });
      // 这里需要修改文件上传接口地址
      const { data } = await this.axios("/admin/Publics/UploadFiles", {
        data: formData,
      });
      if (data.code) {
        this.fieldsData[item.prop] = data.data;
      }
    },
    handlePreview() {},
    handleRemove(file, files, item) {
      item.fileList = files;
      this.fieldsData[item.prop] = files;
    },
    previewFile(file, files) {
      console.log(file, files);
    },
    removeFile(file, files) {
      console.log(file, files);
    },
    //图片上传
    beforeUpload() {},
    onErr(err) {},
    onSuccess(res, file, fileList) {},
    onChange(file, fileList, item) {
      const nFile = fileList.pop();
      const fileType = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      if (item.limit) {
        if (item.limit.accept.indexOf(fileType) > -1) {
          if (item.limit.size >= file.size) {
            this.fieldsData[item.prop] = file;
            this.imageUrl = URL.createObjectURL(file.raw);
          } else {
            this.toast("图片大小不符合要求，请重新选择图片", "warning");
          }
        } else {
          this.toast("只能上传gif、jpg、jpeg、png、zip格式的文件", "warning");
        }
      } else {
        if (["gif", "jpg", "jpeg", "png", "zip"].indexOf(fileType) > -1) {
          this.fieldsData[item.prop] = file;
          this.imageUrl = URL.createObjectURL(file.raw);
        } else {
          this.toast("只能上传gif、jpg、jpeg、png、zip格式的文件", "warning");
        }
      }
    },
    //文件上传
    onChangeFile(file, fileList, item) {
      const nFile = fileList.pop();
      const fileType = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      let allow = false;
      if (item.limit) {
        for (const lm of item.limit) {
          if (lm.accept.indexOf(fileType) > -1) {
            if (lm.size) {
              if (lm.size >= file.size) {
                allow = true;
                break;
              } else {
                this.toast("文件大小不符合要求，请重新选择文件", "warning");
                allow = false;
                break;
              }
            } else {
              allow = true;
              break;
            }
          }
        }
      } else {
        allow = true;
      }
      if (allow) {
        item.fileList.push(file);
        this.fieldsData[item.prop] = item.fileList;
      } else {
        this.toast("文件格式不符合要求，请重新选择文件", "warning");
      }
    },

    // 删除选择的图片
    onDelImage(item, i) {
      this.fieldsData[item.prop].splice(i, 1);
      this.key = Math.random();
    },
    onMapFields() {
      this.mapFields = [];
      let arr = [];
      this.fields.forEach((e) => {
        if (e.wrap) {
          this.mapFields.push(arr);
          arr = [];
        }
        arr.push(e);
      });
      this.mapFields.push(arr);
    },
    change(item, index, type) {
      const click = item[type];
      if (!click) return;
      this.onClick(click, item, index, type);
    },
    click(item, index, option) {
      const click = item["click"];
      if (!click) return;
      this.onClick(click, item, index, option);
    },
    onClick(click, item, index, option) {
      if (typeof click == "function") {
        click(item, index, option);
        return;
      }
      if (typeof this.$parent[click] == "function") {
        this.$parent[click](item, index, option);
        return;
      }
    },
    // 输入触发验证
    validated(prop) {
      // 验证
    },
    // 表单验证
    async validate(prop) {
      try {
        return await this.$refs["form"].validate();
      } catch (error) {
        return error;
      }
    },
    resetFields() {
      this.$refs["form"].resetFields();
    },
    clearValidate() {
      this.$refs["form"].clearValidate();
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
    handleCheckChange(prop) {
      const res = this.$refs.tree.getCheckedNodes(true, true); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
      const arrLabel = [];
      const arr = [];
      res.forEach((item) => {
        arrLabel.push(item.label);
        arr.push(item);
      });
      this.treeValue = arr;
      this.$set(this.fieldsData, prop, arrLabel);
    },
    handleNodeClick(node, item) {
      item.treeValue = node.value;
      item.treeLabel = node.channelName;
      this.$refs.selectTree[0].blur();
      this.$set(this.fieldsData, item.prop, node.value);
    },
    getVal(item) {
      for (const da of item.selectData) {
        if (da.value == this.fieldsData[item.prop]) {
          return da.label;
        }
      }
    },
    saveSelectData() {
      this.$set(
        this.fieldsData,
        this.currentItem.prop,
        this.$refs.selectForm.selArr[0].value
      );
      this.$refs.selectForm.selArr = [];
      this.$refs.selectForm.selected = [];
      this.$refs.selectDialog.close();
    },
    selectDialogShow(item) {
      this.diaClass = item.diaClass || "xrsz-dialog";
      if (!item.disabled) {
        if (item.selectData.length) {
          this.currentItem = item;
          this.$refs.selectDialog.dialogVisible = true;
        } else {
          this.toast(item.empty, "warning");
        }
      }
    },
    expireTimeOption(val) {
      if (val) {
        return {
          disabledDate(date) {
            if (val.type == "before") {
              return date.getTime() > val.time;
            } else if (val.type == "after") {
              return date.getTime() < val.time;
            } else {
              return true;
            }
          },
        };
      } else {
        return {};
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.tree-select {
  .el-select-dropdown__item {
    padding: 0;
    &.selected {
      font-weight: 400;
    }
  }
}
</style>
