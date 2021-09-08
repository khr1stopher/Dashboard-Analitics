// set the dimensions and margins of the graph
var scatter_margin = {top: -20, right: 0, bottom: 15, left: 30},
    scatter_width = 160 - scatter_margin.left - scatter_margin.right,
    scatter_height = 160 - scatter_margin.top - scatter_margin.bottom;


$(document).ready(function(){
    var cluster_color = [ "#e41a1c", "#377eb8", "#4daf4a", "#ff7f00", "#ffff33", "#a65628" ];
    

    //Read the data
    d3.csv("static/dataset/pca_kmeans_data.csv", function(data) {
        
        // Reset visualization with colors if double click on svg
        var resetVisualization = function(d) {
            // Add dots with original colour
            d3.selectAll(".dot")
                .transition()
                .duration(200)
                .style("fill", function (d) { return color(d.cluster) })
                .attr("r", 1 )
        }

        // Color scale: give me a cluster name, I return a color
        var color = d3.scaleOrdinal()
            .domain(d3.extent(data, function(d) { return +parseInt(d.cluster); }))
            .range(cluster_color)

        // append the svg object to the body of the page
        var svg = d3.select("#scatter")
        .append("svg")
            .attr("width", scatter_width + scatter_margin.left + scatter_margin.right)
            .attr("height", scatter_height + scatter_margin.top + scatter_margin.bottom)
            .on("dblclick", resetVisualization )
        .append("g")
            .attr("transform",
                "translate(" + scatter_margin.left + "," + scatter_margin.top + ")");


        // Add X axis
        var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return +parseFloat(d.pc_1); }))
        .range([ 0, scatter_width ]);
        svg.append("g")
        .attr("transform", "translate(0," + scatter_height + ")")
        .attr("class", "axis")
        .style("stroke", "white")
        .call(d3.axisBottom(x));
    
        // Add Y axis
        var y = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return +parseFloat(d.pc_2); }))
        .range([ scatter_height, 0]);
        svg.append("g")
        .attr("class", "axis")
        .style("stroke", "white")
        .call(d3.axisLeft(y));

        
    
        // Color scale: give me a specie name, I return a color
        var color = d3.scaleOrdinal()
        .domain(d3.extent(data, function(d) { return +parseInt(d.cluster); }))
        .range(cluster_color)
    
    
        
        // Highlight the specie that is hovered
        var highlight = function(d){
    
            // Highlight in the scatter plot
            selected_cluster = d.cluster
        
            d3.selectAll(".dot")
                .transition()
                .duration(200)
                .style("fill", unselected_color)
                .attr("r", 1)
        
            d3.selectAll(".dot" + selected_cluster)
                .transition()
                .duration(200)
                .style("fill", color(selected_cluster))
                .attr("r", 1.5)
            
                // Highlight in parallel coordinates

                // first every group turns grey
                d3.selectAll(".pline")
                .transition().duration(200)
                .style("stroke", "grey")
                .style("opacity", "0.1")
                // Second the hovered specie takes its color
                d3.selectAll(".pline" + selected_cluster)
                .transition().duration(200)
                .style("stroke", color(selected_cluster))
                .style("opacity", "1")
        }
    
        // Remove highlight
        var doNotHighlight = function(){

            // Do not highlight scatter
            d3.selectAll(".dot")
                .transition()
                .duration(200)
                .style("fill", function (d) { return color(d.cluster) } )
                .attr("r", 1 )
                
            // Do not highlight parallel
            d3.selectAll(".pline")
                .transition().duration(200).delay(1000)
                .style("stroke", function(d){ return( color(d.cluster))} )
                .style("opacity", "1")
        }
    
        // Add dots
        svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", function (d) { return "dot dot" + d.cluster } )
            .attr("cx", function (d) { return x(d.pc_1); } )
            .attr("cy", function (d) { return y(d.pc_2); } )
            .attr("r", 1)
            .style("fill", function (d) { return color(d.cluster) } )
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight )



        //Add the cluster selector legend
        // add the options to the button
        // List of groups (here I have one group per column)
        var allGroup = d3.range(d3.min(data, function(d) { return +parseInt(d.cluster); }),
            d3.max(data, function(d) { return +parseInt(d.cluster); })+1);

        var legend = d3.select("#cluster-selector")
            .selectAll('myClusters')
            .data(allGroup)
            .enter()
            .append('label')
            .attr('for',function(d,i){ return 'a'+i; })
            .text(function(d) { return "CLUSTER "+d; })
            .style("padding", "2px")
            .style("color", function(d) { return color(d); } )
            .style("font-size", "10px")
            .append('input')
            .attr("type", "checkbox")
            .attr("value", function (d) { return d; }) // corresponding value returned by the button
            .style("border", function(d) { return color(d); } )
        
    })
  
})