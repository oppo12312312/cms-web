export default {
  data() {
    return {
      regexSets: {
        passReg: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/,
        lxdhReg: /^(0?1[0-9]\d{9})|((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/,
        zzsReg: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
        sjhReg: /^1[3456789]\d{9}$/,
        sfzReg:
          /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
        emailReg: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        urlReg:
          /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
      },
    };
  },
  methods: {
    keyUpSubmit() {
      this.$emit("keyUpSubmit");
    },
    validate(cb) {
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          cb(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    initForm(data) {
      if (data && !this.isEmptyObject(data)) {
        this.status = 1;
        for (const key in data) {
          if (this.ruleForm.hasOwnProperty(key)) {
            this.ruleForm[key] = data[key];
          }
        }
      } else {
        return;
      }
    },
    validatorZzs(rule, value, callback) {
      if (value) {
        if (this.regexSets.zzsReg.test(value) == false) {
          callback(new Error("请填写大于0的数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    validatorLxdh(rule, value, callback) {
      if (value) {
        if (this.regexSets.lxdhReg.test(value) == false) {
          callback(new Error("请填写正确联系电话"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    validatorSjh(rule, value, callback) {
      if (value) {
        if (this.regexSets.sjhReg.test(value) == false) {
          callback(new Error("请填写正确手机号"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    validatorSfz(rule, value, callback) {
      if (value) {
        if (this.regexSets.sfzReg.test(value) == false) {
          callback(new Error("请填写正确身份证号"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    validatorEmail(rule, value, callback) {
      if (value) {
        if (this.regexSets.emailReg.test(value) == false) {
          callback(new Error("请填写正确邮箱"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    validatorUrl(rule, value, callback) {
      if (value) {
        if (this.regexSets.urlReg.test(value) == false) {
          callback(new Error("请填写正确网址"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
  },
};
