
//define size of svg and margin

var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#secondChart")
	.append("svg")
	.attr("width",svgWidth)
	.attr("height",svgHeight);

//Append SVG group
var chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);


//initial x and y axis
var chosenX = "sq_feet";
var chosenY = "price";

//setup function to setup scales 
//updated
function setScaleX(propertyData, chosenX){
	if (chosenX ==="sq_feet"){
		var xLinearScale = d3.scaleLinear()
			.domain([d3.min(propertyData, d => d[chosenX]*0.8)
				,d3.max(propertyData, d=>d[chosenX]*1.2)])
			.range([0,width]);
		return xLinearScale;
	}
	else {
		var scaleList = [];
		propertyData.forEach(data =>{
			scaleList.push(data[chosenX])
		})
		scaleList=scaleList.sort()

		var xLinearScale = d3.scaleBand()
		  .domain(scaleList)
		  .range([0, svgWidth]);
		return xLinearScale;
	}
}
//updated
function setScaleY(propertyData, chosenY){
	var yLinearScale = d3.scaleLinear()
		.domain([d3.min(propertyData, d => d[chosenY]*0.9)
			,d3.max(propertyData, d=>d[chosenY]*1.1)])
		.range([height,0]);
	return yLinearScale;
	
	
};



//setup function to set tooltip 
function updateTooltip (group,chosenX,chosenY){
	


	var toolTip = d3.tip()
	    .attr("class", "d3-tip")
	    .html(function(data) {
	      return (`${data.address}, ${data.city}<br>${data.property_type}<br>${chosenX}: ${data[chosenX]}<br>${chosenY}: $ ${data[chosenY]}`);
	    });

	group.call(toolTip);

	group.on("mouseover", function(data) {
		toolTip.show(data,this);
	})
	    // onmouseout event
		.on("mouseout", function(data) {
	    	toolTip.hide(data);
	    });

	  return group;
}


//define function to updateAxis based on selected axis "x" or "y"
function updateAxis(newScale, chosenAxis, xORy){
	if(xORy ==="x"){
		var bottomAxis = d3.axisBottom(newScale);

		chosenAxis.transition()
		    .duration(1000)
		    .call(bottomAxis);
	
		return chosenAxis;
	}
	else{
		var leftAxis = d3.axisLeft(newScale);

		chosenAxis.transition()
		    .duration(1000)
		    .call(leftAxis);
	
		return chosenAxis;
	}
	
}




//function to update both group base on selected axis "x" or "y"
function updateGroup (circleGroup, newScale,chosenAxis, xORy){
	if (xORy ==="x"){
		if (chosenAxis==="BnB"){
			circleGroup.transition()
			    .duration(1000)
			    .attr("cx", d => newScale(d[chosenAxis])+newScale.bandwidth()/2);
			return circleGroup;
		}
		else
		{
			circleGroup.transition()
			    .duration(1000)
			    .attr("cx", d => newScale(d[chosenAxis]));


	  		return circleGroup;
	  	}
	}
	else {
		circleGroup.transition()
		    .duration(1000)
		    .attr("cy", d => newScale(d[chosenAxis]));


  		return circleGroup
	}
}



