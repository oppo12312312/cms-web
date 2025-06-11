<template>
  <div>
    <el-card shadow="never" class="fn-mb15">
      <div slot="header" class="clearfix">
        <span class="txt-bold">{{ title }}信息</span>
      </div>
      <v-form ref="ruleForm" :fields="fields" :fieldsData="ruleForm"> </v-form>
    </el-card>
    <el-card shadow="never" v-if="show && !patchData.aptId">
      <div slot="header" class="clearfix">
        <span class="txt-bold">批量添加房间信息</span>
      </div>
      <v-form :fields="fields1" :fieldsData="ruleForm.dto"> </v-form>
    </el-card>
  </div>
</template>
<script>
import { getDefultId } from "@/projects/hbmu-suguan/api/sgApt";
import formMinxin from "_c/forms/minxins/formMinxin.js";

export default {
  mixins: [formMinxin],
  props: {
    patchData: Object,
    title: String,
  },
  data() {
    return {
      ruleForm: {},
      fields: [],
      fields1: [
        {
          label: "床位数：",
          prop: "bedTotal",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: `请输入床位数`,
              trigger: "blur",
            },
            {
              validator: this.validatorCount,
              message: `请输入1-99数字`,
              trigger: "blur",
            },
          ],
        },
        {
          label: "性别：",
          prop: "roomSex",
          type: "radio",
          span: 12,
          options: [
            {
              label: "男",
              value: "男",
            },
            {
              label: "女",
              value: "女",
            },
          ],
        },
        {
          label: "收费标准：",
          prop: "charge",
          type: "text",
          span: 12,
          rule: [
            {
              required: true,
              message: `请输入收费标准`,
              trigger: "blur",
            },
            {
              validator: this.validatorZzs,
              message: `请输入正整数`,
              trigger: "blur",
            },
          ],
        },
        {
          label: "房间押金：",
          prop: "fjyj",
          type: "text",
          span: 12,
        },
        {
          label: "空调房：",
          prop: "airConditioner",
          type: "radio",
          span: 12,
          options: [
            {
              label: "是",
              value: "是",
            },
            {
              label: "否",
              value: "否",
            },
          ],
        },
        {
          label: "空调租金：",
          prop: "ktzj",
          type: "text",
          span: 12,
        },
        {
          label: "公用房间：",
          prop: "gyfj",
          type: "radio",
          span: 12,
          options: [
            {
              label: "是",
              value: "是",
            },
            {
              label: "否",
              value: "否",
            },
          ],
        },
        {
          label: "寒署假留宿：",
          prop: "hsjls",
          type: "radio",
          span: 12,
          options: [
            {
              label: "是",
              value: "是",
            },
            {
              label: "否",
              value: "否",
            },
          ],
        },
      ],
      rules: {
        qjlx: [{ required: true, message: `请选择请假类型`, trigger: "blur" }],
        dateTime: [
          { required: true, message: `请选择请假时间`, trigger: "blur" },
        ],
        qjyy: [
          { required: true, message: `请选输入请假原因`, trigger: "blur" },
        ],
      },
      show: true,
    };
  },
  created() {
    this.init();
  },
  watch: {
    patchData: function () {
      this.init(this.patchData);
    },
  },
  methods: {
    validatorCount(rule, value, callback) {
      const reg = /^[1-9][0-9]{0,1}$/;
      if (value) {
        if (reg.test(value) == false) {
          callback(new Error("请填写1-99的数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    init() {
      let code = "";
      const query = {};
      query.aptId = this.patchData.currentNode.aptId;
      query.aptLevel = this.patchData.aptId
        ? this.patchData.currentNode.parent.data.aptLevel
        : this.patchData.currentNode.aptLevel;
      query.nextLevel = this.patchData.nextLevel;
      if (!this.patchData.aptId) {
        getDefultId(query).then((data) => {
          code = data.data;
          if (this.patchData.isSpect) {
            this.setForm(query.nextLevel, code);
          } else {
            this.setForm(query.aptLevel, code);
          }
        });
      } else {
        this.setForm(query.aptLevel, "");
      }
    },
    setForm(level, code) {
      let form = {};
      let fields = [];
      const isEdit = this.patchData.aptId ? true : false;
      if (this.patchData.isSpect) {
        switch (level) {
          case "apartment":
            form = {
              apartmentId: isEdit ? this.patchData.currentNode.aptId : code,
              apartmentCode: isEdit ? this.patchData.currentNode.aptCode : code,
              apartmentName: isEdit ? this.patchData.currentNode.aptName : "",
              floorCount: isEdit ? this.patchData.currentNode.floorCount : "",
              unitCount: isEdit ? this.patchData.currentNode.unitCount : "",
              roomCount: isEdit ? this.patchData.currentNode.roomCount : "",
              jgrq: isEdit ? this.patchData.currentNode.jgrq : "",
              remark: isEdit ? this.patchData.currentNode.remark : "",
              files: "",
              dto: {
                bedTotal: "",
              },
            };
            switch (this.patchData.currentNode.aptLevel) {
              case "campus":
                form.campusId = this.patchData.currentNode.aptId;
                form.campusCode = this.patchData.currentNode.aptCode;
                form.campusName = this.patchData.currentNode.aptName;

                break;
              case "zone":
                form.zoneId = this.patchData.currentNode.aptId;
                form.zoneCode = this.patchData.currentNode.aptCode;
                form.zoneName = this.patchData.currentNode.aptName;
                break;
              default:
                form.aptLevel = "top";
                break;
            }
            fields = [
              {
                label: "编号：",
                prop: "apartmentCode",
                type: "text",
                span: 12,
                disabled: true,
              },
              {
                label: "名称：",
                prop: "apartmentName",
                type: "text",
                span: 12,
                rule: [
                  {
                    required: true,
                    message: `请输入公寓名称`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "竣工日期：",
                prop: "jgrq",
                type: "text",
                span: 12,
              },
              {
                label: "单元数：",
                prop: "unitCount",
                type: "text",
                show: isEdit ? "false" : "true",
                span: 12,
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入单元数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "楼层数：",
                prop: "floorCount",
                type: "text",
                span: 12,
                show: isEdit ? "false" : "true",
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入楼层数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "每层房间数：",
                prop: "roomCount",
                type: "text",
                span: 12,
                show: isEdit ? "false" : "true",
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入房间数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "备注：",
                prop: "remark",
                type: "textarea",
              },
              {
                label: "图片：",
                prop: "files",
                type: "image",
                oFid:
                  this.patchData.files && this.patchData.files.length
                    ? this.patchData.files[0].fileId
                    : "",
              },
            ];
            break;
          case "unit":
            form = {
              apartmentId: isEdit
                ? this.patchData.currentNode.parent.data.aptId
                : this.patchData.currentNode.aptId,
              apartmentCode: isEdit
                ? this.patchData.currentNode.parent.data.aptCode
                : this.patchData.currentNode.aptCode,
              apartmentName: isEdit
                ? this.patchData.currentNode.parent.data.aptName
                : this.patchData.currentNode.aptName,
              unitId: isEdit ? this.patchData.currentNode.aptId : code,
              unitCode: isEdit ? this.patchData.currentNode.aptCode : code,
              unitName: isEdit ? this.patchData.currentNode.aptName : "",
              floorCount: isEdit ? this.patchData.currentNode.floorCount : "",
              roomCount: isEdit ? this.patchData.currentNode.roomCount : "",
              remark: isEdit ? this.patchData.currentNode.remark : "",
              files: "",
            };
            fields = [
              {
                label: "编号：",
                prop: "unitCode",
                type: "text",
                span: 12,
                disabled: true,
              },
              {
                label: "名称：",
                prop: "unitName",
                type: "text",
                span: 12,
                rule: [
                  {
                    required: true,
                    message: `请输入单元名称`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "楼层数：",
                prop: "floorCount",
                type: "text",
                show: isEdit ? "false" : "true",
                span: 12,
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入楼层数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "每层房间数：",
                prop: "roomCount",
                show: isEdit ? "false" : "true",
                type: "text",
                span: 12,
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入房间数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "备注：",
                prop: "remark",
                type: "textarea",
              },
              {
                label: "图片：",
                prop: "files",
                type: "image",
                oFid:
                  this.patchData.files && this.patchData.files.length
                    ? this.patchData.files[0].fileId
                    : "",
              },
            ];
            break;
          case "floor":
            form = {
              floorId: isEdit
                ? this.patchData.currentNode.parent.data.aptId
                : code,
              floorCode: isEdit
                ? this.patchData.currentNode.parent.data.aptCode
                : code,
              floorName: isEdit
                ? this.patchData.currentNode.parent.data.aptName
                : "",
              floorCount: isEdit ? this.patchData.currentNode.floorCount : "",
              roomCount: isEdit ? this.patchData.currentNode.roomCount : "",
              remark: isEdit ? this.patchData.currentNode.remark : "",
              files: "",
              dto: {
                bedTotal: "",
                charge: "",
                roomSex: "男",
                airConditioner: "",
                fjyj: "",
                ktzj: "",
                ktzj: "",
                gyfj: "",
                hsjls: "",
              },
            };
            switch (this.patchData.currentNode.aptLevel) {
              case "unit":
                form.unitId = this.patchData.currentNode.aptId;
                form.unitCode = this.patchData.currentNode.aptCode;
                form.unitName = this.patchData.currentNode.aptName;

                break;
              case "apartment":
                form.apartmentId = this.patchData.currentNode.aptId;
                form.apartmentCode = this.patchData.currentNode.aptCode;
                form.apartmentName = this.patchData.currentNode.aptName;

                break;
            }
            fields = [
              {
                label: "编号：",
                prop: "floorCode",
                type: "text",
                span: 12,
                disabled: true,
              },
              {
                label: "名称：",
                prop: "floorName",
                type: "text",
                span: 12,
                rule: [
                  {
                    required: true,
                    message: `请输入楼层名称`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "每层房间数：",
                prop: "roomCount",
                type: "text",
                show: isEdit ? "false" : "true",
                span: 12,
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入房间数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "备注：",
                prop: "remark",
                type: "textarea",
              },
              {
                label: "图片：",
                prop: "files",
                type: "image",
                oFid:
                  this.patchData.files && this.patchData.files.length
                    ? this.patchData.files[0].fileId
                    : "",
              },
            ];

            break;
        }
      } else {
        switch (level) {
          case "zone":
            form = {
              zoneId: isEdit
                ? this.patchData.currentNode.parent.data.aptId
                : this.patchData.currentNode.aptId,
              zoneCode: isEdit
                ? this.patchData.currentNode.parent.data.aptCode
                : this.patchData.currentNode.aptCode,
              zoneName: isEdit
                ? this.patchData.currentNode.parent.data.aptName
                : this.patchData.currentNode.aptName,
              apartmentId: isEdit ? this.patchData.currentNode.aptId : code,
              apartmentCode: isEdit ? this.patchData.currentNode.aptCode : code,
              apartmentName: isEdit ? this.patchData.currentNode.aptName : "",
              floorCount: isEdit ? this.patchData.currentNode.floorCount : "",
              unitCount: isEdit ? this.patchData.currentNode.unitCount : "",
              roomCount: isEdit ? this.patchData.currentNode.roomCount : "",
              jgrq: isEdit ? this.patchData.currentNode.jgrq : "",
              remark: isEdit ? this.patchData.currentNode.remark : "",
              files: "",
              // dto: {
              //   bedTotal: ''
              // }
            };
            fields = [
              {
                label: "编号：",
                prop: "apartmentCode",
                type: "text",
                span: 12,
                disabled: true,
              },
              {
                label: "名称：",
                prop: "apartmentName",
                type: "text",
                span: 12,
                rule: [
                  {
                    required: true,
                    message: `请输入公寓名称`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "竣工日期：",
                prop: "jgrq",
                type: "text",
                span: 12,
              },
              {
                label: "单元数：",
                prop: "unitCount",
                type: "text",
                show: isEdit ? "false" : "true",
                span: 12,
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入单元数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "楼层数：",
                prop: "floorCount",
                type: "text",
                span: 12,
                show: isEdit ? "false" : "true",
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入楼层数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "每层房间数：",
                prop: "roomCount",
                type: "text",
                span: 12,
                show: isEdit ? "false" : "true",
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入房间数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "备注：",
                prop: "remark",
                type: "textarea",
              },
              {
                label: "图片：",
                prop: "files",
                type: "image",
                oFid:
                  this.patchData.files && this.patchData.files.length
                    ? this.patchData.files[0].fileId
                    : "",
              },
            ];
            break;
          case "apartment":
            form = {
              apartmentId: isEdit
                ? this.patchData.currentNode.parent.data.aptId
                : this.patchData.currentNode.aptId,
              apartmentCode: isEdit
                ? this.patchData.currentNode.parent.data.aptCode
                : this.patchData.currentNode.aptCode,
              apartmentName: isEdit
                ? this.patchData.currentNode.parent.data.aptName
                : this.patchData.currentNode.aptName,
              unitId: isEdit ? this.patchData.currentNode.aptId : code,
              unitCode: isEdit ? this.patchData.currentNode.aptCode : code,
              unitName: isEdit ? this.patchData.currentNode.aptName : "",
              floorCount: isEdit ? this.patchData.currentNode.floorCount : "",
              roomCount: isEdit ? this.patchData.currentNode.roomCount : "",
              remark: isEdit ? this.patchData.currentNode.remark : "",
              files: "",
            };
            fields = [
              {
                label: "编号：",
                prop: "unitCode",
                type: "text",
                span: 12,
                disabled: true,
              },
              {
                label: "名称：",
                prop: "unitName",
                type: "text",
                span: 12,
                rule: [
                  {
                    required: true,
                    message: `请输入单元名称`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "楼层数：",
                prop: "floorCount",
                type: "text",
                show: isEdit ? "false" : "true",
                span: 12,
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入楼层数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "每层房间数：",
                prop: "roomCount",
                show: isEdit ? "false" : "true",
                type: "text",
                span: 12,
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入房间数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "备注：",
                prop: "remark",
                type: "textarea",
              },
              {
                label: "图片：",
                prop: "files",
                type: "image",
                oFid:
                  this.patchData.files && this.patchData.files.length
                    ? this.patchData.files[0].fileId
                    : "",
              },
            ];
            break;
          case "unit":
            form = {
              unitId: isEdit
                ? this.patchData.currentNode.parent.data.aptId
                : this.patchData.currentNode.aptId,
              unitCode: isEdit
                ? this.patchData.currentNode.parent.data.aptCode
                : this.patchData.currentNode.aptCode,
              unitName: isEdit
                ? this.patchData.currentNode.parent.data.aptName
                : this.patchData.currentNode.aptName,
              floorId: isEdit ? this.patchData.currentNode.aptId : code,
              floorCode: isEdit ? this.patchData.currentNode.aptCode : code,
              floorName: isEdit ? this.patchData.currentNode.aptName : "",
              roomCount: isEdit ? this.patchData.currentNode.roomCount : "",
              remark: isEdit ? this.patchData.currentNode.remark : "",
              files: "",
            };
            fields = [
              {
                label: "编号：",
                prop: "floorCode",
                type: "text",
                span: 12,
                disabled: true,
              },
              {
                label: "名称：",
                prop: "floorName",
                type: "text",
                span: 12,
                rule: [
                  {
                    required: true,
                    message: `请输入楼层名称`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "每层房间数：",
                prop: "roomCount",
                type: "text",
                show: isEdit ? "false" : "true",
                span: 12,
                rule: [
                  {
                    required: isEdit ? false : true,
                    message: `请输入房间数`,
                    trigger: "blur",
                  },
                  {
                    validator: this.validatorCount,
                    message: `请输入1-99数字`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "备注：",
                prop: "remark",
                type: "textarea",
              },
              {
                label: "图片：",
                prop: "files",
                type: "image",
                oFid:
                  this.patchData.files && this.patchData.files.length
                    ? this.patchData.files[0].fileId
                    : "",
              },
            ];
            break;
          case "floor":
            form = {
              floorId: isEdit
                ? this.patchData.currentNode.parent.data.aptId
                : this.patchData.currentNode.aptId,
              floorCode: isEdit
                ? this.patchData.currentNode.parent.data.aptCode
                : this.patchData.currentNode.aptCode,
              floorName: isEdit
                ? this.patchData.currentNode.parent.data.aptName
                : this.patchData.currentNode.aptName,
              roomId: isEdit ? this.patchData.currentNode.aptId : code,
              roomCode: isEdit ? this.patchData.currentNode.aptCode : code,
              roomName: isEdit ? this.patchData.currentNode.aptName : "",
              roomCount: isEdit ? this.patchData.currentNode.roomCount : "",
              remark: isEdit ? this.patchData.currentNode.remark : "",
              files: "",
              bedTotal: isEdit
                ? this.patchData.currentNode.roomInfo.bedTotal
                : "",
              charge: isEdit ? this.patchData.currentNode.roomInfo.charge : "",
              roomSex: isEdit
                ? this.patchData.currentNode.roomInfo.roomSex
                : "",
              airConditioner: isEdit
                ? this.patchData.currentNode.roomInfo.airConditioner
                : "",
              fjyj: isEdit ? this.patchData.currentNode.roomInfo.fjyj : "",
              ktzj: isEdit ? this.patchData.currentNode.roomInfo.ktzj : "",
              gyfj: isEdit ? this.patchData.currentNode.roomInfo.gyfj : "",
              hsjls: isEdit ? this.patchData.currentNode.roomInfo.hsjls : "",
            };
            fields = [
              {
                label: "编号：",
                prop: "roomCode",
                type: "text",
                span: 12,
                disabled: true,
              },
              {
                label: "名称：",
                prop: "roomName",
                type: "text",
                span: 12,
                rule: [
                  {
                    required: true,
                    message: `请输入房间名称`,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "图片：",
                prop: "files",
                type: "image",
                oFid:
                  this.patchData.files && this.patchData.files.length
                    ? this.patchData.files[0].fileId
                    : "",
              },
            ].concat(this.fields1);
            this.show = false;
            break;
        }
      }
      form.aptLevel = this.patchData.aptLevel;
      this.$set(this, "ruleForm", form);
      if (level != "floor") {
        this.$set(this.ruleForm, "dto", {
          bedTotal: "",
          charge: "",
          roomSex: "男",
          airConditioner: "",
          fjyj: "",
          ktzj: "",
          ktzj: "",
          gyfj: "",
          hsjls: "",
        });
      }
      this.$set(this, "fields", fields);
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
