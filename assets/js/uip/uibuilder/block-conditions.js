export default {
  computed: {},
  methods: {
    /**
     * Returns whether block meets it's conditions
     *
     * @since 3.2.13
     */
    blockMetConditions() {
      // Always return true when not in production
      if (!this.isProduction) return true;

      let conditions = this.get_block_option(this.block, "advanced", "conditions");

      if (typeof conditions === "undefined") return true;
      if (!this.isObject(conditions)) return true;

      let allConditions = conditions.conditions;
      let relation = conditions.relation ? conditions.relation : "and";

      if (!Array.isArray(allConditions)) return true;

      let met = true;
      let metAnds = [];

      let userid = this.uipApp.data.options.dynamicData.userid.value;
      let username = this.uipApp.data.options.dynamicData.username.value;
      let userroles = this.uipApp.data.options.dynamicData.userroles.value;
      let useremail = this.uipApp.data.options.dynamicData.useremail.value;

      //Loop through the conditions
      for (let condition of allConditions) {
        if (condition.value === "") continue;
        //username conditions
        if (condition.type == "userlogin") {
          if (condition.operator == "is") {
            if (username != condition.value) {
              if (relation == "and") {
                met = false;
                break;
              }
              if (relation == "or") {
                metAnds.push(false);
              }
            }
          }
          if (condition.operator == "isnot") {
            if (username == condition.value) {
              if (relation == "and") {
                met = false;
                break;
              }
              if (relation == "or") {
                metAnds.push(false);
              }
            }
          }
        }
        //username conditions
        if (condition.type == "userid") {
          if (condition.operator == "is") {
            if (userid != condition.value) {
              if (relation == "and") {
                met = false;
                break;
              }
              if (relation == "or") {
                metAnds.push(false);
              }
            }
          }
          if (condition.operator == "isnot") {
            if (userid == condition.value) {
              if (relation == "and") {
                met = false;
                break;
              }
              if (relation == "or") {
                metAnds.push(false);
              }
            }
          }
        }
        //Role conditions
        if (condition.type == "userrole") {
          if (condition.operator == "is") {
            if (!userroles.includes(condition.value)) {
              if (relation == "and") {
                met = false;
                break;
              }
              if (relation == "or") {
                metAnds.push(false);
              }
            }
          }
          if (condition.operator == "isnot") {
            if (userroles.includes(condition.value)) {
              if (relation == "and") {
                met = false;
                break;
              }
              if (relation == "or") {
                metAnds.push(false);
              }
            }
          }
        }

        //useremail conditions
        if (condition.type == "useremail") {
          if (condition.operator == "is") {
            if (useremail != condition.value) {
              if (relation == "and") {
                met = false;
                break;
              }
              if (relation == "or") {
                metAnds.push(false);
              }
            }
          }
          if (condition.operator == "isnot") {
            if (useremail == condition.value) {
              if (relation == "and") {
                met = false;
                break;
              }
              if (relation == "or") {
                metAnds.push(false);
              }
            }
          }
        }
      }

      if (relation == "or") {
        if (metAnds.length == allConditions.length) {
          return false;
        } else {
          return true;
        }
      } else {
        return met;
      }
    },
  },
};
