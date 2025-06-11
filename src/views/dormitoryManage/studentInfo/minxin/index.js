import { mapGetters, mapActions } from "vuex";
const optsArr = [
  "xbOpts",
  "pyccOpts",
  "xjOpts",
  "zzmmOpts",
  "mzOpts",
  "zjlxOpts",
  "hklxOpts",
  "kslbOpts",
  "lqlxOpts",
  "xjztOpts",
];
export default {
  data() {
    return {
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
      tsxslxOpts: [
        {
          label: "孤儿",
          value: "sfge",
        },
        {
          label: "单亲",
          value: "sfdqjt",
        },
        {
          label: "残疾",
          value: "sfcj",
        },
        {
          label: "低保户",
          value: "dbh",
        },
      ],
    };
  },
  created() {
    this.getOpts(optsArr);
  },
  computed: {
    ...mapGetters(optsArr),
  },
  methods: {
    ...mapActions(["getOpts"]),
  },
};
