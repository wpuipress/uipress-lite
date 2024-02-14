export default {
  data() {
    return {
      currentDate: new Date(),
      currentURL: window.location.href,
    };
  },
  mounted() {
    this.updateDate();
    this.interval = setInterval(this.updateDate, 60000);
    document.addEventListener("uipress/app/page/change", this.updateCurrentURL, { once: false });
  },
  beforeUnmount() {
    clearInterval(this.interval); // Clear the interval when the component is destroyed
    document.removeEventListener("uipress/app/page/change", this.updateCurrentURL, { once: false });
  },
  computed: {
    /**
     * Returns current day of the week in English
     *
     * @since 3.3.095
     */
    currentDayOfWeek() {
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const now = this.currentDate;
      return days[now.getDay()];
    },

    /**
     * Returns current date in YYYY/MM/DD format
     *
     * @since 3.3.095
     */
    currentLocalDate() {
      const now = this.currentDate;
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(now.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    },

    /**
     * Returns current time in HH:SS format
     *
     * @since 3.3.095
     */
    currentLocalTime() {
      const now = this.currentDate;
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      return `${hours}:${minutes}`;
    },
  },
  methods: {
    /**
     * Updates current url
     *
     * @param {object} e - event object
     *
     * @since 3.3.095
     */
    updateCurrentURL(e) {
      this.currentURL = e.detail.url ? e.detail.url.replaceAll("%2F", "/") : e.detail.url;
    },
    /**
     * Updates current date / time
     *
     * @since 3.3.095
     */
    updateDate() {
      this.currentDate = new Date();
    },

    /**
     * Returns whether given condition matches
     *
     * @param {Boolean} valueComparison =  The value to check against
     * @param {Object} condition - the condition object
     *  @param {Boolean} valueAsArray - Whether the value to check against is an array
     *
     * @since 3.3.095
     */
    handleConditionLogic(value, condition, valueAsArray) {
      let conditionMet = false;

      value = typeof value !== "boolean" && !valueAsArray ? value.toLowerCase() : value;
      const userValue = condition.value.toLowerCase();

      const valuesMatch = valueAsArray ? value.includes(userValue) : value === userValue;
      const valueAsString = valueAsArray ? value.toString().toLowerCase() : "";

      if (condition.operator === "is" && valuesMatch) {
        conditionMet = true;
      } else if (condition.operator === "isnot" && !valuesMatch) {
        conditionMet = true;
      } else if (condition.operator === "contains" && !valueAsArray && value.includes(userValue)) {
        conditionMet = true;
      } else if (condition.operator === "contains" && valueAsArray && valueAsString.includes(userValue)) {
        conditionMet = true;
      }

      return conditionMet ? "met" : "not_met";
    },

    /**
     * Returns whether given condition matches for numerical comparisons
     *
     * @param {Number} value =  The value to check against
     * @param {Object} condition - the condition object
     *
     * @since 3.3.095
     */
    handleNumericalConditionLogic(value, condition) {
      let conditionMet = false;

      const parsedConditionValue = parseFloat(condition.value);
      const parsedValue = parseFloat(value);

      // Check for unset values
      if (isNaN(parsedConditionValue) || isNaN(parsedValue)) return "not_met";

      if (condition.operator === "is" && parsedConditionValue === parsedValue) {
        conditionMet = true;
      } else if (condition.operator === "isnot" && parsedConditionValue !== parsedValue) {
        conditionMet = true;
      } else if (condition.operator === "contains" && value.includes(condition.value)) {
        conditionMet = true;
      } else if (condition.operator === "greaterThan" && parsedValue > parsedConditionValue) {
        conditionMet = true;
      } else if (condition.operator === "greaterThanEqualTo" && parsedValue >= parsedConditionValue) {
        conditionMet = true;
      } else if (condition.operator === "lessThan" && parsedValue < parsedConditionValue) {
        conditionMet = true;
      } else if (condition.operator === "lessThanEqualTo" && parsedValue <= parsedConditionValue) {
        conditionMet = true;
      }

      return conditionMet ? "met" : "not_met";
    },

    /**
     * Returns whether given condition matches for date comparisons
     *
     * @param {Number} value =  The value to check against
     * @param {Object} condition - the condition object
     *
     * @since 3.3.095
     */
    handleDateConditionLogic(condition) {
      let conditionMet = false;

      const formattedConditionDate = new Date(condition.value);
      const formattedToday = new Date(this.currentLocalDate);

      if (condition.operator === "is" && formattedConditionDate.getTime() === formattedToday.getTime()) {
        conditionMet = true;
      } else if (condition.operator === "isnot" && formattedConditionDate.getTime() !== formattedToday.getTime()) {
        conditionMet = true;
      } else if (condition.operator === "contains" && this.currentLocalDate.includes(condition.value)) {
        conditionMet = true;
      } else if (condition.operator === "greaterThan" && formattedToday > formattedConditionDate) {
        conditionMet = true;
      } else if (condition.operator === "greaterThanEqualTo" && formattedToday >= formattedConditionDate) {
        conditionMet = true;
      } else if (condition.operator === "lessThan" && formattedToday < formattedConditionDate) {
        conditionMet = true;
      } else if (condition.operator === "lessThanEqualTo" && formattedToday <= formattedConditionDate) {
        conditionMet = true;
      }

      return conditionMet ? "met" : "not_met";
    },

    /**
     * Returns whether given condition matches for time comparisons
     *
     * @param {Number} value =  The value to check against
     * @param {Object} condition - the condition object
     *
     * @since 3.3.095
     */
    handleTimeConditionLogic(condition) {
      let conditionMet = false;

      const currentTime = this.timeStringToMinutes(this.currentLocalTime);
      const conditionTime = this.timeStringToMinutes(condition.value);

      console.log(this.currentLocalTime);
      console.log(condition.value);

      if (condition.operator === "is" && this.currentLocalTime === condition.value) {
        conditionMet = true;
      } else if (condition.operator === "isnot" && this.currentLocalTime !== condition.value) {
        conditionMet = true;
      } else if (condition.operator === "contains" && this.currentLocalTime.includes(condition.value)) {
        conditionMet = true;
      } else if (condition.operator === "greaterThan" && currentTime > conditionTime) {
        conditionMet = true;
      } else if (condition.operator === "greaterThanEqualTo" && currentTime >= conditionTime) {
        conditionMet = true;
      } else if (condition.operator === "lessThan" && currentTime < conditionTime) {
        conditionMet = true;
      } else if (condition.operator === "lessThanEqualTo" && currentTime <= conditionTime) {
        conditionMet = true;
      }

      return conditionMet ? "met" : "not_met";
    },

    /**
     * Converts time strings in HH:MM format to integers
     *
     * @param {String} timeString - the time string to conver
     * @since 3.3.095
     */
    timeStringToMinutes(timeString) {
      timeString = timeString.trim();
      const [hours, minutes] = timeString.split(":").map(Number);
      return hours * 60 + minutes;
    },

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
      let tempValue = "";
      let matcher = "";

      let userid = this.uipApp.data.options.dynamicData.userid.value;
      let username = this.uipApp.data.options.dynamicData.username.value;
      let userroles = this.uipApp.data.options.dynamicData.userroles.value;
      let useremail = this.uipApp.data.options.dynamicData.useremail.value;

      // Loop through conditions
      for (let condition of allConditions) {
        // Continue if empty
        if (condition.value === "") continue;

        switch (condition.type) {
          // User Login condition
          case "userlogin":
            tempValue = this.handleConditionLogic(username, condition);
            metAnds.push(tempValue);
            break;

          // User ID condition
          case "userid":
            tempValue = this.handleNumericalConditionLogic(userid, condition);
            metAnds.push(tempValue);
            break;

          // User email condition
          case "useremail":
            tempValue = this.handleConditionLogic(useremail, condition);
            metAnds.push(tempValue);
            break;

          // User roles condition
          case "userrole":
            tempValue = this.handleConditionLogic(userroles, condition, true);
            metAnds.push(tempValue);
            break;

          // Weekday condition
          case "weekday":
            tempValue = this.handleConditionLogic(this.currentDayOfWeek, condition);
            metAnds.push(tempValue);
            break;

          // Date condition
          case "date":
            tempValue = this.handleDateConditionLogic(condition);
            metAnds.push(tempValue);
            break;

          // Date condition
          case "time":
            tempValue = this.handleTimeConditionLogic(condition);
            metAnds.push(tempValue);
            break;
          // SITE CONDITIONS //
          // Site title condition
          case "siteTitle":
            tempValue = this.handleConditionLogic(this.uipApp.data.options.site_name, condition);
            metAnds.push(tempValue);
            break;
          // Site URL condition
          case "siteURL":
            tempValue = this.handleConditionLogic(this.uipApp.data.options.domain, condition);
            metAnds.push(tempValue);
            break;
          // Admin URL condition
          case "adminURL":
            tempValue = this.handleConditionLogic(this.uipApp.data.options.adminURL, condition);
            metAnds.push(tempValue);
            break;
          // Current page name condition
          case "currentPageName":
            tempValue = this.handleConditionLogic(this.uipApp.data.options.dynamicData.adminPageTitle.value, condition);
            metAnds.push(tempValue);
            break;
          // Current url condition
          case "currentURL":
            tempValue = this.handleConditionLogic(this.currentURL, condition);
            metAnds.push(tempValue);
            break;
          // Current locale condition
          case "locale":
            tempValue = this.handleConditionLogic(this.uipApp.data.options.locale, condition);
            metAnds.push(tempValue);
            break;
          // Plugin active condition
          case "pluginActive":
            const formattedPlugins = Object.values(this.uipApp.data.options.activePlugins).map((value) => value.split("/")[0]);
            tempValue = this.handleConditionLogic(formattedPlugins, condition, true);
            metAnds.push(tempValue);
            break;
          // Notification condition
          case "notificationCount":
            console.log(this.uipApp.data.options.dynamicData);
            tempValue = this.handleNumericalConditionLogic(this.uipApp.data.options.dynamicData.notificationCount.value, condition, true);
            metAnds.push(tempValue);
            break;
          // Dark mode condition
          case "darkMode":
            const state = this.uipApp.data.userPrefs.darkTheme ? "true" : "false";
            condition.value = condition.value ? "true" : "false";
            tempValue = this.handleConditionLogic(state, condition);
            metAnds.push(tempValue);
            break;
        }
      }

      if (relation == "or") {
        return metAnds.includes("met");
      } else {
        return !metAnds.includes("not_met");
      }
    },
  },
};
