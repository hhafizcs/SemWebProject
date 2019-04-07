google.charts.load('current', { 'packages': ['corechart'] });

let query1 = "https://data-gov.tw.rpi.edu/sparql?query-option=text&query=SELECT+%28xsd%3Astring%28%3Fstate%29%29+SUM%28xsd%3Ainteger%28%3FreturnNum%29%29%0D%0AWHERE+%0D%0A%7B%0D%0A++GRAPH+%3Fg%0D%0A++%7B%0D%0A++++%3FmigrationEntry+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2Fvocab%2Fp%2F1146%2Fstate_code_dest%3E+%3Fstate+.%0D%0A++++%3FmigrationEntry+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2Fvocab%2Fp%2F1146%2Freturn_num%3E+%3FreturnNum+.%0D%0A++++%3FmigrationEntry+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2Fvocab%2Fp%2F1146%2Fyears%3E+%222007-2008%22+.%0D%0A++++%3Fs+a+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2F2009%2Fdata-gov-twc.rdf%23Dataset%3E+.%0D%0A++++FILTER+%28+regex%28+str%28%3Fg%29+%2C+%22Dataset_1148%22%29+%26%26+str%28%3Fstate%29+%21%3D+%2200%22+%29%0D%0A++%7D%0D%0A%7D%0D%0AGROUP+BY+%3Fstate&service-uri=&output=exhibit&callback=&tqx=&tp=";
let query2 = "https://data-gov.tw.rpi.edu/sparql?query-option=text&query=SELECT+%28xsd%3Astring%28%3Fstate%29%29+SUM%28xsd%3Ainteger%28%3FreturnNum%29%29%0D%0AWHERE+%0D%0A%7B%0D%0A++GRAPH+%3Fg%0D%0A++%7B%0D%0A++++%3FmigrationEntry+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2Fvocab%2Fp%2F1146%2Fstate_code_origin%3E+%3Fstate+.%0D%0A++++%3FmigrationEntry+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2Fvocab%2Fp%2F1146%2Freturn_num%3E+%3FreturnNum+.%0D%0A++++%3FmigrationEntry+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2Fvocab%2Fp%2F1146%2Fyears%3E+%222007-2008%22+.%0D%0A++++%3Fs+a+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2F2009%2Fdata-gov-twc.rdf%23Dataset%3E+.%0D%0A++++FILTER+%28+regex%28+str%28%3Fg%29+%2C+%22Dataset_1148%22%29+%26%26+str%28%3Fstate%29+%21%3D+%2200%22+%29%0D%0A++%7D%0D%0A%7D%0D%0AGROUP+BY+%3Fstate&service-uri=&output=exhibit&callback=&tqx=&tp=";
let query3 = "https://data-gov.tw.rpi.edu/sparql?query-option=text&query=SELECT+%28xsd%3Astring%28%3Fstate%29%29+AVG%28xsd%3Afloat%28%3Fscore%29%29%0D%0AWHERE%0D%0A%7B%0D%0A++GRAPH+%3Fg%0D%0A++%7B%0D%0A++++%3FinspectionEntry+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2Fvocab%2Fp%2F1259%2Finspection_score%3E+%3Fscore+.%0D%0A++++%3FinspectionEntry+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2Fvocab%2Fp%2F1259%2Fstate_code%3E+%3Fstate+.%0D%0A++++%3FinspectionEntry+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2Fvocab%2Fp%2F1259%2Finspection_date%3E+%3Fdate+.%0D%0A++++%3Fs+a+%3Chttp%3A%2F%2Fdata-gov.tw.rpi.edu%2F2009%2Fdata-gov-twc.rdf%23Dataset%3E+.%0D%0A++++FILTER+%28+regex%28+str%28%3Fg%29+%2C+%22Dataset_1259%22%29+%26%26+str%28%3Fstate%29+%21%3D+%2200%22+%26%26+%28+regex%28+%3Fdate+%2C+%222008%22%29+%7C%7C+regex%28+%3Fdate+%2C+%222007%22%29+%29+%29%0D%0A++%7D%0D%0A%7D%0D%0AGROUP+BY+%3Fstate&service-uri=&output=exhibit&callback=&tqx=&tp=";

