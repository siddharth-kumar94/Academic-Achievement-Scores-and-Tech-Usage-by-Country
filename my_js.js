function draw(geo_data) {

	var current_subject = "";
	
	"use strict"
	var margin = 0,
		width = 1200 - margin,
		height = 610 - margin;
		
	var title = d3.select("body")
		.append("h2")
		.text('Academic Achievement Scores & Tech Use by Country');
		
	d3.select('body')
		.append('h4')
		.text('According to data collected from the 2012 PISA assessment, it\'s evident that students who have access to technology');
			
	d3.select('body')
		.append('h4')
		.text('tend to outperform their counterparts in math, science, and reading. On average, students with access to computer');
	
	d3.select('body')
		.append('h4')
		.text('and internet, at home or school, received 20% better overall scores than students without access.');
		
	d3.select('body')
		.append('h5')
		.attr('class', 'directions')
		.text('Mouse over the map to see this trend by country, and explore rates at which students use technology at school and home.');
	
	d3.select('body')
		.append('h6')
		.text('Note: Map depicts information for 39 countries that provided technology usage information in the 2012 PISA assessment.');
		
	
	var svg = d3.select("body")
		.append("svg")
		.attr('class', 'border')
		.attr("width", width + margin)
		.attr("height", height + margin)
		.append('g')
		.attr('class', 'map');
		
	// sets the scale and orientation of the map	
	var projection = d3.geo.mercator()
		.scale(148)
		.translate([width/2, height/1.4]);
	
	// Remove Antarctica
	geo_data['features'].splice(6, 1);

	var path = d3.geo.path().projection(projection);

	var map = svg.selectAll('path')
		.data(geo_data.features)
		.enter()
		.append('path')
		.attr('d', path)
		.attr('class', 'country')
		.style('fill', 'grey')
		.style('stroke', 'grey')
		.style('stroke-width', 0.5);
				
	// defines the gradient used for coloring countries in the legend
	var linearGradient = svg.append('defs')
		.append('linearGradient')
		.attr('id', 'gradient')
		.attr('x1', '0%')
		.attr('y1', '0%')
		.attr('x2', '0%')
		.attr('y2', '100%')
		.selectAll('stop')
		
		//splits gradient into 100 "stops" -- each corresponding to a specific color
		.data(function() {
			var intlist = [];
			for (var i = 0; i < 100; i++) {
				intlist.push(i);
			}
			return intlist;
		})
		.enter()
		.append('stop')
		
		//sets offset and stop-color according to interpolateRdYlGn scale
		.attr('offset', function(d) {
			return (d.toString() + '%');
		})
		.attr('stop-color', function(d) {
			return d3.interpolateRdYlGn(1 - (d/100));
		});
		
	var legendx = 35;
	var legendy = 185;
	var legendHeight = 250;
	var legendWidth = 20;
		
	svg.append('g')
		.append('text')
		.attr('x', legendx)
		.attr('y', legendy - 20)
		.attr('class', 'legend')
		.style('font-size', '15px')
		.style('font-family', 'Verdana')
		.text('Average Test Score');
		
	var gradientLegend = svg.append('g')
		.append('rect')
		.attr('class', 'legend')
		.attr('x', legendx)
		.attr('y', legendy)
		.attr('height', legendHeight)
		.attr('width', legendWidth)
		.style('fill', "url(#gradient)");
		
	//Sets the position and text for legend labels
	var legendLabels = [{label: 'Above', ypos: legendy + 4},
		{label: 'Average', ypos: legendy + .5*legendHeight + 4},
		{label:'Below', ypos: legendy + legendHeight + 4}];
	
	svg.append('g')
		.selectAll('text')
		.data(legendLabels)
		.enter()
		.append('text')
		.attr('class', 'legend')
		.attr('x', legendx + 20)
		.attr('y', function(d) {
			return d.ypos;
		})
		.style('font-size', '10px')
		.style('font-family', 'Verdana')
		.text(function(d) {
			return d.label;
		})
	
	// creates circles for countries too small to see on the map	
	var missing_countries = [{type: "Feature", properties: {name: "Singapore"}, id: 'SIN', geometry: {coordinates: [[[180, 35]]]}},
							{type: "Feature", properties: {name: "Liechtenstein"}, id: 'LIE', geometry: {coordinates: [[[180, 45]]]}}];
	
	svg.append('g')
		.selectAll('circle')
		.data(missing_countries)
		.enter()
		.append('circle')
		.attr('class', 'country')
		.attr('cx', function(d) {
			return projection(d.geometry.coordinates[0][0])[0];
		})
		.attr('cy', function(d) {
			return projection(d.geometry.coordinates[0][0])[1];
		})
		.attr('r', 5);
		
	svg.append('g')
		.selectAll('text')
		.data(missing_countries)
		.enter()
		.append('text')
		.attr('x', function(d) {
			return projection(d.geometry.coordinates[0][0])[0] + 7;
		})
		.attr('y', function(d) {
			return projection(d.geometry.coordinates[0][0])[1] + 4;
		})
		.style('font-family', 'Verdana')
		.style('font-size', '12px')
		.text(function(d) {
			return d.properties.name;
		});
		
		// function to update the coloring of the map when the user clicks on a different subject
		function update(subject) {
		
			var norm_dict = {}
			
			norm_dict['Math'] = 'Norm Math';
			norm_dict['Science'] = 'Norm Science';
			norm_dict['Reading'] = 'Norm Reading';
			norm_dict['Overall'] = 'Norm Overall';
			
			var score_dict = {}
			score_dict['Math'] = 'Mean: Math Score';
			score_dict['Science'] = 'Mean: Science Score';
			score_dict['Reading'] = 'Mean: Reading Score';
			score_dict['Overall'] = 'Mean: Overall Score';
			
			function color_countries(data) {
				// sorts the countries by grade in descending order		
				data.sort(function(a, b) {
					if (a['Mean: ' + subject + ' Score'] > b['Mean: ' + subject + ' Score']) {
						return -1;
					}
					if (a['Mean: ' + subject + ' Score'] < b['Mean: ' + subject + ' Score']) {
						return 1;
					}
					return 0;
				});
				
				// array with names of all countries in dataset
				var countries = [];
				for (var i = 0; i < data.length; i++) {
					countries.push(data[i]['Country']);
				}
				
				// sets color of country based on test score using a color interpolator
				// only colors with interpolator if country is in dataset, otherwise sets to grey
				function set_color(d) {
					if(countries.indexOf(d.properties.name) !== -1) {
						var norm = data[countries.indexOf(d.properties.name)][norm_dict[subject]];
						return d3.interpolateRdYlGn(norm);
					} else {
						return 'grey';
					}
				}
				
				// sets country border stroke to black for countries in dataset, otherwise grey			  
				svg.selectAll('.country')
					.style('fill', set_color)
					.style('stroke', function(d) {
						if (countries.indexOf(d.properties.name) !== -1) {
							return "black";
						} else {
							return 'grey';
						}
					});
				
				d3.selectAll('.country').on("mouseenter", function(d) {
				
					// creates label if the moused on country exists in the dataset
					if (countries.indexOf(d.properties.name) !== -1) {
				
						var this_country = d3.select(this);
						var this_country_name = this_country[0][0].__data__.properties.name;
						var label_width = 500;
						var label_height = 330;
						var x_margin = 10;
						var median_length = 20;
						var minor_bar_indent = 90;
						var minor_bar_length = (label_width - (2 * x_margin) - median_length - minor_bar_indent) / 2
						var minor_bar_height = 20
						
						// obtains border height and width from out of scope variables
						var border_height = d3.select('.border')[0][0].height.baseVal.value;
						var border_width = d3.select('.border')[0][0].width.baseVal.value;
					
						//Determine label coordinates
						function get_label_coords(d) {
							var coords = d.geometry.coordinates.slice(0);
							
							/*
							unpacks nested coordinates in geojson format to make
							it easier to find min and max coordinates later
							*/
							function unpack_nested_coords(coords) {
								var unpacked_coords = []
								for (var k = 0; k < coords.length; k++) {
									for (var i = 0; i < coords[k].length; i++) {
										if (coords[k][i][0] instanceof Array) {
											for (var j = 0; j < coords[k][i].length; j++) {
												unpacked_coords.push(coords[k][i][j]);
											}
										} else {
											unpacked_coords.push(coords[k][i]);
										}
									}
								}
								return unpacked_coords;
							}
						
							unpacked_coords = unpack_nested_coords(coords);
							
							/*
							sorts coordinates by x-coordinate after projection
							in descending order
							*/
							unpacked_coords.sort(function(a, b) {
								var x1 = projection(a)[0];
								var x2 = projection(b)[0];
							
								return x2 - x1;
							});
						
							var x = projection(unpacked_coords[0])[0];
							var y = projection(unpacked_coords[0])[1];
						
							var label_coords = [];
							
							// x-distance label deviates from border of country
							var label_buffer = 5;

							if (x < border_width/2) {
								label_coords = projection(unpacked_coords[0]);
								label_coords[0] += label_buffer;
							} else {
								label_coords = projection(unpacked_coords[unpacked_coords.length-1]);	
								label_coords[0] -= (label_width + label_buffer);	
							}

							return label_coords;
						}
					
						var label_coords = get_label_coords(d);
						var x = label_coords[0];
						
						/*
						sets x-coordinate for Russia due to special case, since Russia
						appears on both sides of the map in mercator projection
						*/
						if (d.id === 'RUS') {
							x = 165;
						}
						
						/*
						adds more deviation to countries displayed as circles
						*/
						if (d.id === 'SIN' | d.id === 'LIE') {
							x -= 7;
						}
						
						var y = label_coords[1];
						
						// highlights country that is being moused over
						d3.select(this)
							.style('opacity', .3)
							.style('stroke', 'red')
							.style('stroke-width', 2);

						// computes score of country in particular subject
						var score = Math.ceil(data[countries.indexOf(d.properties.name)][score_dict[subject]]);
						
						// normalized value of the score for interpolator
						var norm = data[countries.indexOf(d.properties.name)][norm_dict[subject]];
			
						// appends country label for country being mouse over
						svg.append('g')
							.attr('class', 'label')
							.selectAll('rect')
							.data(this_country)
							.enter()
							.append('rect')
							.attr('y', function() {
								if (label_height + y > border_height) {
									y = border_height - label_height - 3;
								}
								return y;
							})
							
							.attr('x', x)
							.attr('width', label_width)
							.attr('height', label_height)
							.style('fill', 'white')
							.style('stroke', 'black')
							.style('stroke-width', 3);
					
						svg.append('g')
							.attr('class', 'label')
							.selectAll('text')
							.data(this_country)
							.enter()
							.append('text')
							.attr('x', x + x_margin)
							.attr('y', y + 30)
							.style('font-size', '25px')
							.style('font-family', 'Verdana')
							.style('fill', 'black')
							.text(function (d) {
								return d[0].__data__.properties.name;	
							});
						
						svg.append('g')
							.attr('class', 'label')
							.selectAll('rect')
							.data(geo_data.features)
							.enter()
							.append('rect')
							.attr('x', x + x_margin)
							.attr('y', y + 45)
							.attr('width', label_width - 20)
							.attr('height', 20)
							.style('fill', 'white')
							.style('stroke', 'black')
							.style('stroke-width', .5);
						
						svg.append('g')
							.attr('class', 'label')
							.selectAll('rect')
							.data(this_country)
							.enter()
							.append('rect')
							.attr('x', x + x_margin)
							.attr('y', y + 45)
							.attr('width', (label_width - 30) * norm + 10)
							.attr('height', 20)
							.style('fill', d3.interpolateRdYlGn(norm))
							.style('stroke', 'black')
							.style('stroke-width', .5);
					
						svg.append('g')
							.attr('class', 'label')
							.selectAll('text')
							.data(this_country)
							.enter()
							.append('text')
							.attr('x', x + x_margin)
							.attr('y', y + 90)
							.style('font-size', '20px')
							.style('font-family', 'Verdana')
							.style('fill', 'black')
							.text(subject + ' Score: ' + score);
					
						svg.append('g')
							.attr('class', 'label')
							.selectAll('text')
							.data(this_country)
							.enter()
							.append('text')
							.attr('x', x + x_margin)
							.attr('y', y + 115)
							.style('font-size', '20px')
							.style('font-family', 'Verdana')
							.style('fill', 'black')
							.text('Rank: ' + (countries.indexOf(this_country_name) + 1) + '/39');
						
						svg.append('g')
							.attr('class', 'label')
							.selectAll('text')
							.data(this_country)
							.enter()
							.append('text')
							.attr('x', x + x_margin + minor_bar_indent)
							.attr('y', y + 135)
							.style('font-size', '15px')
							.style('font-family', 'Verdana')
							.style('fill', 'black')
							.text('At School');
						
						svg.append('g')
							.attr('class', 'label')
							.selectAll('text')
							.data(this_country)
							.enter()
							.append('text')
							.attr('x', x + x_margin + minor_bar_indent + minor_bar_length + median_length)
							.attr('y', y + 135)
							.style('font-size', '15px')
							.style('font-family', 'Verdana')
							.style('fill', 'black')
							.text('At Home');
					
						// creates a tech usage percentage bar in the label 
						function make_tech_score_bar (x, y, stat) {
							var data_clone = data.slice(0);
							
							// sorts country list according to tech usage
							data_clone.sort(function(a, b) {
								return b[stat] - a[stat];
							});
							
							// takes country name from sorted list
							var subject_sorted_countries = [];
							for (var i = 0; i < data_clone.length; i++) {
								subject_sorted_countries.push(data_clone[i]['Country']);
							}
							
							// computes rank by finding index of country in sorted list
							svg.append('g')
								.attr('class', 'label')
								.selectAll('text')
								.data(this_country)
								.enter()
								.append('text')
								.attr('x', x)
								.attr('y', y - 5)
								.style('fill', 'black')
								.style('font-size', '12px')
								.style('font-family', 'Verdana')
								.text(Math.ceil(data_clone[subject_sorted_countries.indexOf(this_country_name)][stat] * 100) + '%' +
									' - Rank: ' + (subject_sorted_countries.indexOf(this_country_name) + 1));

							svg.append('g')
								.attr('class', 'label')
								.selectAll('rect')
								.data(this_country)
								.enter()
								.append('rect')
								.attr('x', x)
								.attr('y', y)
								.attr('width', minor_bar_length)
								.attr('height', minor_bar_height)
								.style('fill', 'white')
								.style('stroke', 'black')
								.style('stroke-width', .5);
						
							svg.append('g')
								.attr('class', 'label')
								.selectAll('rect')
								.data(this_country)
								.enter()
								.append('rect')
								.attr('x', x)
								.attr('y', y)
								.attr('width', function(d) {
									return minor_bar_length * data[countries.indexOf(this_country_name)][stat];
								})
								.attr('height', minor_bar_height)
								.style('fill', function(d) {
									return d3.interpolateRdYlGn(data[countries.indexOf(this_country_name)][stat]);
								})
								.style('stroke', 'black')
								.style('stroke-width', .5);
						}
						
						// labels the tech usage bar
						function make_tech_text (y, tech) {
							svg.append('g')
								.attr('class', 'label')
								.selectAll('text')
								.data(this_country)
								.enter()
								.append('text')
								.attr('x', x + x_margin)
								.attr('y', y)
								.style('font-size', '15px')
								.style('font-family', 'Verdana')
								.style('fill', 'black')
								.text(tech);
						}
					
						// Creates labels for Internet, Desktop, Laptop, and Tablet
						make_tech_text(y + 175, 'Internet');
						make_tech_score_bar(x + x_margin + minor_bar_indent, y + 160, 'Internet - School %');
						make_tech_score_bar(x + x_margin + minor_bar_length + median_length + minor_bar_indent, y + 160, 'Internet - Home %');
					
						make_tech_text(y + 220, 'Desktop');
						make_tech_score_bar(x + x_margin + minor_bar_indent, y + 205, 'Desktop - School %');
						make_tech_score_bar(x + x_margin + minor_bar_length + median_length + minor_bar_indent, y + 205, 'Desktop - Home %');
					
						make_tech_text(y + 265, 'Laptop');
						make_tech_score_bar(x + x_margin + minor_bar_indent, y + 250, 'Laptop - School %');
						make_tech_score_bar(x + x_margin + minor_bar_length + median_length + minor_bar_indent, y + 250, 'Laptop - Home %');
					
						make_tech_text(y + 310, 'Tablet');
						make_tech_score_bar(x + x_margin + minor_bar_indent, y + 295, 'Tablet - School %');
						make_tech_score_bar(x + x_margin + minor_bar_length + median_length + minor_bar_indent, y + 295, 'Tablet - Home %');
					
						//ensures that the labels don't interfere with the mouse when hovering over countries
						svg.selectAll('.label').attr('pointer-events', 'none');
					
					}
				});
				
				// resets countries to original state when mouse leaves
				d3.selectAll('.country').on("mouseleave", function(d) {
					if (countries.indexOf(d.properties.name) !== -1) {
						d3.select(this)
							.style('opacity', 1)
							.style('stroke', 'black')
							.style('stroke-width', .5);
						svg.selectAll('.label').remove();
					}
				});
			}
		
		// loads and passes PISA data to color_countries function
		d3.csv('pisa_data.csv', function(d) {
			// Converts data to numeric form
			d['Mean: Math Score'] = +d['Mean: Math Score'];
			d['Mean: Science Score'] = +d['Mean: Science Score'];
			d['Mean: Reading Score'] = +d['Mean: Reading Score'];
			d['Mean: Overall Score'] = (+d['Mean: Math Score'] + +d['Mean: Science Score'] + +d['Mean: Reading Score'])/3;
			
			// Normalizes overall scores since they weren't provided in dataset
			d['Norm Overall'] = (+d['Mean: Overall Score'] - 399.9058) / 152.0382;
			return d;
		}, color_countries);
		
	}
		
		// Initialized map to display information for Overall score
		current_subject = 'Overall';
		update(current_subject);
		
		var subjects = ['Overall', 'Math', 'Science', 'Reading'];
			
		var buttons = d3.select("body")
			.append("div")
			.attr("class", "scores_buttons")
			.selectAll("div")
			.data(subjects)
			.enter()
			.append("div")
			// initialized button to show "Overall" as currently selected
			.style("color", function(d) {
				if (d === 'Overall') {
					return 'white';
				}
			})
			.style('background-color', function(d) {
				if (d === 'Overall') {
					return 'black';
				}
			})
			.text(function(d) {
				return d;
			});
		
		// highlights buttons when being moused over	
		buttons.on('mouseenter', function() {
			if (d3.select(this)[0][0].__data__ != current_subject) {
				d3.select(this)
					.style('background-color', 'grey')
					.style('color', 'white');
			}
		});
		
		// resets buttons to original state when mouse leaves
		buttons.on('mouseleave', function() {
			if (d3.select(this)[0][0].__data__ !== current_subject) {
				d3.select(this)
					.style('background-color', 'white')
					.style('color', 'black');
			}
		});
		
		/*
		changes appearance of buttons when clicked and updates map to subject
		that is clicked on
		*/     
		buttons.on("click", function(d) {
			d3.select(".scores_buttons")
			  .selectAll("div")
			  .transition()
			  .duration(500)
			  .style("background-color", "white")
			  .style('color', 'black');
			  
			d3.select(this)
			  .transition()
			  .duration(500)
			  .style("background-color", "black")
			  .style("color", "white");
			current_subject = d;
			update(d);
		   
		});			
};
