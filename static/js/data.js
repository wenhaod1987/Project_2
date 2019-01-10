// var button = d3.select("#click-me");
var inputField = d3.select("#input-field");

// This function is triggered when the button is clicked
function handleClick() {


  console.log(d3.event.target);
}

// We can use the `on` function in d3 to attach an event to the handler function
// button.on("click", handleClick);

// // You can also define the click handler inline
// button.on("click", function() {
//   console.log("Hi, a button was clicked!");
//   console.log(d3.event.target);
// });

// //Event handlers are just normal functions that can do anything you want
// button.on("click", function() {
//   d3.select(".giphy-me").html("<img src='https://gph.to/2Krfn0w' alt='giphy'>");
// });

// Input fields can trigger a change event when new text is entered.
inputField.on("change", function() {
  var zip_code = d3.event.target.value;
  d3.json(`/scrape/${zip_code}`, function(propertyData) {
  	propertyData.forEach(function(data){
	    data.HOA = +data.HOA;
	    data.dollar_per_sqfeet = +data.dollar_per_sqfeet;
	    data.price = +data.price;
	    data.sq_feet = +data.sq_feet;
	    data.year_built = +data.year_built;
	    data.lat = +data.lat;
	    data.long = +data.long;

  	createmap(propertyData);
  	secontChart(propertyData);


  
});
