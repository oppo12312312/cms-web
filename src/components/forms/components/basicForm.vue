<template>
  <el-form
    ref="form"
    :model="fieldsData"
    :size="options.size"
    :inline="options.inline || false"
    :label-position="labelPosition"
    @validate="validated"
    status-icon
    :disabled="disabled"
  >
    <template v-for="(v, i) in mapFields">
      <el-row :key="i" :gutter="15">
        <template v-for="(item, index) in v">
          <el-col :key="index" :span="item.span || 24" :xs="item.xs || 24">
            <el-form-item
              :label-width="
                item.labelWidth
                  ? item.labelWidth
                  : labelWidth
                  ? labelWidth + 'px'
                  : item.label == ''
                  ? '0px'
                  : '120px'
              "
              :rules="item.rule"
              :label="item.label"
              :prop="item.prop"
              :class="item.class"
              v-show="item.show == 'false' ? false : true"
            >
              <template #label v-if="item.type == 'title'">
                <h4
                  :class="item.titleClass ? item.titleClass : 'txt-highlight'"
                >
                  {{ item.label }}
                </h4>
              </template>
              <template v-if="item.type == 'desc'">
                <template v-if="item.options && item.options.length">
                  {{ fieldsData[item.prop] | filterData(item.options) }}
                </template>
                <template v-else>
                  {{ fieldsData[item.prop] || "暂无" }}
                </template>
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
                  :readonly="item.readonly"
                  :type="item.type"
                  @blur="item.blur ? item.blur(fieldsData[item.prop]) : ''"
                  @input="
                    item.input ? item.input(fieldsData[item.prop]) : () => {}
                  "
                  :maxlength="item.maxlength"
                  :show-word-limit="!!item.maxlength"
                  :rows="item.rows || 4"
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

              <template v-if="item.type == 'select'">
                <el-select
                  clearable
                  :filterable="true"
                  v-if="!item.readonly"
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                  :multiple="item.multiple"
                  :collapse-tags="item.collapse ? item.collapse : false"
                  :placeholder="item.placeholder"
                  :multiple-limit="item.multipleLimit || 0"
                  @change="change(item, index, 'change')"
                  style="width: 100%"
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
              <template v-if="item.type == 'selectGroup'">
                <el-select
                  clearable
                  :filterable="true"
                  v-if="!item.readonly"
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                  :multiple="item.multiple"
                  :collapse-tags="item.collapse ? item.collapse : false"
                  :placeholder="item.placeholder"
                  @change="change(item, index, 'change')"
                >
                  <el-option-group
                    v-for="group in item.options"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="(k, i) in group.options"
                      :key="i"
                      :disabled="k.disabled"
                      :value-id="k.id"
                      :label="k.label"
                      :value="k.value"
                      v-show="!k.hidden"
                    />
                  </el-option-group>
                </el-select>
                <el-input
                  v-else
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                  :readonly="item.readonly"
                ></el-input>
              </template>
              <template v-if="item.type == 'selectIcon'">
                <select-icon v-model="fieldsData[item.prop]"></select-icon>
              </template>
              <template v-if="item.type == 'inputNumber'">
                <el-input-number
                  :disabled="item.disabled"
                  v-model="fieldsData[item.prop]"
                  :min="item.min || 0"
                  :step="item.step || 10"
                  :max="item.max || 100"
                ></el-input-number>
                {{ item.unit }}
              </template>
              <template v-if="item.type == 'time'">
                <el-time-picker
                  v-model="fieldsData[item.prop]"
                ></el-time-picker>
              </template>
              <template v-if="item.type == 'tree'">
                <el-select
                  clearable
                  v-if="!item.readonly"
                  v-model="fieldsData[item.prop]"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder"
                  @change="change(item, index, 'change')"
                  popper-class="tree-select"
                  ref="selectTree"
                  style="width: 100%"
                >
                  <el-option
                    :value="item.treeValue"
                    :label="item.treeLabel"
                    :key="item.treeValue"
                    style="height: auto"
                  >
                    <el-tree
                      v-if="item.loadNode"
                      :default-expand-all="
                        item.expandAll ? item.expandAll : false
                      "
                      :node-key="item.nodeKey ? item.nodeKey : 'id'"
                      :default-expanded-keys="
                        item.expandedKeys ? item.expandedKeys : []
                      "
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
                    <el-tree
                      v-else
                      ref="tree"
                      :data="item.treeData"
                      highlight-current
                      :node-key="item.nodeKey ? item.nodeKey : 'id'"
                      default-expand-all
                      :expand-on-click-node="false"
                      :props="item.defaultProps"
                      @check-change="handleCheckChange(item)"
                      @node-click="
                        (node) => {
                          handleNodeClick(node, item);
                        }
                      "
                    >
                    </el-tree>
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
              <template v-if="item.type == 'checkbox'">
                <template v-if="item.options && item.options.length">
                  <el-checkbox
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
                  :props="item.optProps"
                  :placeholder="item.placeholder"
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
                <template
                  v-if="item.options && item.options.length"
                  :class="item.class ? item.class : ''"
                >
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
                  @change="change(item, index, 'change')"
                ></el-date-picker>
              </template>
              <template
                v-if="item.type == 'daterange' || item.type == 'datetimerange'"
              >
                <el-date-picker
                  :type="item.type"
                  :editable="false"
                  :value-format="
                    item.formate ? item.formate : 'yyyy-MM-dd HH:mm:ss'
                  "
                  :format="item.format"
                  :picker-options="expireTimeOption(item.disabledDate)"
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
                  unlink-panels
                ></el-date-picker>
              </template>
              <template v-if="item.type == 'timerange'">
                <el-time-picker
                  is-range
                  v-model="fieldsData[item.prop]"
                  range-separator="至"
                  start-placeholder="开始"
                  end-placeholder="结束"
                  placeholder="选择时间范围"
                >
                </el-time-picker>
              </template>
              <template v-if="item.type == 'files'">
                <files
                  v-model="fieldsData[item.prop]"
                  :file-type="item.fileType || 'file'"
                  :size="item.size"
                  :limit="item.limit"
                  :file-types="item.fileTypes"
                  :placeholder="item.placeholder"
                  :moduleId="item.moduleId"
                  :disabled="item.disabled"
                />
              </template>
              <template v-if="item.type == 'images'">
                <files
                  v-model="fieldsData[item.prop]"
                  :file-type="'image'"
                  :business-id="item.businessId"
                  :size="item.size"
                  :limit="item.limit"
                  :file-types="item.fileTypes"
                  :moduleId="item.moduleId"
                  :disabled="item.disabled"
                />
              </template>
              <template v-if="item.type == 'image'">
                <div :key="key" class="image">
                  <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="
                      (file, fileList) => onChange(file, fileList, item)
                    "
                    action=""
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
                        style="width: 140px; height: 100px"
                        :placeholder="require('@p/static/imgs/no_pic.jpg')"
                        :fileid="item.oFid"
                        fit="fill"
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
                    disabled
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
                  v-if="!item.disabled"
                  ref="upload"
                  class="upload-demo"
                  :on-change="
                    (file, fileList) => onChangeFile(file, fileList, item)
                  "
                  :on-preview="handlePreview"
                  :on-remove="
                    (file, fileList) => handleRemove(file, fileList, item)
                  "
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :file-list="item.fileList"
                  :auto-upload="false"
                  :on-error="onErr"
                  :on-success="onSuccess"
                >
                  <el-button size="small" type="primary">选择文件</el-button>
                </el-upload>
                <div v-else>
                  <file-table
                    v-if="item.fileList"
                    :files="item.fileList"
                  ></file-table>
                  <!-- <file-list
                    v-if="item.oFiles"
                    :props-files="item.oFiles"
                    :url="item.prevUrl"
                    :down-url="item.downUrl"
                  ></file-list> -->
                  <!-- <ul class="el-upload-list">
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
                  </ul> -->
                </div>
                <p
                  class="txt-danger"
                  style="font-size: 10px; line-height: 18px"
                  v-if="item.tip"
                >
                  ({{ item.tip }})
                </p>
              </template>
              <template v-if="item.type == 'xyzybj'">
                <v-xyzybj-select
                  :init-xy="item.xyId"
                  :init-zy="item.zyId"
                  :init-bj="item.bjid"
                  :njs="item.njs"
                  :layout="item.layout"
                  :xy-disabled="item.xyDisabled"
                  :xy-holder="item.xyHolder"
                  :zy-holder="item.zyHolder"
                  :bj-holder="item.bjHolder"
                  :hasName="true"
                  :gutter="item.gutter"
                  :label-show="item.labelShow"
                  v-model="fieldsData"
                ></v-xyzybj-select>
              </template>
              <template v-if="item.type == 'xyzybj2'">
                <v-xyzybj-selects
                  :init-xy="item.xyId"
                  :init-zy="item.zyId"
                  :init-bj="item.bjId"
                  :njs="item.njs"
                  :layout="item.layout"
                  :xy-disabled="item.xyDisabled"
                  :xy-holder="item.xyHolder"
                  :zy-holder="item.zyHolder"
                  :bj-holder="item.bjHolder"
                  :has-name="true"
                  :has-nj="item.hasNj ? true : false"
                  :auto-bj="
                    item.autoBj && item.autoBj == 'false' ? false : true
                  "
                  :auto-zy="
                    item.autoZy && item.autoZy == 'false' ? false : true
                  "
                  :gutter="item.gutter"
                  :label-show="item.labelShow"
                  v-model="fieldsData"
                ></v-xyzybj-selects>
              </template>
              <template v-if="item.type == 'xyzybj3'">
                <v-xyzybj-select3
                  :init-xy="item.xyId"
                  :init-zy="item.zyId"
                  :init-bj="item.bjid"
                  :njs="item.njs"
                  :layout="item.layout"
                  :xy-disabled="item.xyDisabled"
                  :xy-holder="item.xyHolder"
                  :zy-holder="item.zyHolder"
                  :bj-holder="item.bjHolder"
                  :hasName="true"
                  :gutter="item.gutter"
                  :label-show="item.labelShow"
                  v-model="fieldsData"
                ></v-xyzybj-select3>
              </template>
              <template v-if="item.type == 'xyzybj4'">
                <v-xyzybj-select4
                  :init-xy="item.xyId"
                  :init-zy="item.zyId"
                  :init-bj="item.bjid"
                  :njs="item.njs"
                  :layout="item.layout"
                  :xy-disabled="item.xyDisabled"
                  :xy-holder="item.xyHolder"
                  :zy-holder="item.zyHolder"
                  :bj-holder="item.bjHolder"
                  :hasName="true"
                  :gutter="item.gutter"
                  :label-show="item.labelShow"
                  v-model="fieldsData"
                ></v-xyzybj-select4>
              </template>
              <template v-if="item.type == 'plan'">
                <el-progress
                  :percentage="fieldsData[item.prop]"
                  text-inside
                  type="line"
                  :stroke-width="25"
                ></el-progress>
              </template>
              <template v-if="item.type == 'userSelector'">
                <user-selector
                  v-model="fieldsData[item.prop]"
                  :userxms="fieldsData.userxms"
                  :queryDeptlist="item.queryDeptlist"
                  :queryUserlist="item.queryUserlist"
                  @setValue="setValue"
                ></user-selector>
              </template>
              <template v-if="item.type == 'scoreSteps'">
                <score-steps
                  v-model="fieldsData[item.prop]"
                  :models="item.models"
                  :calctype="fieldsData.calctype"
                  @setValue="setValue"
                ></score-steps>
              </template>
              <template v-if="item.type == 'tinymce'">
                <tinymce
                  ref="editor"
                  height="400"
                  v-model="fieldsData[item.prop]"
                ></tinymce>
              </template>
              <template v-if="item.type == 'tinymceDesc'">
                <iframe
                  class="iframe"
                  :src="'data:text/html;charset=utf-8,' + fieldsData[item.prop]"
                  frameborder="0"
                ></iframe>
              </template>

              <template v-if="item.type == 'render'">
                <v-render :render="item.render" />
              </template>
              <template v-if="item.type == 'slot'">
                <slot :name="item.slot" />
              </template>
              <div class="el-form-item__error" v-if="item.tip">
                {{ item.tip }}
              </div>
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
import userSelector from "./userSelector";
import selectIcon from "_c/selectIcon/";
import tinymce from "_c/tinymce";
import { delFile } from "@/api/pFile";
import files from "./files";

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
    userSelector,
    selectIcon,
    tinymce,
    files,
  },
  props: {
    labelPosition: {
      type: String,
      default: "right",
    },
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    filterData(value, options = [], defaultValue = "暂无") {
      if (Array.isArray(value)) {
        const opts = options.filter((item) => {
          return value.indexOf(item.value) > -1;
        });
        if (opts.length) return opts.map((v) => v.label).join(",");
      } else {
        const opt = options.find((item) => item.value == value);
        if (opt) return opt.label;
      }
      return defaultValue;
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
      if (file.fileId) {
        delFile({ fileId: file.fileId }).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
          }
        });
      }
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
        if (e.show != "false") {
          if (e.wrap) {
            this.mapFields.push(arr);
            arr = [];
          }
          arr.push(e);
        }
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
      if (item.defaultProps && item.defaultProps.chooseLeaf) {
        if (!node.isLeaf) {
          this.toast(item.defaultProps.msg, "warning");
          return;
        }
      }
      item.treeValue = node[item.defaultProps.value];
      item.treeLabel = node[item.defaultProps.label];
      this.$refs.selectTree[0].blur();
      this.$set(this.fieldsData, item.prop, node[item.defaultProps.value]);
      if (item.handleClick) {
        item.handleClick(node);
      }
    },
    getVal(item) {
      if (item.selectData && item.selectData.length) {
        for (const da of item.selectData) {
          if (da.value == this.fieldsData[item.prop]) {
            return da.label;
          }
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
        if (item.selectData && item.selectData.length) {
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
    setValue(v) {
      this.fieldsData = Object.assign(this.fieldsData, v);
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
.iframe {
  width: 100%;
  min-height: 320px;
}
</style>
<style lang="scss">
.el-range-separator {
  width: 30px !important;
}
</style>
