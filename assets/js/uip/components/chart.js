import * as charts from "../../libs/charts.min.js";
import { nextTick } from "../../libs/vue-esm.js";
export default {
  props: {
    chartData: Object,
  },
  data() {
    return {
      chart: false,
      loading: false,
      acceptedData: false,
      rendered: true,
    };
  },

  watch: {
    chartData: {
      handler(newValue, oldValue) {
        // Nothing has changed
        if (JSON.stringify(newValue) == JSON.stringify(this.acceptedData)) return;
        this.refreshChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.acceptedData = this.chartData;
    this.createChart();
  },
  methods: {
    /**
     * Destroys current chart instance and rebuilds
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async refreshChart() {
      this.chart.destroy();
      this.chart = false;
      this.acceptedData = JSON.parse(JSON.stringify(this.chartData));
      this.rendered = false;

      await nextTick();

      this.rendered = true;
      this.createChart();
    },

    /**
     * Creates a chart based on the accepted data.
     *
     * @since 3.2.13
     */
    createChart() {
      // If chart already exists, exit
      if (this.chart) return;

      // Retrieve styles
      let primaryColor = this.getComputedOrOverriddenColor("--uip-color-accent", this.acceptedData.colors.main);
      let lightColor = this.getComputedOrOverriddenColor("--uip-color-red-lighter", this.acceptedData.colors.comp);

      const labels = this.formatLabels(this.acceptedData.labels);

      const datasetDefaults = {
        dataBackground: "",
        fillDataBackground: false,
        compBackground: "",
        fillCompBackground: false,
      };

      // Handle custom data backgrounds if provided
      if (this.isObject(this.acceptedData.custom)) {
        datasetDefaults.dataBackground = this.acceptedData.custom.dataBackground || "";
        datasetDefaults.fillDataBackground = Boolean(datasetDefaults.dataBackground);
        datasetDefaults.compBackground = this.acceptedData.custom.compBackground || "";
        datasetDefaults.fillCompBackground = Boolean(datasetDefaults.compBackground);
      }

      const data = {
        labels: labels,
        datasets: [
          {
            label: this.acceptedData.title,
            backgroundColor: datasetDefaults.dataBackground,
            fill: datasetDefaults.fillDataBackground,
            borderColor: primaryColor,
            data: this.acceptedData.data.main,
          },
        ],
      };

      // If comparison data exists, add it to datasets
      if (this.acceptedData.data.comparison.length > 0) {
        data.datasets.push({
          label: this.acceptedData.title,
          backgroundColor: datasetDefaults.compBackground,
          fill: datasetDefaults.fillCompBackground,
          borderColor: lightColor,
          data: this.acceptedData.data.comparison,
        });
      }

      const config = {
        type: this.acceptedData.type,
        data: data,
        options: this.buildTheChartOptions(),
      };

      this.chart = new Chart(this.$refs.uipChart, config);
    },

    /**
     * Helper function to determine the color based on style or overridden value.
     *
     * @param {string} cssProperty - CSS property to fetch from computed style.
     * @param {string} overrideValue - The override color if provided.
     * @returns {string} - The determined color.
     *
     * @since 3.2.13
     */
    getComputedOrOverriddenColor(cssProperty, overrideValue) {
      if (overrideValue && overrideValue !== "") {
        return overrideValue;
      }
      return getComputedStyle(document.documentElement).getPropertyValue(cssProperty);
    },

    /**
     * Formats labels / allows multiple labels to be set for one axis
     *
     * @param {Array} labels
     * @since 3.2.13
     */
    formatLabels(labels) {
      let formatted = [];
      for (let [index, value] of labels.main.entries()) {
        let processed = value;
        if (labels.comparison) {
          if (labels.comparison[index]) {
            processed = value + ";" + labels.comparison[index];
          }
        }
        formatted.push(processed);
      }

      return formatted;
    },

    /**
     * Builds chart options
     *
     * @since 3.2.13
     */
    buildTheChartOptions() {
      let tension = 0.15;
      let showXaxis = false;
      let showYaxis = false;
      let showYaxisGrid = true;
      let showXaxisGrid = false;
      let borderWidth = 3;
      if (this.isObject(this.acceptedData.custom)) {
        tension = this.acceptedData.custom.tension;

        //Axis
        showXaxis = this.acceptedData.custom.showXaxis;
        showYaxis = this.acceptedData.custom.showYaxis;
        //Grid
        showYaxisGrid = this.acceptedData.custom.showYaxisGrid;
        showXaxisGrid = this.acceptedData.custom.showXaxisGrid;
        //Line Width
        borderWidth = this.acceptedData.custom.borderWidth;
      }

      return {
        cutout: "0%",
        spacing: 0,
        borderRadius: 0,
        tension: tension,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderRadius: 8,
        animation: true,
        borderWidth: borderWidth,
        //aspectRatio: 9,
        interaction: {
          mode: "nearest",
        },
        hover: {
          intersect: false,
        },
        borderSkipped: false,
        plugins: {
          legend: {
            display: false,
            position: "bottom",
          },
          tooltip: {
            position: "average",
            backgroundColor: "#fff",
            padding: 20,
            bodySpacing: 10,
            bodyFont: {
              size: 12,
            },
            titleFont: {
              size: 14,
              weight: "bold",
            },
            mode: "index",
            intersect: false,
            xAlign: "left",
            yAlign: "center",
            caretPadding: 10,
            cornerRadius: 4,
            borderColor: "rgba(162, 162, 162, 0.2)",
            borderWidth: 1,
            titleColor: "#333",
            bodyColor: "#777",
            titleMarginBottom: 10,
            bodyFontSize: 100,
            usePointStyle: true,

            enabled: false,

            external: (context) => {
              this.getTooltip(context);
            },
          },
        },
        scales: {
          x: {
            ticks: {
              display: showXaxis,
            },
            grid: {
              borderWidth: 0,
              display: showYaxisGrid,
              borderDash: [10, 8],
              color: "rgba(162, 162, 162, 0.4)",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              display: showYaxis,
            },
            grid: {
              borderWidth: 0,
              display: showXaxisGrid,
            },
          },
        },
      };
    },

    /**
     * Generate and manage a tooltip for a chart.
     *
     * @param {object} context - The tooltip context provided by Chart.js.
     * @returns {void}
     *
     * @since 3.2.13
     */
    getTooltip(context) {
      // Get or create tooltip element
      let tooltipEl = this.getOrCreateTooltipElement();

      const tooltipModel = context.tooltip;

      // Hide tooltip if its opacity is 0
      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
      }

      // Handle tooltip alignment
      this.alignTooltip(tooltipEl, tooltipModel);

      // If the tooltip has body content, set it
      if (tooltipModel.body) {
        this.setTooltipContent(tooltipEl, tooltipModel, context);
      }
    },

    /**
     * Retrieve existing tooltip element or create one if it doesn't exist.
     *
     * @returns {HTMLElement} - The tooltip element.
     *
     * @since 3.2.13
     */
    getOrCreateTooltipElement() {
      let tooltipEl = document.getElementById("chartjs-tooltip");
      if (!tooltipEl) {
        tooltipEl = document.createElement("div");
        tooltipEl.id = "chartjs-tooltip";
        tooltipEl.innerHTML = "<div class='uip-background-default uip-border uip-shadow uip-border-rounder uip-overflow-hidden'></div>";
        document.body.appendChild(tooltipEl);
      }
      return tooltipEl;
    },

    /**
     * Aligns the tooltip based on the model provided.
     *
     * @param {HTMLElement} tooltipEl - The tooltip element.
     * @param {object} tooltipModel - The tooltip model.
     * @returns {void}
     *
     * @since 3.2.13
     */
    alignTooltip(tooltipEl, tooltipModel) {
      tooltipEl.classList.remove("above", "below", "no-transform");
      if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
      } else {
        tooltipEl.classList.add("no-transform");
      }
    },

    /**
     * Sets the content and position for the tooltip.
     *
     * @param {HTMLElement} tooltipEl - The tooltip element.
     * @param {object} tooltipModel - The tooltip model.
     * @param {object} context - The tooltip context.
     * @returns {void}
     *
     * @since 3.2.13
     */
    setTooltipContent(tooltipEl, tooltipModel, context) {
      const dataset = tooltipModel.dataPoints[0].dataset;
      let tooltipHTML = `
            <div class="uip-background-default">
                <div class='uip-text-bold uip-padding-xs uip-border-bottom uip-body-font'>${dataset.label}</div>
                <div class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-xxs">
        `;

      tooltipModel.dataPoints.forEach((item, i) => {
        const label = item.label.split(";")[i];
        const color = tooltipModel.labelColors[i].borderColor;

        tooltipHTML += `
                <div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-between uip-w-125">
                    <div class="uip-text-bold" style="color:${color}">${item.formattedValue}</div>
                    <div class="uip-text-s uip-text-muted uip-no-wrap">${label}</div>
                </div>
            `;
      });

      tooltipHTML += "</div></div>";
      tooltipEl.querySelector("div").innerHTML = tooltipHTML;

      const position = context.chart.canvas.getBoundingClientRect();
      tooltipEl.style.opacity = 1;
      tooltipEl.style.position = "absolute";
      tooltipEl.style.left = `${position.left + window.pageXOffset + tooltipModel.caretX}px`;
      tooltipEl.style.top = `${position.top + window.pageYOffset + tooltipModel.caretY}px`;
      tooltipEl.style.padding = `${tooltipModel.padding}px ${tooltipModel.padding}px`;
      tooltipEl.style.pointerEvents = "none";
    },
  },
  template: `
       <canvas v-if="rendered" class="uip-min-w-100 uip-chart-canvas" ref="uipChart"></canvas>`,
};