d3.json('/data', function(propertyData) {

	//parse data
	propertyData.forEach(function(data){
		data.HOA = +data.HOA;
	    data.dollar_per_sqfeet = +data.dollar_per_sqfeet;
	    data.price = +data.price;
	    data.sq_feet = +data.sq_feet;
	    data.year_built = +data.year_built;
	    data.lat = +data.lat;
	    data.long = +data.long;
	});

	//setup initial scale and axis
	var xLinearScale = setScaleX(propertyData, chosenX);
	var yLinearScale = setScaleY(propertyData, chosenY);

	var bottomAxis = d3.axisBottom(xLinearScale);
  	var leftAxis = d3.axisLeft(yLinearScale);

  	var xAxis = chartGroup.append("g")
  		.classed("x-axis",true)
  		.attr("transform", `translate(0, ${height})`)
    	.call(bottomAxis);

    var yAxis = chartGroup.append("g")
    	.classed("y-axis", true)
    	.call(leftAxis);

    //create group for all the circles
    var circleGroup = chartGroup.selectAll("circle")
    	.data(propertyData)
    	.enter()
    	.append("circle")
    	.attr("value",d=> d._id)
    	.classed("propertyCircle", true)
    	.attr("cx", d => xLinearScale(d[chosenX]))
    	.attr("cy", d => yLinearScale(d[chosenY]))
    	.attr("r", 7);



   	//add tooltip to both circle and text groups
	circleGroup = updateTooltip(circleGroup,chosenX,chosenY);
	
	//xlabel group
    var xLableGroup = chartGroup.append("g")
    	.attr("transform", `translate(${width / 2}, ${height + 20})`);

	// setup x-axis lable option
    var sqFeetLable = xLableGroup.append("text")
    	.attr("x",0)
    	.attr("y",20)
    	.attr("value", "sq_feet")
    	.classed("active",true)
    	.text("Square Feet")

    var BnbLable = xLableGroup.append("text")
    	.attr("x",0)
    	.attr("y",40)
    	.attr("value", "BnB")
    	.classed("inactive",true)
    	.text("#Bedroom and #Bathroom")


	//setup y-axis lable option
	var yLableGroup = chartGroup.append("g")
    .attr("transform", `translate(-100, ${height/2})`)

    var priceLable = yLableGroup.append("text")
    	.attr("transform", "rotate(-90)")
	    .attr("y",0)
	    .attr("x",0)
	    .attr("value","price")
	    .attr("dy", "1em")
	    .classed("active", true)
	    .text("Price (US Dollar)");

	var priceSFLable = yLableGroup.append("text")
    	.attr("transform", "rotate(-90)")
	    .attr("y",20)
	    .attr("x",0)
	    .attr("value","dollar_per_sqfeet")
	    .attr("dy", "1em")
	    .classed("inactive", true)
	    .text("US Dollar per Square Feet");

	//x-lable click listener
	xLableGroup.selectAll("text")
		.on("click", function(){
		
			var xNew = d3.select(this).attr("value");

			if (xNew !=chosenX){

				//set new chosenX
				chosenX=xNew;

				//update all scale, xaxis, both group based on new chosenX
				xLinearScale = setScaleX(propertyData, chosenX);

				xAxis = updateAxis(xLinearScale, xAxis,"x");

				circleGroup = updateGroup (circleGroup, xLinearScale,chosenX, "x");

				circleGroup = updateTooltip(circleGroup,chosenX,chosenY);


				if (xNew === "sq_feet"){
					sqFeetLable.classed("inactive",false)
						.classed("active",true);
					BnbLable.classed("inactive",true)
						.classed("active",false);

				}
				else {
					sqFeetLable.classed("inactive",true)
						.classed("active",false);
					BnbLable.classed("inactive",false)
						.classed("active",true);

				}


			}
		})

	//y-lable click listener
	yLableGroup.selectAll("text")
		.on("click", function(){
		
			var yNew = d3.select(this).attr("value");

			if (yNew !=chosenY){

				//set new chosenY
				chosenY=yNew;

				//update all scale, yaxis, both group based on new chosenY
				yLinearScale = setScaleY(propertyData, chosenY,"y");

				yAxis = updateAxis(yLinearScale, yAxis,"y");

				circleGroup= updateGroup (circleGroup, yLinearScale,chosenY, "y");

				circleGroup = updateTooltip(circleGroup,chosenX,chosenY);



				if (yNew === "price"){
					priceLable.classed("inactive",false)
						.classed("active",true);
					priceSFLable.classed("inactive",true)
						.classed("active",false);

				}


				else {
					priceLable.classed("inactive",true)
						.classed("active",false);
					priceSFLable.classed("inactive",false)
						.classed("active",true);

				}
			}
		})



})