let promises = [getData(query1), getData(query2), getData(query3)];
Promise.all(promises).then(data => {
  document.getElementById("loadContainer").style.display = "none";
  initialize(data);
});

function getData(url) {
  return new Promise((resolve) => {
    let xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        resolve(xhttp.responseText.toString());
      }
    };
    
    xhttp.open("GET", url, true);
    xhttp.send();
  });
}

function initialize(data) {
  let firstChartData = [['State', 'Migration In', 'Inspection Score']];
  let migInData = JSON.parse(data[0]).items;
  let migInStates = migInData.map(ele => ele['callret-0']);
  let migInMigrations = migInData.map(ele => ele['callret-1']);
  
  migInData.forEach((e, i) => {
      var possibleScore = JSON.parse(data[2]).items.filter(element => element['callret-0'] == migInStates[i])[0];

      if(possibleScore) {
        var stateName = stateInfo.filter(element => element["stateNum"] == migInStates[i])[0]["stateName"];
        var statePopulation = stateInfo.filter(element => element["stateNum"] == migInStates[i])[0]["statePop"];
        var MigInPercent = migInMigrations[i] * 100 / (migInMigrations[i] + statePopulation);
        firstChartData.push([stateName, MigInPercent, possibleScore['callret-1']]);
      }
  });

  firstChartData.sort(sortByStateName);
  
  google.charts.setOnLoadCallback(drawChart("Percentage of Migration In vs Average Inspection Score for US States in 2007-2008",
    "Migration In", "Inspection Score", firstChartData, 'chart_div_1'));

  let secondChartData = [['State', 'Migration Out', 'Inspection Score']];
  let migOutData = JSON.parse(data[1]).items;
  let migOutStates = migOutData.map(ele => ele['callret-0']);
  let migOutMigrations = migOutData.map(ele => ele['callret-1']);

  migOutData.forEach((e, i) => {
    var possibleScore = JSON.parse(data[2]).items.filter(element => element['callret-0'] == migOutStates[i])[0];

    if(possibleScore) {
      var stateName = stateInfo.filter(element => element["stateNum"] == migOutStates[i])[0]["stateName"];
      var statePopulation = stateInfo.filter(element => element["stateNum"] == migOutStates[i])[0]["statePop"];
      var MigOutPercent = migOutMigrations[i] * 100 / (migOutMigrations[i] + statePopulation);
      secondChartData.push([stateName, MigOutPercent, possibleScore['callret-1']]);
    }
  });

  secondChartData.sort(sortByStateName);
  
  google.charts.setOnLoadCallback(drawChart("Percentage of Migration Out vs Average Inspection Score for US States in 2007-2008",
    "Migration Out", "Inspection Score", secondChartData, 'chart_div_2'));
}

function drawChart(title, column1Name, column2Name, data, chartDivId) {
  var data = google.visualization.arrayToDataTable(data);
  var options = {
    height: 768,
    width: 1024,
    series: {
      0: { targetAxisIndex: 0 },
      1: { targetAxisIndex: 1 }
    },
    title: title,
    vAxes: {
      0: { title: column1Name },
      1: { title: column2Name }
    },
    hAxis: {
      textPosition: "none"
    }
  };

  var chart = new google.visualization.ColumnChart(document.getElementById(chartDivId));
  chart.draw(data, options);
}

function sortByStateName(a, b) {
  if(a[0] === "State") {
    return -1;
  } else if(b[0] === "State") {
    return 1;
  } else if (a[0] === b[0]) {
    return 0;
  } else {
    return (a[0] < b[0]) ? -1 : 1;
  }
}

