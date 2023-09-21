import * as charts from '../../libs/charts.min.js';
export function moduleData() {
  return {
    props: {
      chartData: Object,
    },
    data: function () {
      return {
        chart: false,
        loading: false,
        acceptedData: false,
        rendered: true,
      };
    },
    inject: ['uipress'],
    watch: {
      chartData: {
        handler(newValue, oldValue) {
          if (JSON.stringify(newValue) == JSON.stringify(this.acceptedData)) {
            return;
          }
          let self = this;
          self.chart.destroy();
          self.chart = false;
          self.acceptedData = JSON.parse(JSON.stringify(self.chartData));
          self.rendered = false;
          requestAnimationFrame(function () {
            self.rendered = true;
            self.createChart();
          });
        },
        deep: true,
      },
    },
    computed: {},
    mounted: function () {
      this.acceptedData = JSON.parse(JSON.stringify(this.chartData));
      this.createChart();
    },
    methods: {
      createChart() {
        let self = this;

        if (self.chart) {
          return;
        }

        let style = getComputedStyle(document.documentElement);
        let primaryColorstyle = style.getPropertyValue('--uip-color-accent');
        let lightColorstyle = style.getPropertyValue('--uip-color-red-lighter');

        if (self.acceptedData.colors.main != '') {
          primaryColorstyle = self.acceptedData.colors.main;
        }
        if (self.acceptedData.colors.comp != '') {
          lightColorstyle = self.acceptedData.colors.comp;
        }

        let labels = self.formatLabels(this.acceptedData.labels);

        let dataBackground = '';
        let fillDataBackground = false;
        let compBackground = '';
        let fillCompBackground = false;
        if (self.uipress.isObject(self.acceptedData.custom)) {
          dataBackground = self.acceptedData.custom.dataBackground;
          if (dataBackground) {
            fillDataBackground = true;
          }
          //Comparison
          compBackground = self.acceptedData.custom.compBackground;
          if (compBackground) {
            fillCompBackground = true;
          }
        }

        let data = {
          labels: labels,
          datasets: [
            {
              label: self.acceptedData.title,
              backgroundColor: dataBackground,
              fill: fillDataBackground,
              borderColor: primaryColorstyle,
              data: self.acceptedData.data.main,
            },
          ],
        };

        if (self.acceptedData.data.comparison.length > 0) {
          data.datasets.push({
            label: self.acceptedData.title,
            backgroundColor: compBackground,
            fill: fillCompBackground,
            borderColor: lightColorstyle,
            data: self.acceptedData.data.comparison,
          });
        }

        const config = {
          type: self.acceptedData.type,
          data: data,
          options: self.buildTheChartOptions(),
        };

        self.chart = new Chart(self.$refs.uipChart, config);
      },
      formatLabels(labels) {
        let formatted = [];
        for (let [index, value] of labels.main.entries()) {
          let processed = value;
          if (labels.comparison) {
            if (labels.comparison[index]) {
              processed = value + ';' + labels.comparison[index];
            }
          }
          formatted.push(processed);
        }

        return formatted;
      },
      buildTheChartOptions() {
        let self = this;

        let tension = 0.15;
        let showXaxis = false;
        let showYaxis = false;
        let showYaxisGrid = true;
        let showXaxisGrid = false;
        let borderWidth = 3;
        if (self.uipress.isObject(self.acceptedData.custom)) {
          tension = self.acceptedData.custom.tension;

          //Axis
          showXaxis = self.acceptedData.custom.showXaxis;
          showYaxis = self.acceptedData.custom.showYaxis;
          //Grid
          showYaxisGrid = self.acceptedData.custom.showYaxisGrid;
          showXaxisGrid = self.acceptedData.custom.showXaxisGrid;
          //Line Width
          borderWidth = self.acceptedData.custom.borderWidth;
        }

        return {
          cutout: '0%',
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
            mode: 'nearest',
          },
          hover: {
            intersect: false,
          },
          borderSkipped: false,
          plugins: {
            legend: {
              display: false,
              position: 'bottom',
            },
            tooltip: {
              position: 'average',
              backgroundColor: '#fff',
              padding: 20,
              bodySpacing: 10,
              bodyFont: {
                size: 12,
              },
              titleFont: {
                size: 14,
                weight: 'bold',
              },
              mode: 'index',
              intersect: false,
              xAlign: 'left',
              yAlign: 'center',
              caretPadding: 10,
              cornerRadius: 4,
              borderColor: 'rgba(162, 162, 162, 0.2)',
              borderWidth: 1,
              titleColor: '#333',
              bodyColor: '#777',
              titleMarginBottom: 10,
              bodyFontSize: 100,
              usePointStyle: true,

              enabled: false,

              external: function (context) {
                self.getTooltip(context);
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
                color: 'rgba(162, 162, 162, 0.4)',
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
      getTooltip(context) {
        // Tooltip Element
        let tooltipEl = document.getElementById('chartjs-tooltip');

        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div');
          tooltipEl.id = 'chartjs-tooltip';
          tooltipEl.innerHTML = "<div class='uip-background-default uip-boder uip-shadow uip-border-rounder uip-overflow-hidden'></div>";
          document.body.appendChild(tooltipEl);
        }

        // Hide if no tooltip
        let tooltipModel = context.tooltip;
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = 0;
          return;
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
          tooltipEl.classList.add(tooltipModel.yAlign);
        } else {
          tooltipEl.classList.add('no-transform');
        }

        function getBody(bodyItem) {
          return bodyItem.lines;
        }

        // Set Text
        if (tooltipModel.body) {
          let titleLines = tooltipModel.title || [];
          let bodyLines = tooltipModel.body.map(getBody);

          ///
          ///
          ///
          ///
          let dataset = tooltipModel.dataPoints[0].dataset;
          let tipTitle = dataset.label;
          let tooltipHTML = '<div class="uip-background-default">';
          tooltipHTML += "<div class='uip-text-bold uip-padding-xs uip-border-bottom uip-body-font'>" + tipTitle + '</div>';

          tooltipHTML += '<div class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-xxs">';
          ///Loop through data points and add data
          tooltipModel.dataPoints.forEach(function (item, i) {
            //Get label
            let label = item.label.split(';')[i];
            let color = tooltipModel.labelColors[i].borderColor;

            tooltipHTML += '<div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-between uip-w-125">';
            tooltipHTML += '<div class="uip-text-bold" style="color:' + color + '">' + item.formattedValue + '</div>';
            tooltipHTML += '<div class="uip-text-s uip-text-muted uip-no-wrap">' + label + '</div>';
            tooltipHTML += '</div>';
          });

          tooltipHTML += '</div>';
          tooltipHTML += '</div>';
          ///
          ///
          //Set content
          let tableRoot = tooltipEl.querySelector('div');
          tableRoot.innerHTML = tooltipHTML;
          ///
          ///
          //Set position of tooltip
          // Display, position, and set styles for font
          let position = context.chart.canvas.getBoundingClientRect();
          let bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);
          //
          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
          tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
          tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
          tooltipEl.style.pointerEvents = 'none';
        }

        // Display, position, and set styles for font
      },
    },
    template: `
       <canvas v-if="rendered" class="uip-min-w-100 uip-chart-canvas" ref="uipChart"></canvas>`,
  };
}
