function barChart_count(dataset){
	console.log("Drawing a bar chart")
	var margin = 0
	var width = 700
	var height = 350


//drawing the things


var svg = d3.select("#chart1").append("svg").attr("width",width+250).attr("height", height-100)
	
	var xScale = d3.scaleLinear().range ([0, width=250])
	var yScale = d3.scaleLinear().range ([height/.8,0]);
	

	//get the max value of x from the dataset
var xMax = d3.max(dataset,function(d){return d.n})
	
	//get the max value of x from the dataset
	//console.log(xMax)
	xScale.domain([0,xMax]);
	yScale.domain([0,dataset.length/1.5])
	

// Filter between years


const results2019 = dataset.filter(only2019)
	//looping through each row and matching 
	 function only2019(row){
		return row.reporting_year == "2019 and 2020"
	}
	console.log(results2019); // here is the list of only 2019/2020 values

const results2021 = dataset.filter(only2021)
	//looping through each row and matching 
	 function only2021(row){
		return row.reporting_year == "2020 and 2021"
	}
	console.log(results2021); // here is the list of only 2020/2021 values

const resultschange = dataset.filter(onlychange)
	//looping through each row and matching 
	 function onlychange(row){
		return row.reporting_year == "change"
	}
	console.log(resultschange); // here is the list of only change values

	
//Call the function 2 times to draw the bars for both - they are on top of each other


drawTypeBarChart(results2019,"_2019")
//drawTypeBarChart(results2021,"_2021")
//drawTypeBarChart(resultschange)
//drawTypeCount(results2019)
//drawTypeCount(results2021)
//drawTypeChange(resultschange) 

//Put functions into buttons
	
d3.select("#button2019").on("click",function(){
		//svg.selectAll("rect")
		//.transition()
		//.delay(75)					
		//.duration(350)
		//.attr("width", "400")
		//return xScale(d.n); }) 
		d3.selectAll(".typeCharts").remove()
		d3.selectAll(".typeCount").remove()
		drawTypeBarChart(results2019,"_2019")
		drawTypeCount(results2019,".countText")
	})
	
d3.select("#button2020").on("click",function(){
		//svg.selectAll("rect")
		//.transition()
		//.delay(75)					
		//.duration(350)
		//.attr("width", "400")
		//return xScale(i);
		d3.selectAll(".typeCharts").remove()
		d3.selectAll(".typeCount").remove()
		drawTypeBarChart(results2021,"_2021")
		drawTypeCount(results2021,".countText")
	})

/*d3.select("#buttonChange").on("click",function(){
		svg.selectAll("rect")
			 .transition()
			 .delay(75)					
			 .duration(350)
			 .attr("x", function(d,i) { return xScale(d.n) + 400; })
			 return xScale(i);
		d3.selectAll(".typeCharts").remove()
		d3.selectAll(".typeCount").remove()
		drawTypeBarChart(resultschange,"change") //change to drawTypeChange
		drawTypeCount(resultschange,".countText") //change to drawTypeChange	

	})*/
	
	/*			d3.select("p")
				.on("click", function() {
					//Update all rects
					svg.selectAll("rect")
					   .transition()
					   .delay(1000)					
					   .duration(2000)
          			   .attr("x", xScale(0))
         			   .attr("y", function(d, i) {
                           return xScale(i);
         			   })
			           .attr("height", xScale.bandwidth())
					   .attr("width", function(d) {
                           return yScale(d);
					   })*/
	

function drawTypeBarChart(dataset,className){
	//set where the bars start to draw 
	var g = svg.append("g")
		 .attr("transform", "translate(" + 265 + "," + -8 + ")")
		 //here i am adding 2 class names - the year and the chart group's general name for reference
         .attr("class", className+" typeCharts")

function drawTypeCount(dataset,className1){
	//set where the text starts to draw 
	var g = svg.append("g")
      	 .attr("x", function(d,i) { return xScale(d.n) + 270; })
		 //here i am adding 2 class names - the year and the chart group's general name for reference
	     .attr("class", className1+" typeCount")
		}

function drawTypeChange(dataset,className){
	//draw a new separate chart here for the change
	var g = svg.append("g")
		 .attr("transform", "translate(" + 200 + "," + -8 + ")")
		 .attr("class", className+" typeCharts")
		}


// draw the svgs 


g.selectAll(".Bars")
	 .data(dataset)
     .enter().append("rect")
	 //NEW class
     .attr("class", 'bar')
     .attr("width", function(d) { 
	 return xScale(d.n); }) 
     .attr("x", function(d){
	 return 0
	 })
     .attr("y", function(d,i) { return yScale(i) - 200; }) 
     .attr("height", 8)
	 //.attr("fill", "#C0DCF1")
	 .style("fill", function(d){
		if(d.n == 9773) {return "#FF5900"}
		else if (d.n == 9559) {return "#FF5900"}
		else {return "#C0DCF1"}
		;})

		/*.style("fill", function(d) {            // <== Add these
            if (d.close <= 400) {return "red"}  // <== Add these
            else  
			}else if(d%3==0){
                    return "blue"  { return "black" }*/

 svg.selectAll(".Counts")
     .data(dataset)
     .enter()
     .append("text")
     .attr("class", 'typeCount')
     .attr("x", function(d,i) { return xScale(d.n) + 270; })
     .attr("y", function(d,i) { return yScale(i) - 200; })
     .text(function(d) {
	  return d.n}) // return the value n for each row 
     .attr("font-family", "monospace")
     .attr("font-size", "10px")
     .attr("fill", "lightgray"); 

 svg.selectAll("Labels")
     .data(results2019)
     .enter()
     .append("text")
     .attr("class", "labels") // new class
     .attr("x",253) 
     .attr("text-anchor", "end")
     .attr("y", function(d,i) { return yScale(i) - 200; })
     .text(function(d) {
	  return d.primary_business_activity}) // return the activity for each row
     .attr("font-family", "monospace")
     .attr("font-size", "11px")
     .attr("fill", "#29335C");
		
	}


// Pull buttons 


const buttons = document.querySelectorAll('.year-button')
	 Array.from(buttons).forEach(button => {
	 const reporting_year = button.dataset.reporting_year
	 button.addEventListener('click', () => {
		createRect(svg, data, reporting_year)
		document.querySelector('#title').innerText = button.innerText
	})
})
}