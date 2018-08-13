function draw_linechart(data, target) {

	$(target).empty();

	var margin = {
	    top: 30,
	    right: 20,
	    bottom: 80,
	    left: 30
	};
	var width = 250;
	var height = 200;

	var parseDate = d3.time.format("%m-%Y").parse;

	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(5);

	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(5).tickFormat(d3.format("d"));;

	var valueline = d3.svg.line()
	    .x(function (d) {
	      return x(d.date);
	    })
	    .y(function (d) {
	      return y(d.close);
	    });

	var svg = d3.select(target)
	    .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data.forEach(function (d) {
	    d.date = parseDate(d.date);
	    d.close = +d.close;
	});

	// Scale the range of the data
	x.domain(d3.extent(data, function (d) {
	    return d.date;
	    }));
	y.domain([0, d3.max(data, function (d) {
	    return d.close;
	    })]);

	svg.append("path") // Add the valueline path.
	.attr("d", valueline(data));

	svg.append("g") // Add the X Axis
	.attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis).selectAll("text")	
	        .style("text-anchor", "end")
	        .attr("dx", "-.8em")
	        .attr("dy", ".15em")
	        .attr("transform", "rotate(-65)");

	svg.append("g") // Add the Y Axis
	.attr("class", "y axis")
	    .call(yAxis);
}