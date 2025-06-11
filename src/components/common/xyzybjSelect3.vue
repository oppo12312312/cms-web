<template>
  <div class="flex">
    <el-row
      style="flex: 1"
      :gutter="gutter"
      class="xyzybj-wrapper"
      v-if="this.labelShow == 'false'"
    >
      <el-col
        :xs="12"
        :sm="mdComputed"
        :md="mdComputed"
        v-if="this.layout.indexOf('xy') > -1"
      >
        <el-select
          filterable
          style="width: 100%"
          v-model="params.xyId"
          :placeholder="xyHolder"
          clearable
          :disabled="xyDisabled"
        >
          <el-option
            v-for="item in xueyuanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col
        :xs="12"
        :sm="mdComputed"
        :md="mdComputed"
        v-if="this.layout.indexOf('zy') > -1"
      >
        <el-select
          filterable
          style="width: 100%"
          v-model="params.zyId"
          :placeholder="zyHolder"
          clearable
        >
          <el-option
            v-for="item in majorsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col
        :xs="12"
        :sm="mdComputed"
        :md="mdComputed"
        v-if="this.layout.indexOf('bj') > -1"
      >
        <el-select
          filterable
          style="width: 100%"
          v-model="params.bjid"
          :placeholder="bjHolder"
          clearable
        >
          <el-option
            v-for="item in classesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row
      :gutter="gutter"
      class="xyzybj-label-wrapper"
      v-if="this.labelShow == 'true'"
    >
      <el-col
        sty
        :sm="12"
        :md="mdComputed"
        v-if="this.layout.indexOf('xy') > -1"
      >
        <el-form-item label="学院：">
          <el-select clearable :disabled="xyDisabled" v-model="params.xyId">
            <el-option
              v-for="item in xueyuanOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="mdComputed" v-if="this.layout.indexOf('zy') > -1">
        <el-form-item label="专业：">
          <el-select clearable :disabled="disabled" v-model="params.zyId">
            <el-option
              v-for="item in majorsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :sm="12" :md="mdComputed" v-if="this.layout.indexOf('bj') > -1">
        <el-form-item label="班级：">
          <el-select clearable :disabled="disabled" v-model="params.bjid">
            <el-option
              v-for="item in classesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getXueyuanOptions3,
  getMajorsOptions,
  getClassesOptions,
  getOptTxt,
} from "@/filters/options";

import { getMajors, getClasses } from "@/api/common";

