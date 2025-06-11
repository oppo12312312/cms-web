<template>
  <v-page>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ isStudent ? "学生信息" : "我的个人信息" }}</span>
        <el-button
          @click="exportsForm"
          v-if="isEdit"
          icon="el-icon-download"
          style="float: right"
          type="primary"
          >导出登记表</el-button
        >
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        status-icon
        ref="ruleForm"
        label-width="140px"
      >
        <el-card shadow="never" class="grey-card">
          <div slot="header" class="clearfix">
            <div>学生基本信息</div>
          </div>
          <el-row :gutter="30">
            <el-col :span="7">
              <el-form-item label="学号：" prop="xh">
                <el-input
                  type="text"
                  placeholder="请输入学号"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.xh"
                  autocomplete="off"
                  :disabled="isEdit || isStudent"
                ></el-input>
              </el-form-item>
              <el-form-item label="出生日期：" prop="csrq">
                <el-date-picker
                  v-model="ruleForm.csrq"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  :disabled="isDisabled('csrq')"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="籍贯：" prop="jg">
                <el-input
                  type="text"
                  placeholder="请输入籍贯"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.jg"
                  autocomplete="off"
                  :disabled="isDisabled('jg')"
                ></el-input>
              </el-form-item>
              <el-form-item label="身份证号：" prop="sfzh">
                <el-input
                  type="text"
                  placeholder="请输入身份证号"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.sfzh"
                  autocomplete="off"
                  :disabled="isDisabled('sfzh')"
                ></el-input>
              </el-form-item>
              <el-form-item label="户口类型：" prop="hkxz">
                <el-radio-group v-model="ruleForm.hkxz">
                  <el-radio
                    v-for="hk in hklxOpts"
                    :key="hk.label"
                    :label="hk.label"
                    :disabled="isDisabled('hkxz')"
                    >{{ hk.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="考生类别：" prop="kslb">
                <el-select
                  :disabled="isDisabled('kslb')"
                  v-model="ruleForm.kslb"
                  placeholder="考生类别"
                >
                  <el-option
                    v-for="xb in kslbOpts"
                    :key="xb.value"
                    :label="xb.label"
                    :value="xb.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="银行名称" prop="yhmc">
                <el-input
                  type="text"
                  placeholder="请输入银行名称"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.yhmc"
                  autocomplete="off"
                  :disabled="isDisabled('yhmc')"
                ></el-input>
              </el-form-item>
              <el-form-item label="是国防生：" prop="gfs">
                <el-radio-group v-model="ruleForm.gfs">
                  <el-radio
                    v-for="hk in sgfsOpts"
                    :key="hk.label"
                    :label="hk.label"
                    :disabled="isDisabled('gfs')"
                    >{{ hk.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名：" prop="xm">
                    <el-input
                      type="text"
                      placeholder="请输入姓名"
                      @keyup.enter.native="keyUpSubmit"
                      v-model="ruleForm.xm"
                      autocomplete="off"
                      :disabled="isDisabled('xm')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="民族：" prop="mz">
                    <el-select
                      :disabled="isDisabled('mz')"
                      v-model="ruleForm.mz"
                      placeholder="民族"
                    >
                      <el-option
                        v-for="xb in mzOpts"
                        :key="xb.value"
                        :label="xb.label"
                        :value="xb.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="入学年月：" prop="rxny">
                    <el-date-picker
                      :disabled="isDisabled('rxny')"
                      v-model="ruleForm.rxny"
                      format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="性别：" prop="xb">
                    <el-select
                      :disabled="isDisabled('xb')"
                      v-model="ruleForm.xb"
                      placeholder="性别"
                    >
                      <el-option
                        v-for="xb in xbOpts"
                        :key="xb.value"
                        :label="xb.label"
                        :value="xb.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="政治面貌：" prop="zzmm">
                    <el-select
                      :disabled="isDisabled('zzmm')"
                      v-model="ruleForm.zzmm"
                      placeholder="政治面貌"
                    >
                      <el-option
                        v-for="xb in zzmmOpts"
                        :key="xb.value"
                        :label="xb.label"
                        :value="xb.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="证件类型：" prop="zjlx">
                    <el-select
                      :disabled="isDisabled('zjlx')"
                      v-model="ruleForm.zjlx"
                      placeholder="证件类型"
                    >
                      <el-option
                        v-for="xb in zjlxOpts"
                        :key="xb.value"
                        :label="xb.label"
                        :value="xb.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="生源地：" prop="syd">
                    <el-cascader
                      :disabled="isDisabled('syd')"
                      v-model="ruleForm.syd"
                      @change="sydChange"
                      style="width: 100%"
                      :props="props"
                      :placeholder="
                        ruleForm.syd ? ruleForm.syd.join('/') : '请选择'
                      "
                    >
                    </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="户口所在地：" prop="hkd">
                    <el-input
                      :disabled="isDisabled('hkd')"
                      type="text"
                      placeholder="请输入户口所在地"
                      @keyup.enter.native="keyUpSubmit"
                      v-model="ruleForm.hkd"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="录取类型：" prop="lqlx">
                    <el-select
                      :disabled="isDisabled('lqlx')"
                      v-model="ruleForm.lqlx"
                      placeholder="证件类型"
                    >
                      <el-option
                        v-for="xb in lqlxOpts"
                        :key="xb.value"
                        :label="xb.label"
                        :value="xb.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="银行账号：" prop="yhzh">
                    <el-input
                      :disabled="isDisabled('yhzh')"
                      type="text"
                      placeholder="请输入银行账号"
                      @keyup.enter.native="keyUpSubmit"
                      v-model="ruleForm.yhzh"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="户口详细地址：" prop="hkszdz">
                    <el-input
                      :disabled="isDisabled('hkszdz')"
                      type="text"
                      placeholder="请输入户口详细地址"
                      @keyup.enter.native="keyUpSubmit"
                      v-model="ruleForm.hkszdz"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="考生号：" prop="ksh">
                    <el-input
                      :disabled="isDisabled('ksh')"
                      type="text"
                      placeholder="请输入考生号"
                      @keyup.enter.native="keyUpSubmit"
                      v-model="ruleForm.ksh"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="一卡通号：" prop="ykth">
                    <el-input
                      :disabled="isDisabled('ykth')"
                      type="text"
                      placeholder="请输入一卡通号"
                      @keyup.enter.native="keyUpSubmit"
                      v-model="ruleForm.ykth"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="中队信息：" prop="zdxx">
                    <el-input
                      :disabled="isDisabled('zdxx')"
                      type="text"
                      placeholder="请输入中队信息"
                      @keyup.enter.native="keyUpSubmit"
                      v-model="ruleForm.zdxx"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

            <el-col class="txt-center" style="padding: 0 10px" :span="3">
              <div>
                <v-image
                  style="width: 100px; height: 120px"
                  :placeholder="placeUrl"
                  :url="imageUrl"
                  :fileid="ruleForm.rxzp"
                ></v-image>
                <el-upload
                  v-if="!isStudent && !isShow"
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="onChange"
                >
                  <el-button icon="el-icon-upload">上传</el-button>
                </el-upload>
                <p
                  v-if="!isStudent && !isShow"
                  class="normal-sm-font fc-lightgray2 fn-mt15"
                >
                  文件大小：600KB以内图片格式：jpg、jpeg、png
                </p>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="never" class="grey-card fn-mt15">
          <div slot="header" class="clearfix">
            <div>个人联系方式</div>
          </div>
          <el-row :gutter="30">
            <el-col :span="7">
              <el-form-item label="手机号：" prop="lxdh">
                <el-input
                  :disabled="isDisabled('lxdh')"
                  type="text"
                  placeholder="请输入手机号"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.lxdh"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱：" prop="email">
                <el-input
                  :disabled="isDisabled('email')"
                  type="text"
                  placeholder="请输入邮箱"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.email"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="QQ号：" prop="qqh">
                <el-input
                  :disabled="isDisabled('qqh')"
                  type="text"
                  placeholder="请输入QQ号"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.qqh"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="微信号：" prop="wxh">
                <el-input
                  :disabled="isDisabled('wxh')"
                  type="text"
                  placeholder="请输入微信号"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.wxh"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="never" class="grey-card fn-mt15">
          <div slot="header" class="clearfix">
            <div>家庭信息</div>
          </div>
          <el-row :gutter="30">
            <el-col>
              <el-form-item label="特殊学生类型：">
                <el-checkbox
                  :disabled="isDisabled('sfge')"
                  v-model="ruleForm.sfge"
                  true-label="是"
                  false-label="否"
                  label="孤儿"
                ></el-checkbox>
                <el-checkbox
                  :disabled="isDisabled('sfdqjt')"
                  v-model="ruleForm.sfdqjt"
                  true-label="是"
                  false-label="否"
                  label="单亲"
                ></el-checkbox>
                <el-checkbox
                  :disabled="isDisabled('sfcj')"
                  v-model="ruleForm.sfcj"
                  true-label="是"
                  false-label="否"
                  label="残疾"
                ></el-checkbox>
                <el-checkbox
                  :disabled="isDisabled('dbh')"
                  v-model="ruleForm.dbh"
                  true-label="是"
                  false-label="否"
                  label="低保户"
                ></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="父亲姓名：" prop="fqxm">
                <el-input
                  :disabled="isDisabled('fqxm')"
                  type="text"
                  placeholder="请输入父亲姓名"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.fqxm"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="母亲姓名：" prop="mqxm">
                <el-input
                  :disabled="isDisabled('mqxm')"
                  type="text"
                  placeholder="请输入母亲姓名"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.mqxm"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="父亲工作单位：" prop="fqgzdw">
                <el-input
                  :disabled="isDisabled('fqgzdw')"
                  type="text"
                  placeholder="请输入父亲工作单位"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.fqgzdw"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="母亲工作单位：" prop="mqgzdw">
                <el-input
                  :disabled="isDisabled('mqgzdw')"
                  type="text"
                  placeholder="请输入母亲工作单位"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.mqgzdw"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="父亲联系方式：" prop="fqlxfs">
                <el-input
                  :disabled="isDisabled('fqlxfs')"
                  type="text"
                  placeholder="请输入父亲联系方式"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.fqlxfs"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="母亲联系方式：" prop="mqlxfs">
                <el-input
                  :disabled="isDisabled('mqlxfs')"
                  type="text"
                  placeholder="请输入母亲联系方式"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.mqlxfs"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="家庭住址：" prop="jtzz">
                <el-input
                  :disabled="isDisabled('jtzz')"
                  type="text"
                  placeholder="请输入家庭住址"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.jtzz"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="邮政编码：" prop="jtzzyb">
                <el-input
                  :disabled="isDisabled('jtzzyb')"
                  type="text"
                  placeholder="请输入邮政编码"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.jtzzyb"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="never" class="grey-card fn-mt15">
          <div slot="header" class="clearfix">
            <div>在校信息</div>
          </div>
          <el-row :gutter="30">
            <el-col :span="7">
              <el-form-item label="培养层次：" prop="pycc">
                <el-select
                  :disabled="isDisabled('pycc')"
                  v-model="ruleForm.pycc"
                  placeholder="培养层次"
                >
                  <el-option
                    v-for="xb in pyccOpts"
                    :key="xb.value"
                    :label="xb.label"
                    :value="xb.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="在校状态：" prop="zxzt">
                <el-select
                  v-model="ruleForm.zxzt"
                  :disabled="isDisabled('zxzt')"
                  placeholder="在校状态"
                >
                  <el-option
                    v-for="xb in sgfsOpts"
                    :key="xb.value"
                    :label="xb.label"
                    :value="xb.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="学籍状态：" prop="xjzt">
                <el-select
                  v-model="ruleForm.xjzt"
                  :disabled="isDisabled('xjzt')"
                  placeholder="学籍状态"
                >
                  <el-option
                    v-for="xb in xjztOpts"
                    :key="xb.value"
                    :label="xb.label"
                    :value="xb.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="21" style="padding-right:0px:">
              <v-xyzybj-select
                :init-xy="ruleForm.xyId"
                :init-zy="ruleForm.zyId"
                :init-bj="ruleForm.bjid"
                :has-name="true"
                v-model="ruleForm"
                :gutter="30"
                :layout="['xy', 'zy', 'bj']"
                label-show="true"
                :disabled="isStudent || isShow"
                :xy-disabled="isStudent || isShow"
              ></v-xyzybj-select>
            </el-col>
            <el-col :span="7">
              <el-form-item label="年级：" prop="nj">
                <el-date-picker
                  :disabled="isDisabled('nj')"
                  v-model="ruleForm.nj"
                  format="yyyy"
                  type="year"
                  placeholder="选择日期"
                  value-format="yyyy"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="宿舍地址：" prop="xndz">
                <el-input
                  :disabled="isDisabled('xndz')"
                  type="text"
                  placeholder="请输入宿舍地址"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.xndz"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="never" class="grey-card fn-mt15">
          <div slot="header" class="clearfix">
            <div>在校其他信息</div>
          </div>
          <el-row>
            <el-col class="info-table">
              <el-form-item
                :label="zx.label"
                v-for="(zx, index) in zxqtxxs"
                :key="index"
              >
                <basic-table
                  v-if="zx.data.length"
                  :muti="false"
                  :columns="zx.columns"
                  :props-data="zx.data"
                ></basic-table>
                <span v-else>无数据</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="never" class="grey-card fn-mt15">
          <div slot="header" class="clearfix">
            <div>其他信息</div>
          </div>
          <el-row>
            <el-col>
              <el-form-item label="学习和工作经历：" prop="xxgzjl">
                <el-input
                  :disabled="isDisabled('xxgzjl')"
                  type="textarea"
                  placeholder="这里是学习和工作经历的内容"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.xxgzjl"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="特长：" prop="tc">
                <el-input
                  :disabled="isDisabled('tc')"
                  type="textarea"
                  placeholder="这里是特长的内容"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.tc"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="其他：" prop="zhbz">
                <el-input
                  :disabled="isDisabled('zhbz')"
                  type="textarea"
                  placeholder="这里是其他的内容"
                  @keyup.enter.native="keyUpSubmit"
                  v-model="ruleForm.zhbz"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-form-item style="padding: 20px 0 15px 340px">
          <el-button
            v-if="!isShow"
            type="primary"
            :loading="posting"
            @click="onSubmit"
            >保存</el-button
          >
          <el-button @click="$router.go(-1)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <v-dialog
      :show-footer="false"
      ref="kcDialog"
      width="900px"
      title="学生课程成绩"
    >
      <basic-table
        :muti="false"
        v-if="!isEmptyObject(tableParams)"
        :call-server="callServer"
        :columns="columns"
        v-model="tableParams"
      ></basic-table>
    </v-dialog>
  </v-page>
</template>

<script>
import basicTable from "_c/tables/";
import { getOptTxt, getCodeOptions } from "@/filters/options";
import noPic from "@p/static/imgs/no_pic.png";
import { saveStdInfo, editStdInfo, detail, exportsForm } from "@/api/stuInfo";
import { stuDetail, editStu, exportsStuForm } from "@/api/student";
import formMinxin from "_c/forms/minxins/formMinxin.js";
import minxin from "./minxin/";
import { list } from "@/api/stdCoursescore";

export default {
  components: {
    basicTable,
  },
  mixins: [formMinxin, minxin],
  data() {
    return {
      canEditFields: [],
      stdSumscores: [],
      loanSyds: [],
      loanXyds: [],
      xgPunishments: [],
      posting: false,
      loading: false,
      ruleForm: {
        studentId: this.$route.query.studentId || "",
        xh: "",
        xm: "",
        xb: "",
        csrq: "",
        jg: "",
        sfzh: "",
        hkxz: "",
        kslb: "",
        yhmc: "",
        gfs: "",
        mz: "",
        rxny: "",
        syd: [],
        lydq: "",
        lydqs: "",
        lydqx: "",
        hkd: "",
        lqlx: "",
        yhzh: "",
        zdxx: "",
        zzmm: "",
        zjlx: "",
        hkszdz: "",
        ksh: "",
        ykth: "",
        xyId: "",
        xy: "",
        lxdh: "",
        qqh: "",
        wxh: "",
        email: "",
        sfge: "",
        sfdqjt: "",
        sfcj: "",
        dbh: "",
        fqxm: "",
        fqgzdw: "",
        fqlxfs: "",
        mqxm: "",
        mqgzdw: "",
        mqlxfs: "",
        jtzz: "",
        jtzzyb: "",
        pycc: "",
        zxzt: "",
        xjzt: "",
        nj: "",
        xndz: "",
        xxgzjl: "",
        tc: "",
        zhbz: "",
        zyId: "",
        bjid: "",
        file: [],
        rxzp: "",
      },
      rules: {
        xh: [{ required: true, message: "请输入学号", trigger: "blur" }],
        xm: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        xb: [{ required: true, message: "请选择性别", trigger: "blur" }],
        sfzh: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
        // syd: [{ required: true, message: "请输入生源地", trigger: "blur" }],
        pycc: [{ required: true, message: "请选择培养层次", trigger: "blur" }],
        zxzt: [{ required: true, message: "请选择在校状态", trigger: "blur" }],
        xjzt: [{ required: true, message: "请选择学籍状态", trigger: "blur" }],
        xyId: [
          {
            required: true,
            message: `请选择${this.lang_college}`,
            trigger: "blur",
          },
        ],
        zyId: [{ required: true, message: "请选择专业", trigger: "blur" }],
        bjid: [{ required: true, message: "请选择班级", trigger: "blur" }],
        nj: [{ required: false, message: "请选择年级", trigger: "blur" }],
      },
      imageUrl: "",
      placeUrl: noPic,
      sgfsOpts: [
        {
          label: "是",
          value: "是",
        },
        {
          label: "否",
          value: "否",
        },
      ],
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (level == 0) {
            getCodeOptions("20004", true).then((data) => {
              resolve(data);
            });
          } else {
            getCodeOptions(node.data.dmid, true).then((data) => {
              resolve(
                data.map((item) => {
                  return {
                    label: item.label,
                    value: item.label,
                    dmid: item.dmid,
                    //leaf: level >= 2
                  };
                })
              );
            });
          }
        },
      },
      tableParams: {},
      columns: [
        {
          label: "课程名称",
          prop: "kcmc",
        },
        {
          label: "课程类别",
          prop: "kclb",
        },
        {
          label: "学分",
          prop: "xf",
        },
        {
          label: "考试成绩",
          prop: "kscj",
        },
        {
          label: "绩点",
          prop: "jd",
        },
      ],
    };
  },
  computed: {
    isShow: function () {
      return this.$route.name == "stuDetail" ? true : false;
    },
    isEdit: function () {
      return this.$route.query.studentId ? true : false;
    },
    isStudent: function () {
      return this.userInfo.activeRole == "student" ? true : false;
    },
    zxqtxxs: function () {
      const me = this;
      return [
        {
          label: "欠费情况：",
          data: [],
          columns: [{}],
        },
        {
          label: "综测成绩：",
          data: [],
          columns: [
            {
              label: "学年",
              prop: "xn",
            },
            {
              label: "学期",
              prop: "xq",
            },
            {
              label: "总分",
              prop: "zf",
            },
            {
              label: "班级排名",
              prop: "bjpm",
            },
            {
              label: "专业排名",
              prop: "zypm",
            },
          ],
        },
        {
          label: "违纪情况：",
          data: this.xgPunishments,
          columns: [
            {
              label: "处分文号",
              prop: "cfwh",
            },
            {
              label: "处分类型",
              prop: "cfjb",
            },
            {
              label: "处分原因",
              prop: "cfyy",
            },
            {
              label: "处分开始时间",
              prop: "cfkssj",
            },
            // {
            //   label: "处分解除文号",
            //   prop: "jcwh",
            // },
            {
              label: "处分解除时间",
              prop: "sqjcsj",
            },
          ],
        },
        {
          label: "家庭经济困难认定：",
          data: [],
          columns: [
            {
              label: "学年",
              prop: "xn",
            },
            {
              label: "认定结果",
              prop: "rdjg",
            },
          ],
        },
        {
          label: "所获奖助优补：",
          data: [],
          columns: [
            {
              label: "学年",
              prop: "xn",
            },
            {
              label: "奖助项目名称",
              prop: "jzxmmc",
            },
            {
              label: "等级",
              prop: "dj",
            },
            {
              label: "批次",
              prop: "pc",
            },
            {
              label: "金额",
              prop: "je",
            },
          ],
        },
        {
          label: "校园地助学贷款：",
          data: this.loanXyds,
          columns: [
            {
              label: "年度",
              prop: "nd",
            },
            {
              label: "贷款金额",
              prop: "fkje",
            },
          ],
        },
        {
          label: "生源地助学贷款：",
          data: this.loanSyds,
          columns: [
            {
              label: "年度",
              prop: "nd",
            },
            {
              label: "贷款银行",
              prop: "dkyh",
            },
            {
              label: "贷款用途",
              prop: "dkyt",
            },
            {
              label: "批次",
              prop: "pc",
            },
            {
              label: "贷款金额",
              prop: "dkje",
            },
          ],
        },
        {
          label: "勤工信息：",
          data: [],
          columns: [
            {
              label: "勤工单位",
              prop: "qgdw",
            },
            {
              label: "勤工岗位",
              prop: "qggw",
            },
            {
              label: "上岗时间",
              prop: "sgsj",
            },
            {
              label: "离岗时间",
              prop: "lgsj",
            },
            {
              label: "状态",
              prop: "zt",
            },
          ],
        },
        {
          label: "学籍异动情况：",
          data: [],
          columns: [
            {
              label: `原${this.lang_college}`,
              prop: "yxy",
            },
            {
              label: "原专业",
              prop: "yzy",
            },
            {
              label: "原年级",
              prop: "ynj",
            },
            {
              label: "原班级",
              prop: "ybj",
            },
            {
              label: `新${this.lang_college}`,
              prop: "xxy",
            },
            {
              label: "新专业",
              prop: "xzy",
            },
            {
              label: "新年级",
              prop: "xnj",
            },
            {
              label: "新班级",
              prop: "xbj",
            },
            {
              label: "异动时间",
              prop: "ydsj",
            },
          ],
        },
        {
          label: "成绩信息：",
          data: this.stdSumscores,
          columns: [
            {
              label: "学年",
              prop: "xn",
            },
            {
              label: "学期",
              prop: "xq",
            },
            {
              label: "总学分",
              prop: "zxf",
            },
            {
              label: "平均绩点",
              prop: "pjjd",
            },
            {
              label: "班级排名",
              prop: "bjpm",
            },
            {
              label: "班级人数",
              prop: "bjrs",
            },
            {
              label: "专业排名",
              prop: "pm",
            },
            {
              label: "专业人数",
              prop: "zyrs",
            },
            {
              label: "操作",
              width: 120,
              render(h, row) {
                return (
                  <el-button
                    type="text"
                    onClick={() => me.openkcDialog(row)}
                    size="middle"
                    class="txt-highlight"
                  >
                    查看课程成绩
                  </el-button>
                );
              },
            },
          ],
        },
      ];
    },
  },
  created() {
    //this.getOpts();
    if (this.isStudent) {
      stuDetail().then((data) => {
        this.initForm(data.data.stdInfo);
        this.stdSumscores = data.data.stdSumscores;
        this.loanSyds = data.data.loanSyds;
        this.loanXyds = data.data.loanXyds;
        this.xgPunishments = data.data.xgPunishments;

        for (let i = 0; i < data.data.canEditFields.length; i++) {
          this.canEditFields.push(data.data.canEditFields[i].columnCode);
        }
      });
    } else {
      if (this.isEdit) {
        detail(this.$route.query.studentId).then((data) => {
          this.initForm(data.data.stdInfo);
          this.stdSumscores = data.data.stdSumscores;
          this.loanSyds = data.data.loanSyds;
          this.loanXyds = data.data.loanXyds;
          this.xgPunishments = data.data.xgPunishments;
          this.$forceUpdate();
          const syd = [data.data.stdInfo.lydq, data.data.stdInfo.lydqs];
          if (
            data.data.stdInfo.lydqx &&
            data.data.stdInfo.lydqx != "undefined"
          ) {
            syd.push(data.data.stdInfo.lydqx);
          }
          this.$set(this.ruleForm, "syd", syd);
        });
      }
    }
  },
  methods: {
    openkcDialog(item) {
      this.tableParams = {
        xn: item.xn,
        xq: item.xq,
        xh: item.xh,
      };
      this.$refs.kcDialog.dialogVisible = true;
    },
    callServer(pagination) {
      return list;
    },
    exportsForm() {
      if (this.isStudent) {
        exportsStuForm({ studentId: this.ruleForm.studentId }, "个人登记表");
      } else {
        exportsForm({ studentId: this.ruleForm.studentId }, "个人登记表");
      }
    },
    onChange(file, fileList) {
      const nFile = fileList.pop();
      const isJPG =
        ["image/jpg", "image/jpeg", "image/png"].indexOf(nFile.raw.type) > -1;
      const isLt2M = nFile.size / 1024 < 600;
      if (!isJPG) {
        this.toast("上传头像图片只能是 jpg,jpeg,png 格式!", "error");
        return;
      }
      if (!isLt2M) {
        this.toast("上传头像图片大小不能超过 600K!", "error");
        return;
      }
      fileList.push(nFile);
      this.ruleForm.file = [nFile];
      this.imageUrl = URL.createObjectURL(nFile.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG =
        ["image/jpg", "image/jpeg", "image/png"].indexOf(file.type) > -1;
      const isLt2M = file.size / 1024 < 600;

      if (!isJPG) {
        this.toast("上传头像图片只能是 jpg,jpeg,png 格式!", "error");
      }
      if (!isLt2M) {
        this.toast("上传头像图片大小不能超过 600K!", "error");
      }
      return isJPG && isLt2M;
    },
    sydChange(e) {
      this.ruleForm.lydq = this.ruleForm.syd[0];
      this.ruleForm.lydqs = this.ruleForm.syd[1];
      this.ruleForm.lydqx = this.ruleForm.syd[2];
    },
    onSubmit() {
      const me = this;
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          const oData = {};
          for (const key in this.ruleForm) {
            if (
              key != "files" &&
              this.ruleForm[key] != "null" &&
              this.ruleForm[key] != null
            ) {
              oData[key] = this.ruleForm[key];
            }
          }
          this.posting = true;
          if (this.isStudent) {
            editStu(this.ruleForm.file, oData)
              .then((data) => {
                this.posting = false;

                this.toast("修改成功", "success");
              })
              .catch((err) => {
                this.posting = false;
              });
          } else {
            if (this.isEdit) {
              editStdInfo(this.ruleForm.file, oData)
                .then((data) => {
                  this.posting = false;

                  this.toast("修改成功", "success");
                  this.$router.go(-1);
                })
                .catch((err) => {
                  this.posting = false;
                });
            } else {
              saveStdInfo(this.ruleForm.file, oData)
                .then((data) => {
                  this.posting = false;

                  this.toast("保存成功", "success");
                  this.$router.go(-1);
                })
                .catch((err) => {
                  this.posting = false;
                });
            }
          }
        }
      });
    },
    isDisabled(field) {
      if (this.isStudent) {
        return this.canEditFields.indexOf(field) > -1 ? false : true;
      } else {
        if (this.$route.name == "stuDetail") {
          return true;
        } else {
          return false;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.info-table {
  .el-table__header {
    background: #f2f9ff;
    th {
      padding: 0;
      background: #f2f9ff;
    }
  }
  .el-table__body-wrapper {
    td {
      padding: 0;
    }
  }
  .pagination-wrapper {
    display: none;
  }
}
</style>
