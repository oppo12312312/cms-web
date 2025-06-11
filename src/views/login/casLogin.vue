<template>
  <div></div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "casLogin",
  mounted() {
    if (this.$route.query.flag == "1") {
      this.haslogined();
    } else {
      const page = window.encodeURIComponent(this.$route.query.page ?? "");
      if (process.env.NODE_ENV === "production") {
        window.location.href = "/tms-server/session/cas/gotoLogin?page=" + page;
      }
    }
  },
  methods: {
    ...mapActions(["casLogin"]),
    haslogined() {
      this.casLogin().then(() => {
        setTimeout(() => {
          if (this.$route.query.page) {
            const page = window.decodeURIComponent(this.$route.query.page);
            // window.location.href = page;
            this.$router.push({ path: page });
          } else {
            this.$router.push({ path: "/" });
          }
        }, 100);
      });
    },
  },
};
</script>