export default {
  model: {
    prop: "selObj",
    event: "selChange",
  },
  props: {
    selObj: Object,
    njs: String,
    layout: {
      type: Array,
      default: () => ["xy", "zy", "bj"],
    },
    xyId: {
      type: String,
    },
    zyId: {
      type: String,
    },
    initXy: String,
    initZy: String,
    initBj: String,
    xyHolder: { type: String, default: "请选择学院" },
    zyHolder: { type: String, default: "请选择专业" },
    bjHolder: { type: String, default: "请选择班级" },
    labelShow: {
      type: String,
      default: "false",
    },
    gutter: {
      type: Number,
      default: 15,
    },
    hasName: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    xyDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      params: {
        xyId: this.initXy || "",
        zyId: this.initZy || "",
        bjid: this.initBj || "",
      },
      xueyuanOptions: [],
      majorsOptions: [],
      oMajorsOptions: [],
      classesOptions: [],
      oClassesOptions: [],
    };
  },
  created() {
    this.init();
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    mdComputed: function () {
      switch (this.layout.length) {
        case 1:
          return 24;
        case 2:
          return 12;
        case 3:
          return 8;
      }
    },
  },
  watch: {
    initXy: function (val) {
      this.$set(this.params, "xyId", val);
    },
    initZy: function (val) {
      this.$set(this.params, "zyId", val);
    },
    initBj: function (val) {
      this.$set(this.params, "bjid", val);
    },
    selObj: function () {
      if (this.xyId || this.zyId || this.bjid) {
        this.params.xyId = this.selObj[this.xyId] || "";
        this.params.zyId = this.selObj[this.zyId] || "";
        this.params.bjid = this.selObj[this.bjid] || "";
      } else {
        this.params.xyId = this.selObj.xyId || "";
        this.params.zyId = this.selObj.zyId || "";
        this.params.bjid = this.selObj.bjid || "";
      }
    },
    "params.xyId": function (nval, oval) {
      const me = this;
      const majorsOptions = this.copy(this.oMajorsOptions);
      const classesOptions = this.copy(this.oClassesOptions);
      if (this.layout.indexOf("zy") > -1) {
        this.getMajorsOptions(this.params.xyId).then((data) => {
          this.majorsOptions = data;
          this.oMajorsOptions = data;
        });
      }
      if (this.layout.indexOf("zy") <= -1 && this.layout.indexOf("bj") > -1) {
        this.getClassesOptions(
          this.params.xyId,
          this.params.zyId,
          this.njs
        ).then((data) => {
          this.classesOptions = data;
          this.oClassesOptions = data;
        });
      }
      if (oval) {
        this.$set(this.params, "zyId", "");
        this.$set(this.params, "bjid", "");
      }
      if (this.xueyuanOptions.length) {
        if (this.hasName) {
          this.$set(
            this.selObj,
            "xy",
            this.params.xyId
              ? getOptTxt(this.xueyuanOptions, this.params.xyId)
              : ""
          );
        }
      }

      this.emit();
    },
    "params.zyId": function (nval, oval) {
      const me = this;
      const classesOptions = this.copy(this.oClassesOptions);
      if (this.layout.indexOf("bj") > -1) {
        this.getClassesOptions(
          this.params.xyId,
          this.params.zyId,
          this.njs
        ).then((data) => {
          this.classesOptions = data;
          this.oClassesOptions = data;
        });
      }
      if (oval) {
        this.$set(this.params, "bjid", "");
        /* this.classesOptions = classesOptions.filter((c) => {
          return c.zyId == val
        }) */
      }
      if (this.oMajorsOptions.length) {
        if (this.hasName) {
          this.$set(
            this.selObj,
            "zy",
            this.params.zyId
              ? getOptTxt(this.oMajorsOptions, this.params.zyId)
              : ""
          );
        }
      }

      this.emit();
    },
    "params.bjid": function (val) {
      if (this.oClassesOptions.length) {
        if (this.hasName) {
          this.$set(
            this.selObj,
            "bjmc",
            this.params.bjid
              ? getOptTxt(this.oClassesOptions, this.params.bjid)
              : ""
          );
        }
      }

      this.emit();
    },
  },
  methods: {
    init() {
      if (this.layout.indexOf("xy") > -1) {
        if (!this.xueyuanOptions.length) {
          getXueyuanOptions3().then((data) => {
            this.xueyuanOptions = data;
          });
        }
      }
      if (this.layout.indexOf("xy") <= -1 && this.layout.indexOf("zy") > -1) {
        this.getMajorsOptions().then((data) => {
          this.majorsOptions = data;
          this.oMajorsOptions = data;
        });
      }
      if (
        this.layout.indexOf("xy") <= -1 &&
        this.layout.indexOf("zy") <= -1 &&
        this.layout.indexOf("bj") > -1
      ) {
        this.getClassesOptions(this.initXy || "", "", this.njs).then((data) => {
          this.classesOptions = data;
          this.oClassesOptions = data;
        });
      }
    },
    emit() {
      this.selObj.xyId = this.params.xyId || "";
      this.selObj.zyId = this.params.zyId || "";
      this.selObj.bjid = this.params.bjid || "";
      this.$emit("selChange", this.selObj);
    },
    getMajorsOptions(xyIds) {
      return new Promise((resolve) => {
        getMajors(xyIds || "").then((data) => {
          const opts = [];
          for (const d of data.data) {
            const opt = {
              label: d.zy,
              value: d.zyId,
              xyId: d.xyId,
            };
            opts.push(opt);
          }
          resolve(opts);
        });
      });
    },
    getClassesOptions(xyIds, zyIds, njs) {
      return new Promise((resolve) => {
        getClasses(xyIds || "", zyIds || "", njs || this.njs).then((data) => {
          const opts = [];
          for (const d of data.data) {
            const opt = {
              label: d.bjmc,
              value: d.bjid,
              xyId: d.xyId,
              zyId: d.zyId,
            };
            opts.push(opt);
          }
          resolve(opts);
        });
      });
    },
  },
};
</script>

<style lang="scss">
.xyzybj-wrapper {
  .el-col {
    margin-bottom: 0 !important;
  }
}
</style>
