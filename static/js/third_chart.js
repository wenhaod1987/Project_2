// globel var to save selected property and pass to each function
window.selectProperty=[];

//load google charts packages
google.charts.load('current', {'packages':['corechart']});
google.charts.load('current', {'packages':['bar']});



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selProperty");

  // append the list of property
  d3.json('/data', function(propertyData){
    window.selectProperty=propertyData[0]
    propertyData.forEach((data) => {
      selector
        .append("option")
        .text(`${data.address}, ${data.city}; Type:${data.property_type}; Price:$${data.price}`)
        //use _id from Mongodb as value
        .property("value", data._id);
    });   
  });
}
init();


//setup function when select an option
function optionChanged(newPropertyID) {

  d3.json('/data',function(propertyData){
    propertyData.forEach(data => {
      //use the value of each option to select the property and pass to global var
      if (data._id === newPropertyID){
        window.selectProperty=data;
      }
    })
  //change the chart
  initChart()

  })


}

//Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(initChart);

//required function by callback above
function initChart(){
  d3.json('/data',function(propertyData){  
  propertyData.forEach(function(data){
    data.HOA = +data.HOA;
    data.dollar_per_sqfeet = +data.dollar_per_sqfeet;
    data.price = +data.price;
    data.sq_feet = +data.sq_feet;
    data.year_built = +data.year_built;
    data.lat = +data.lat;
    data.long = +data.long;
  }); 

  drawPieChart(propertyData);
  drawPriceBar(propertyData,window.selectProperty);
  drawSFPriceBar(propertyData,window.selectProperty);
}) 

}
//google chart function for pie chart
function drawPieChart(propertyData) {
  var condoCount=0;
  var singleFamilyCount=0;
  var multiFamilyCount=0;
  var townhouseCount=0;
  var otherCount=0;
  propertyData.forEach(function(data){
    if (data.property_type ==="Condo"){
      condoCount = condoCount+1;
    }
    else if (data.property_type ==="Townhouse"){
      townhouseCount = townhouseCount+1;
    }
    else if (data.property_type ==="Single-Family"){
      singleFamilyCount = singleFamilyCount+1;
    }
    else if (data.property_type ==="Multi-Family"){
      multiFamilyCount = multiFamilyCount+1;
    }
    else {
      otherCount = otherCount+1;
    }
  })

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'propertyType');
  data.addColumn('number', 'Count');
  data.addRows([
    ['Condo', condoCount],
    ['Townhouse', townhouseCount],
    ['Single-Family', singleFamilyCount],
    ['Multi-Family', multiFamilyCount],
    ['Other', otherCount]
  ]);

      // Set chart options
  var options = {
      'title':'Property Type Percentage',
      'width':400,
      'height':300,

    };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('pie_div'));
  chart.draw(data, options);      
};

function drawPriceBar(propertyData,selectProperty) {
//price list of same property type
  var priceList=[];

//price list of same badroom and bathroom
  var bbpriceList=[];

//price list of simillar size
  var SSpriceList=[];

//price list of same location
  var locationPriceList=[];


  propertyData.forEach(function(data){
    if (data.property_type===selectProperty.property_type){
      priceList.push(data.price);

    }
    if (data.BnB===selectProperty.BnB){
      bbpriceList.push(data.price);

    }
    if (data.sq_feet<selectProperty.sq_feet+100 && data.sq_feet>selectProperty.sq_feet-100){
      SSpriceList.push(data.price);

    }

    if (data.location===selectProperty.location){
      locationPriceList.push(data.price);
    }

  })


    var data = google.visualization.arrayToDataTable([
      ['Price (US Dollar)', 'Selected', 'Average', 'Maximum','Minimum'],
      [selectProperty.property_type, selectProperty.price, calMean(priceList), Math.max(...priceList),Math.min(...priceList)],
      [selectProperty.BnB, selectProperty.price, calMean(bbpriceList), Math.max(...bbpriceList),Math.min(...bbpriceList)],
      [`${selectProperty.sq_feet-100}sf ~ ${selectProperty.sq_feet+100}sf`, selectProperty.price,calMean(SSpriceList), Math.max(...SSpriceList),Math.min(...SSpriceList)],
      [selectProperty.location, selectProperty.price, calMean(locationPriceList), Math.max(...locationPriceList),Math.min(...locationPriceList)],
    ]);

    var options = {
      chart: {
        title: 'Selected Property size Comparison',

      },
      'width':600,
      'height':300,
    };

    var chart = new google.charts.Bar(document.getElementById('bar_div1'));

    chart.draw(data, google.charts.Bar.convertOptions(options));

};

//compare unit price
function drawSFPriceBar(propertyData,selectProperty) {
//list of same property type

  var dollarSFList=[];
//list of same badroom and bathroom

  var bbdollarSFList=[]

//list of simillar size

  var SSdollarSFList=[];
//list of same location
  var locationSFPriceList=[];


  propertyData.forEach(function(data){
    if (data.property_type===selectProperty.property_type){
      // priceList.push(data.price);
      // squareList.push(data.sq_feet);
      dollarSFList.push(data.dollar_per_sqfeet);
    }
    if (data.BnB===selectProperty.BnB){
      // bbpriceList.push(data.price);
      // bbsquareList.push(data.sq_feet);
      bbdollarSFList.push(data.dollar_per_sqfeet);
    }
    if (data.sq_feet<selectProperty.sq_feet+100 && data.sq_feet>selectProperty.sq_feet-100){
      // SSpriceList.push(data.price);
      // SSsquareList.push(data.sq_feet);
      SSdollarSFList.push(data.dollar_per_sqfeet);
    }

    if (data.location===selectProperty.location){
      locationSFPriceList.push(data.dollar_per_sqfeet);
    }

  })


    var data = google.visualization.arrayToDataTable([
      ['Price per Square Feet (US Dollar) ', 'Selected', 'Average', 'Maximum','Minimum'],
      [selectProperty.property_type, selectProperty.dollar_per_sqfeet, calMean(dollarSFList), Math.max(...dollarSFList),Math.min(...dollarSFList)],
      [selectProperty.BnB, selectProperty.dollar_per_sqfeet, calMean(bbdollarSFList), Math.max(...bbdollarSFList),Math.min(...bbdollarSFList)],
      [`${selectProperty.sq_feet-100}sf ~ ${selectProperty.sq_feet+100}sf`, selectProperty.dollar_per_sqfeet,calMean(SSdollarSFList), Math.max(...SSdollarSFList),Math.min(...SSdollarSFList)],
      [selectProperty.location, selectProperty.dollar_per_sqfeet, calMean(locationSFPriceList), Math.max(...locationSFPriceList),Math.min(...locationSFPriceList)],
    ]);

    var options = {
      chart: {
        title: 'Selected Property Unit Price Comparison',

      },
      'width':600,
      'height':300,
    };

    var chart = new google.charts.Bar(document.getElementById('bar_div2'));

    chart.draw(data, google.charts.Bar.convertOptions(options));

};




function calMean(arr){
  var sum=0;
  for (var i=0;i<arr.length;i++){
    sum = sum+arr[i];
  }
  return Math.round(sum/(arr.length));
}