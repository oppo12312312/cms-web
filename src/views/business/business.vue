<template>
  <div class="service">
    <!-- <el-row :gutter="20">
          <el-col v-show="!service.meta.hidden" :xs="6" :sm="6" :md="6" :lg="4" v-for="(service,index) in serviceList" :key="index" class="fn-mb20">
            <router-link class="grid-content align-flex" :to="{name: service.name}">
              <el-image :src="require(`@p/static/servicefont/${service.meta.icon}.svg`)" class="item-svg_50"></el-image>
              <p class="align-content-flex normal-md-font fn-ml20">{{service.meta.title}}</p>
            </router-link>
          </el-col>
        </el-row> -->
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  created() {
    if (this.services[0].children) {
      this.$router.push({
        name: this.services[0].children[0].name,
      });
    } else {
      this.$router.push({
        name: this.services[0].name,
      });
    }
  },
  computed: {
    ...mapGetters(["services"]),
    // serviceList: function () {
    //   return this.services.filter((item) => {
    //     return !item.meta.hidden;
    //   });
    // },
  },
  methods: {},
};
</script>

<style lang="scss">
.service {
  width: 100%;
  height: 100%;
  padding: 20px;
  .grid-content {
    background: #fff;
    padding: 20px 15px 20px 20px;
    border-radius: 5px;
    box-shadow: 2px 10px 32px rgba(156, 157, 158, 0.07);
    cursor: pointer;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    &:hover {
      -webkit-transform: scale(1.15);
      transform: scale(1.12);
    }
    .item-svg_50 {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
