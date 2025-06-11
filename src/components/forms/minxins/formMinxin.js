import { getCodeOptions, getOptCode } from "@/filters/options";
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
        if (valid === true) {
          cb(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    initRuleForm(data) {
      if (data.length) {
        for (const fd of data) {
          if (!this.ruleForm.hasOwnProperty(fd.prop)) {
            this.$set(this.ruleForm, fd.prop, "");
          }
        }
      } else {
        return {};
      }
    },
    setOpts(sels) {
      const arr = sels.split("|");
      const opts = [];
      for (let i = 0; i < arr.length; i++) {
        opts.push({
          label: arr[i],
          value: arr[i],
        });
      }
      return opts;
    },
    setRuleForm(data, type, span) {
      const fields = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].selecttype == "input") {
          //文本框
          //this.$set(this.ruleForm, data[i].fieldcode, "");
          const rule = {
            label: data[i].fieldname + "：",
            placeholder: `请输入${data[i].fieldname}`,
            prop: data[i].fieldcode,
            span: span ? span : 12,
            type: type ? type : "text",
            disabled: data[i].isedit ? false : true,
            rule: [
              {
                required: data[i].isrequired ? true : false,
                message: `请输入${data[i].fieldname}`,
                trigger: "blur",
              },
            ],
          };
          fields.push(rule);
        } else if (data[i].selecttype == "number") {
          //数字
          //this.$set(this.ruleForm, data[i].fieldcode, "");
          const rule = {
            label: data[i].fieldname + "：",
            placeholder: `请输入${data[i].fieldname}`,
            prop: data[i].fieldcode,
            span: span ? span : 12,
            type: type ? type : "text",
            disabled: data[i].isedit ? false : true,
            rule: [
              {
                required: data[i].isrequired ? true : false,
                message: `请输入${data[i].fieldname}`,
                trigger: "blur",
              },
              {
                validator: this.validatorZzs,
                message: `请输入正确数字`,
                trigger: "blur",
              },
            ],
          };
          fields.push(rule);
        } else if (data[i].selecttype == "textarea") {
          //文本域
          //this.$set(this.ruleForm, data[i].fieldcode, "");
          const rule = {
            label: data[i].fieldname + "：",
            placeholder: `请输入${data[i].fieldname}`,
            prop: data[i].fieldcode,
            span: 24,
            type: type ? type : "textarea",
            disabled: data[i].isedit ? false : true,
            rule: [
              {
                required: data[i].isrequired ? true : false,
                message: `请输入${data[i].fieldname}`,
                trigger: "blur",
              },
            ],
          };
          fields.push(rule);
        } else if (
          data[i].selecttype == "radio" ||
          data[i].selecttype == "select"
        ) {
          //单选、下拉框
          const rule = {
            label: data[i].fieldname + "：",
            placeholder: `请选择${data[i].fieldname}`,
            prop: data[i].fieldcode,
            span: span ? span : 12,
            type: type ? type : "select",
            options: [],
            disabled: data[i].isedit ? false : true,
            rule: [],
            change: () => {
              const code = getOptCode(
                rule.options,
                this.ruleForm[data[i].fieldcode]
              );
              if (data[i].hiddenfield) {
                this.$set(this.ruleForm, data[i].hiddenfield, code);
              }
              this.$forceUpdate();
            },
          };
          if (data[i].isrequired) {
            rule.rule.push({
              required: true,
              message: `请选择${data[i].fieldname}`,
              trigger: "blur",
            });
          }
          if (data[i].selectvalue) {
            rule.options = this.setOpts(data[i].selectvalue);
          } else {
            getCodeOptions(data[i].selectcode).then((data) => {
              this.$nextTick(() => {
                rule.options = data;
              });
            });
          }
          fields.push(rule);
        } else if (data[i].selecttype == "nf") {
          //日期时间
          const rule = {
            label: data[i].fieldname + "：",
            placeholder: `请选择${data[i].fieldname}`,
            prop: data[i].fieldcode,
            span: span ? span : 12,
            type: type ? type : "date",
            dType: type ? type : "year",
            formate: "yyyy",
            format: "yyyy",
            disabled: data[i].isedit ? false : true,
            rule: [],
          };
          if (data[i].isrequired) {
            rule.rule.push({
              required: true,
              message: `请选择日期时间`,
              trigger: "blur",
            });
          }
          fields.push(rule);
        } else if (data[i].selecttype == "date") {
          //日期
          const rule = {
            label: data[i].fieldname + "：",
            placeholder: `请选择${data[i].fieldname}`,
            prop: data[i].fieldcode,
            span: span ? span : 12,
            type: type ? type : "date",
            formate: data[i].selectvalue ? data[i].selectvalue : "yyyyMMdd",
            disabled: data[i].isedit ? false : true,
            rule: [],
          };
          if (data[i].isrequired) {
            rule.rule.push({
              required: true,
              message: `请选择日期`,
              trigger: "blur",
            });
          }
          fields.push(rule);
        } else if (data[i].selecttype == "area") {
          //省市
          let jgOpts = [];
          const rule = {
            label: data[i].fieldname + "：",
            placeholder: `请选择${data[i].fieldname}`,
            prop: data[i].fieldcode,
            span: span ? span : 12,
            type: type ? type : "cascader",
            optProps: {
              lazy: true,
              lazyLoad(node, resolve) {
                const { level } = node;
                setTimeout(() => {
                  if (level == 0) {
                    getCodeOptions("20004").then((data) => {
                      const nodes = [];
                      for (let i = 0; i < data.length; i++) {
                        nodes.push({
                          label: data[i].label,
                          value: data[i].label,
                          did: data[i].dmid,
                          code: data[i].code,
                        });
                      }
                      jgOpts = nodes;
                      resolve(nodes);
                    });
                  } else {
                    getCodeOptions(node.data.did).then((data) => {
                      const nodes = [];
                      for (let i = 0; i < data.length; i++) {
                        nodes.push({
                          label: data[i].label,
                          value: data[i].label,
                          did: data[i].dmid,
                          code: data[i].code,
                          leaf: true,
                        });
                      }
                      jgOpts = nodes;
                      resolve(nodes);
                    });
                  }
                }, 500);
              },
            },
            rule: [],
            disabled: data[i].isedit ? false : true,
            change: () => {
              const code = getOptCode(
                jgOpts,
                this.ruleForm[data[i].fieldcode][1]
              );
              if (data[i].hiddenfield) {
                this.$set(this.ruleForm, data[i].hiddenfield, code);
              } else {
                this.$set(this.ruleForm, data[i].fieldcode + "m", code);
              }
            },
          };
          if (data[i].isrequired) {
            rule.rule.push({
              required: true,
              message: `请选择${data[i].fieldname}`,
              trigger: "blur",
            });
          }
          fields.push(rule);
        } else {
          //this.$set(this.ruleForm, data[i].fieldcode, "");
          const rule = {
            label: data[i].fieldname + "：",
            placeholder: `请输入${data[i].fieldname}`,
            prop: data[i].fieldcode,
            span: span ? span : 12,
            type: type ? type : "text",
            disabled: data[i].isedit ? false : true,
            rule: [
              {
                required: data[i].isrequired ? true : false,
                message: `请输入${data[i].fieldname}`,
                trigger: "blur",
              },
            ],
          };
          fields.push(rule);
        }
      }
      return fields;
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
