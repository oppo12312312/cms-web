<template>
  <v-page>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>允许学生修改的信息</span>
      </div>
      <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="auto">
        <el-form-item>
          <el-card
            v-for="sw in shows"
            :key="sw.label"
            shadow="never"
            class="grey-card fn-mb15"
          >
            <div slot="header" class="clearfix">
              <div>{{ sw.label }}</div>
            </div>
            <div>
              <el-checkbox
                v-for="sf in sw.fields"
                :key="sf.id"
                name="type"
                :value="sf.canModify"
                :true-label="1"
                :false-label="0"
                :checked="sf.canModify == 1"
                @change="checkChange($event, sf)"
              >
                {{ sf.columnName }}
              </el-checkbox>
            </div>
          </el-card>
        </el-form-item>
        <el-form-item style="padding: 20px 0 15px 340px">
          <el-button type="primary" :loading="posting" @click="onSubmit"
            >保存</el-button
          >
          <el-button @click="$router.go(-1)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </v-page>
</template>

<script>
import basicTable from "_c/tables/";
import { list, update } from "@/api/stuInfoSet";
export default {
  components: {
    basicTable,
  },
  data() {
    return {
      posting: false,
      loading: false,
      ruleForm: {
        list: [],
      },
      shows: {
        stuBaseInfo: {
          label: "学生基本信息",
          fields: [],
        },
        stuConnectType: {
          label: "个人联系方式",
          fields: [],
        },
        stuFamilyInfo: {
          label: "家庭信息",
          fields: [],
        },
        otherInfo: {
          label: "其他信息",
          fields: [],
        },
      },
    };
  },
  created() {
    list().then((data) => {
      for (const key in data.data) {
        this.shows[key].fields = data.data[key];
      }
    });
  },
  methods: {
    checkChange(val, item) {
      this.$nextTick(() => {
        item.canModify = val;
      });
    },
    onSubmit() {
      const me = this;
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          this.posting = true;
          let list = [];
          for (const key in this.shows) {
            list = list.concat(this.shows[key].fields);
          }
          update(list)
            .then(() => {
              this.posting = false;
              me.toast("设置成功", "success");
            })
            .catch((err) => {
              this.posting = false;
            });
        }
      });
      // this.$refs.ruleForm.validate((data) => {
      //   this.posting = true;
      //   update(data)
      //     .then(() => {
      //       this.posting = false;
      //       me.toast("设置成功", "success");
      //     })
      //     .catch((err) => {
      //       this.posting = false;
      //     });
      // });
    },
  },
};
</script>

<style lang="scss"></style>
