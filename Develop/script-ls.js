$(document).foundation();

$(document).ready(function() {

    var chart;

    var abbrev = localStorage.getItem("Abbreviation");

    var queryURL = "https://covidtracking.com/api/v1/" + abbrev + "/daily.json";

    var posTestRatio;

    var maskAdvisoryButton = $(".maskAdvisoryButton");

    var socialDistancingButton = $(".socialDistancingButton");

    var travelRestrictionsButton = $(".travelRestrictionsButton");

    var newCasesButton = $(".newCasesTrendButton");

    var stateName = $(".stateName");

    function getData() {

      $.ajax({
          url: queryURL,
          method: "GET",
        }).then(function(response) {

          console.log(response[0]);

          // cumulative death total
          var todayTotDeaths = response[0].death;
          // new deaths for current day
          var todayDailyDeaths = response[0].deathIncrease;

          // cumulative hospitalized patient total
          var todayTotHospital = response[0].hospitalizedCumulative;
          // current number of hospitalized patients
          var todayCurrHospital = response[0].hospitalizedCurrently;
          // number of new hospital patients admitted today
          var todayIncHospital = response[0].hospitalizedIncrease;

          // cumulative ICU patient total
          var todayTotICU = response[0].inIcuCumulative;
          // current number of ICU patients
          var todayCurrICU = response[0].inIcuCurrently;

          // cumulative total of negative tests
          var todayTotNegative = response[0].negative;

          // cumulative total of patients put on ventilator
          var todayTotVent = response[0].onVentilatorCumulative;
          // current number of patients on ventilator
          var todayCurrVent = response[0].onVentilatorCurrently;

          // cumulative total of positive tests
          var todayTotPositive = response[0].positive;
          // number of new positive tests received today
          var todayIncPositive = response[0].positiveIncrease;

          // cumulative total of number of tests administered
          var todayTotTests = response[0].totalTestResults;
          // number of tests administered today
          var todayIncTests = response[0].totalTestResultsIncrease;

          // pulls today's date from ajax call
          var todayDate = JSON.stringify(response[0].date);

          // grabs current year
          var currentYear = todayDate.slice(0,4);

          // grabs current month
          var currentMonth = todayDate.slice(4,6);

          // grabs current day of month
          var currentDay = todayDate.slice(6,8);

          // formats to user-friendly date
          var formatTodayDate = currentMonth + "/" + currentDay + "/" + currentYear;

          function NA(x) {

            if (x === null) {
      
              x = "N/A"

              return x;
      
            } else if (x < 0) {

              x = 0;

              return x;

            }

            return x;
      
          }

          $("#updatedStatsDateSpan").text(NA(formatTodayDate));
          $(".todayTotPositiveSpan").text(NA(todayTotPositive));
          $("#todayIncPositiveSpan").text(NA(todayIncPositive));
          $("#todayTotDeathsSpan").text(NA(todayTotDeaths));
          $("#todayDailyDeathsSpan").text(NA(todayDailyDeaths));

          $(".todayTotPositiveSpan").text(NA(todayTotPositive));
          $("#todayTotNegativeSpan").text(NA(todayTotNegative));
          $("#todayTotTestsSpan").text(NA(todayTotTests));
          $("#todayIncTestsSpan").text(NA(todayIncTests));

          $("#todayCurrHospitalSpan").text(NA(todayCurrHospital));
          $("#todayIncHospitalSpan").text(NA(todayIncHospital));
          $("#todayTotHospitalSpan").text(NA(todayTotHospital));

          var dateArr = [];

          var posTestRatioArr = [];

          var posTestArr = [];

          var totTestArr = [];

          var upperLimit = 0;

          for (i = 31; i > 0; i--) {

            // cumulative death total
            var totDeaths = response[i].death;
            // new deaths for current day
            var dailyDeaths = response[i].deathIncrease;

            // cumulative hospitalized patient total
            var totHospital = response[i].hospitalizedCumulative;
            // current number of hospitalized patients
            var currHospital = response[i].hospitalizedCurrently;
            // number of new hospital patients admitted for this day
            var incHospital = response[i].hospitalizedIncrease;

            // cumulative ICU patient total
            var totICU = response[i].inIcuCumulative;
            // current number of ICU patients
            var currICU = response[i].inIcuCurrently;

            // cumulative total of negative tests
            var totNegative = response[i].negative;

            // cumulative total of patients put on ventilator
            var totVent = response[i].onVentilatorCumulative;
            // current number of patients on ventilator
            var currVent = response[i].onVentilatorCurrently;

            // cumulative total of positive tests
            var totPositive = response[i].positive;

            // number of new positive tests received on this day
            var incPositive = response[i].positiveIncrease;

            // cumulative total of number of tests administered
            var totTests = response[i].totalTestResults;
            // number of tests administered on this day
            var incTests = response[i].totalTestResultsIncrease;

            // pulls today's date from ajax call
            var date = JSON.stringify(response[i].date);

            // grabs current month
            var month = date.slice(4,6);

            if (month.charAt(0) == 0) {

              month = month.substring(1);

            }

            // grabs current day of month
            var day = date.slice(6,8);

            if (day.charAt(0) == 0) {

              day = day.substring(1);

            }

            // formats to user-friendly date
            var formatDate = month + "/" + day;

            dateArr.push(formatDate);

            posTestRatio = (incPositive/incTests) * 100;

            if (posTestRatio === 100 || posTestRatio > 100 || posTestRatio < 0 || incTests === 0) {

              incPositive = NaN;

            }

            if (incPositive !== NaN) {
              
              if (incPositive > upperLimit) {

              upperLimit = incPositive;

              }

            }

            posTestRatioArr.push(posTestRatio);

            posTestArr.push(incPositive);

            totTestArr.push(incTests);

          }

          console.log(upperLimit);

          var step = (upperLimit / 10).toFixed(0);

          if (chart) {
            
            chart.destroy();

          }

          var ctx = $('#myChart');

          chart = new Chart(ctx, {
      
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
              labels: dateArr,
              datasets: [{
                  label: 'Daily Positive Tests',
                  backgroundColor: 'transparent',
                  borderColor: '#753C75',
                  data: posTestArr
              }]
            },
            // Configuration options go here
            options: {
              maintainAspectRatio: false,
              title: {
                display: true,
                text: "Daily Positive Tests Over Last 30 Days",
                fontSize: 24
              },
              legend: {
                display: false,
              },
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: "Daily Positive Tests",
                    fontSize: 16
                  },
                  ticks: {
                    stepSize: step
                  }
                }],
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: "Date",
                    fontSize: 16,
                    padding: 0
                  }
                }]
              },
              tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        
                      var percent =  posTestRatioArr[tooltipItem.index].toFixed(2);

                      var pos = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

                      var tot = totTestArr[tooltipItem.index];

                      return "DPT per DTA: " + percent + "%" + "; DPT: " + pos + "; DTA: " + tot;

                    }
                }
            }
            }
          });

      })

    }

    function setStateName() {
        var stateAbbrev = localStorage.getItem("Abbreviation");

        if (stateAbbrev.length > 2) {
            stateAbbrev = stateAbbrev.substr(7, 2);
        }
        $(".selector-dropdown-country").each(function stateData() {
            if (stateAbbrev === this.dataset.stateAbbr) {
                var locationName = this.dataset.locationName;
                stateName.text(locationName);
                console.log("Changed to: " + locationName);
            }
        });

        $(".selector-dropdown").each(function stateData() {
            if (stateAbbrev === this.dataset.stateAbbr) {
                var locationName = this.dataset.locationName;
                stateName.text(locationName);
                console.log("Changed to: " + locationName);
            }
        });
    }

    // External Search Buttons for Alerts Bar
    function runYourSearch(search) {
        var googleURL = "https://www.google.com/search?q=Covid+%2B+" + $("#stateName-topBar").text() + "+%2B+" + search;
        window.open(googleURL, '_blank');
    }

    maskAdvisoryButton.on("click", function () {
        runYourSearch("mask+advisory");
    });
    socialDistancingButton.on("click", function () {
        runYourSearch("social+distancing+requirements");
    });
    travelRestrictionsButton.on("click", function () {
        runYourSearch("travel+restrictions");
    });
    newCasesButton.on("click", function () {
        runYourSearch("new+cases+trend");
    });

    // This function needs to be called on page load and every time the state is updated.
    setStateName();

    getData();

    $(".selector-dropdown").on("click", function(event) {

        event.preventDefault();

        var stateAbr = $(this).attr("data-state-abbr");

        localStorage.setItem("Abbreviation", "states/" + stateAbr);

        queryURL = "https://covidtracking.com/api/v1/states/" + stateAbr + "/daily.json";

        setStateName();

        getData();

    })

    $(".selector-dropdown-country").on("click", function(event) {

      event.preventDefault();

      localStorage.setItem("Abbreviation", "us");

      queryURL = "https://covidtracking.com/api/v1/us/daily.json";

      setStateName();

      getData();

    })

})