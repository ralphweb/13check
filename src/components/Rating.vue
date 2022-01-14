<template>
  <div class="rating transition mt-4 pt-4">
    <div class="ratingChartEnclosure transition w-100 h-100">
      <line-chart
        :chart-data="datacollection"
        :options="options"
        v-if="dataLoaded"
        class="w-100 d-inline h-100"
      ></line-chart>
    </div>
    <div class="ratingControl transition p-4">
      <div class="form-group transition">
        Mostrar:
        <select id="ratingRange" v-model="range">
          <option value="15@minutes" selected="selected"
            >Los últimos 15 minutos</option
          >
          <option value="1@hours">La última hora</option>
          <option value="24@hours">Las últimas 24 horas</option>
          <option value="7@days">Los últimos 7 días</option>
          <option value="30@days">Los últimos 30 días</option>
        </select>
      </div>
      <div class="form-group transition">
        Por:
        <select id="ratingUnit" v-model="unit">
          <option value="minute" selected="selected">Minuto</option>
          <option value="hour">Hora</option>
          <option value="day">Día</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import LineChart from "./LineChart.js";
import { getRating } from "@/helpers/API.js";

export default {
  name: "rating",
  components: {
    LineChart,
  },
  data() {
    return {
      dataLoaded: false,
      unit: "minute",
      range: "15@minutes",
      datacollection: { labels: [], datasets: [] },
      options: {
        //aspectRatio: 1.75,
        responsive: true,
        maintainAspectRatio: false,
        legendCallback: function(chart) {
          if (chart.data.datasets.length > 0) {
            var legendHtml = [];
            legendHtml.push("<table>");
            var localdatasets = chart.data.datasets;
            localdatasets.sort(function(a, b) {
              const ratingA = a.data[a.data.length - 1];
              const ratingB = b.data[b.data.length - 1];

              let comparison = 0;
              if (ratingA > ratingB) {
                comparison = -1;
              } else if (ratingA < ratingB) {
                comparison = 1;
              }
              return comparison;
            });

            var cableindex = localdatasets.findIndex(function(a) {
              return a.label == "Cable";
            });

            var cableObj = localdatasets[cableindex];
            localdatasets.splice(cableindex, 1);
            localdatasets.unshift(cableObj);

            for (var i = 0; i < localdatasets.length; i++) {
              var active = "";
              var backgroundColor = "";
              //if($(".channel.current").attr("id").indexOf(localdatasets[i].idRating)!=-1) active = ' class="active"';
              if (i == 0)
                backgroundColor =
                  'style="background-color:' +
                  localdatasets[i].borderColor +
                  '"';
              var logocanal =
                localdatasets[i].logo != undefined
                  ? localdatasets[i].logo.replace(/\\/g, "/")
                  : localdatasets[i].logo;
              legendHtml.push(
                `<tr ${active} id="tr${localdatasets[i].idRating}" ${backgroundColor}><td><div class="chart-legend" onclick="updateDataset(event, '${i}', this)" style="background-image:url(${logocanal})"></div></td>`
              );
              console.log(
                `<tr ${active} id="tr${localdatasets[i].idRating}" ${backgroundColor}><td><div class="chart-legend" onclick="updateDataset(event, '${i}', this)" style="background-image:url(${logocanal})"></div></td>`
              );
              //legendHtml.push('<tr'+active+' id="tr'+localdatasets[i].idRating+'" '+backgroundColor+'><td><div class="chart-legend" style="background-image:url(' + logocanal + ')"></div></td>');
              if (chart.data.datasets[i].label) {
                legendHtml.push(
                  '<td class="chart-legend-label-text" onclick="updateDataset(event, ' +
                    "'" +
                    i +
                    "'" +
                    ', this)">' +
                    localdatasets[i].label +
                    " (" +
                    Math.round(
                      localdatasets[i].data[localdatasets[i].data.length - 1]
                    ) +
                    ")</td></tr>"
                );
                //legendHtml.push('<td class="chart-legend-label-text">' + localdatasets[i].label + ' ('+Math.round(localdatasets[i].data[localdatasets[i].data.length-1])+')</td></tr>');
              }
            }

            legendHtml.push("</table>");
            return legendHtml.join("");
          } else {
            return "No hay datos de rating para la fecha seleccionada.";
          }
        },
        legend: {
          display: false,
        },
        tooltips: {
          mode: "index",
          intersect: true,
          position: "nearest",
          colorBoxes: true,
          callbacks: {
            label: function(tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || "";

              if (label) {
                label += ": ";
              }
              label += Math.round(tooltipItem.yLabel);
              return label;
            },
          },
          itemSort: function(a, b) {
            const ratingA = Math.round(a.yLabel);
            const ratingB = Math.round(b.yLabel);

            let comparison = 0;
            if (ratingA > ratingB) {
              comparison = -1;
            } else if (ratingA < ratingB) {
              comparison = 1;
            }
            return comparison;
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
      datasetsFromDB: [],
    };
  },
  mounted() {
    this.fillRatingData();
  },
  props: {},
  methods: {
    queryRatingData(callback) {
      var that = this;
      var ratingRange = that.range.split("@");
      var start = that.currentTime
        .clone()
        .tz("America/Santiago")
        .subtract(parseInt(ratingRange[0]), ratingRange[1])
        .format("YYYY-MM-DD HH:mm");
      var end = that.currentTime
        .clone()
        .tz("America/Santiago")
        .format("YYYY-MM-DD HH:mm");
      getRating(start, end, that.unit)
        .then((data) => {
          callback(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fillRatingData() {
      var that = this;
      this.dataLoaded = false;
      try {
        that.queryRatingData(function(result) {
          that.datasetsFromDB = [];
          if (result.data.length > 0) {
            var ratingSignals = result.data[0];
            var lastRating = result.data[result.data.length - 1];
            /** calculate share and update rating in player */
            delete lastRating["cable"];
            delete lastRating["hogar"];
            delete lastRating["timestamp"];
            delete lastRating["fecha"];
            delete lastRating["hora"];
            delete lastRating["id"];
            delete lastRating["created"];
            delete lastRating["updated"];
            var total = 0;
            Object.keys(lastRating).forEach(function(key) {
              total += parseFloat(lastRating[key]);
            });
            that.signals.forEach(function(signal) {
              signal.rating = Math.round(lastRating[signal.idRating]);
              signal.share =
                Math.round((lastRating[signal.idRating] / total) * 100) + "%";

              var indexS = Object.keys(ratingSignals).findIndex(
                (x) => x === signal.idRating
              );
              if (indexS != -1) {
                var channel = {
                  label: signal.name,
                  data: [],
                  backgroundColor: signal.color,
                  borderColor: signal.colorBorde,
                  idRating: signal.idRating,
                  logo: signal.logo,
                };
                that.datasetsFromDB.push(channel);
              }
            });

            that.datacollection.datasets = that.datasetsFromDB;

            var labels = result.data.map(function(e) {
              return moment(e.timestamp)
                .tz("America/Santiago")
                .format("DD/MM HH:mm");
            });

            Object.keys(ratingSignals).forEach(function(key, index) {
              var index = that.datacollection.datasets.findIndex(
                (x) => x.idRating.toLowerCase() === key
              );
              if (index != -1) {
                var ratingData = result.data.map(function(e) {
                  return e[key];
                });
                that.datacollection.labels = labels;
                that.datacollection.datasets[index].data = ratingData;
              }
            });
            var deleted = [];
            that.datacollection.datasets.forEach(function(dataset, index) {
              var indexS = Object.keys(ratingSignals).findIndex(
                (x) => x === dataset.idRating
              );
              if (indexS == -1) deleted.push(index);
            });
            deleted.forEach(function(deletedIndex) {
              that.datacollection.datasets.splice(deletedIndex, 1);
            });
            // re-render the chart
            /*
            document.getElementById(
              "chartjs-legend"
            ).innerHTML = chart.generateLegend();*/
          } else {
            that.datacollection.datasets = [];
            console.log("no rating data for selected date and time");
            that.signals.forEach(function(signal) {
              delete signal.rating;
              delete signal.share;
            });
          }
          that.dataLoaded = true;
        });
      } catch (e) {
        console.log("fillRating");
        console.log(e);
      }
    },
  },
  computed: {
    currentTime: {
      get() {
        return moment(this.$store.state.currentTime).tz("America/Santiago");
      },
    },
    signals: {
      get() {
        return this.$store.state.signals;
      },
      set(value) {
        this.$store.commit("SET_SIGNALS", value);
      },
    },
  },
  watch: {
    currentTime: {
      immediate: true,
      handler(newCurrentTime, oldCurrentTime) {
        if (
          newCurrentTime &&
          oldCurrentTime &&
          newCurrentTime.get("minutes") != oldCurrentTime.get("minutes")
        ) {
          this.fillRatingData();
        }
      },
    },
    unit: {
      immediate: true,
      handler(newunit, oldunit) {
        if (newunit && oldunit && newunit != oldunit) {
          this.fillRatingData();
        }
      },
    },
    range: {
      immediate: true,
      handler(newrange, oldrange) {
        if (newrange && oldrange && newrange != oldrange) {
          this.fillRatingData();
        }
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.rating {
  max-height: 800px;
}
</style>