var stateInfo = [
  { stateNum:"01", stateName: "Alabama", statePop: 4779735 },
  { stateNum:"02", stateName: "Alaska", statePop: 710231 },
  { stateNum:"04", stateName: "Arizona", statePop: 6329013 },
  { stateNum:"05", stateName: "Arkansas", statePop: 2915921 },
  { stateNum:"06", stateName: "California", statePop: 37253956 },
  { stateNum:"08", stateName: "Colorado", statePop: 5029196 },
  { stateNum:"09", stateName: "Connecticut", statePop: 3574097 },
  { stateNum:"10", stateName: "Delaware", statePop: 897934 },
  { stateNum:"11", stateName: "DC", statePop: 601723 },
  { stateNum:"12", stateName: "Florida", statePop: 18801311 },
  { stateNum:"13", stateName: "Georgia", statePop: 9687653 },
  { stateNum:"15", stateName: "Hawaii", statePop: 1360301 },
  { stateNum:"16", stateName: "Idaho", statePop: 1567582 },
  { stateNum:"17", stateName: "Illinois", statePop: 12830632 },
  { stateNum:"18", stateName: "Indiana", statePop: 6483800 },
  { stateNum:"19", stateName: "Iowa", statePop: 3046350 },
  { stateNum:"20", stateName: "Kansas", statePop: 2853118 },
  { stateNum:"21", stateName: "Kentucky", statePop: 4339362 },
  { stateNum:"22", stateName: "Louisiana", statePop: 4515770 },
  { stateNum:"23", stateName: "Maine", statePop: 1328361 },
  { stateNum:"24", stateName: "Maryland", statePop: 5773552 },
  { stateNum:"25", stateName: "Massachusetts", statePop: 6547629 },
  { stateNum:"26", stateName: "Michigan", statePop: 9883635 },
  { stateNum:"27", stateName: "Minnesota", statePop: 5303925 },
  { stateNum:"28", stateName: "Mississippi", statePop: 2967297 },
  { stateNum:"29", stateName: "Missouri", statePop: 5988927 },
  { stateNum:"30", stateName: "Montana", statePop: 989415 },
  { stateNum:"31", stateName: "Nebraska", statePop: 1826341 },
  { stateNum:"32", stateName: "Nevada", statePop: 2700551 },
  { stateNum:"33", stateName: "New Hampshire", statePop: 1316472 },
  { stateNum:"34", stateName: "New Jersey", statePop: 8791894 },
  { stateNum:"35", stateName: "New Mexico", statePop: 2059180 },
  { stateNum:"36", stateName: "New York", statePop: 19378104 },
  { stateNum:"37", stateName: "North Carolina", statePop: 9535475 },
  { stateNum:"38", stateName: "North Dakota", statePop: 672591 },
  { stateNum:"39", stateName: "Ohio", statePop: 11536502 },
  { stateNum:"40", stateName: "Oklahoma", statePop: 3751354 },
  { stateNum:"41", stateName: "Oregon", statePop: 3831074 },
  { stateNum:"42", stateName: "Pennsylvania", statePop: 12702379 },
  { stateNum:"44", stateName: "Rhode Island", statePop: 1052567 },
  { stateNum:"45", stateName: "South Carolina", statePop: 4625364 },
  { stateNum:"46", stateName: "South Dakota", statePop: 814180 },
  { stateNum:"47", stateName: "Tennessee", statePop: 6346110 },
  { stateNum:"48", stateName: "Texas", statePop: 25145561 },
  { stateNum:"49", stateName: "Utah", statePop: 2763885 },
  { stateNum:"50", stateName: "Vermont", statePop: 625741 },
  { stateNum:"51", stateName: "Virginia", statePop: 8001024 },
  { stateNum:"53", stateName: "Washington", statePop: 6724540 },
  { stateNum:"54", stateName: "West Virginia", statePop: 1852996 },
  { stateNum:"55", stateName: "Wisconsin", statePop: 5686986 },
  { stateNum:"56", stateName: "Wyoming", statePop: 563626 }
];