<template>
  <v-form
    label-width="140"
    ref="ruleForm"
    :fields="fields"
    :fieldsData="ruleForm"
  >
    <!-- <el-col>
      <el-form-item label-width="140px" label="图标：">
        <el-image @click="$refs.saveDialog.dialogVisible = true" :src="require(`@p/static/servicefont/${ruleForm.icon}.svg`)" class="cursorPoint"></el-image>
        <el-input
          class="input"
          v-model="ruleForm.icon"
          placeholder="请选择图标"
          type="hidden"
        />
      </el-form-item>
    </el-col> -->
    <v-dialog
      ref="saveDialog"
      width="600px"
      @handleClose="saveItem"
      title="选择图标"
      :show-footer="false"
    >
      <el-row class="icons-wrap" :gutter="15">
        <el-col
          class="fn-mb15 txt-center icon-item"
          :span="4"
          v-for="icon in iconList"
          :key="icon.id"
        >
          <el-image
            @click="iconSelect(icon)"
            :src="require(`@p/static/servicefont/${icon.img}.svg`)"
            class="item-svg_50"
          ></el-image>
        </el-col>
      </el-row>
    </v-dialog>
  </v-form>
</template>
<script>
import formMinxin from "_c/forms/minxins/formMinxin.js";
import { listIcon } from "@/api/sysResource";
export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    groups: Array,
  },
  data() {
    const groups = this.copy(this.groups).splice(1);
    groups.unshift({
      label: "未分组",
      value: "0",
    });
    return {
      loading: true,
      iconList: [],
      ruleForm: {
        id: "",
        name: "",
        groupid: "",
        orderno: "",
        status: 1,
        isrecommend: 1,
        icon: "A1",
      },
      fields: [
        {
          label: "名称：",
          placeholder: "请输入名称",
          prop: "name",
          type: "text",
          rule: [
            {
              required: true,
              message: "请输入名称",
              trigger: "blur",
            },
          ],
        },
        {
          label: "分组：",
          placeholder: "请选择分组",
          prop: "groupid",
          type: "select",
          options: groups,
          disabled: this.patchData.routetype == 2 ? true : false,
          rule: [
            {
              required: true,
              message: "请选择分组",
              trigger: "blur",
            },
          ],
        },
        {
          label: "排序：",
          placeholder: "请输入排序号",
          prop: "orderno",
          type: "text",
        },
        {
          label: "是否有效：",
          prop: "status",
          type: "radio",
          options: [
            {
              label: "是",
              value: 1,
            },
            {
              label: "否",
              value: 0,
            },
          ],
        },
        {
          label: "是否推荐：",
          prop: "isrecommend",
          type: "radio",
          disabled: this.patchData.routetype == 2 ? true : false,
          options: [
            {
              label: "是",
              value: 1,
            },
            {
              label: "否",
              value: 0,
            },
          ],
        },
      ],
    };
  },
  created() {
    this.initForm(this.patchData);
    // listIcon().then((data) => {
    //   this.iconList = data.data;
    // });
  },
  watch: {
    patchData: function () {
      this.initForm(this.patchData);
    },
  },
  methods: {
    saveItem() {},
    iconSelect(icon) {
      this.ruleForm.icon = icon.img;
      this.$refs.saveDialog.close();
    },
  },
};
</script>
<style lang="scss">
.icons-wrap {
  .icon-item {
    cursor: pointer;
    .el-image__inner {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
