var Graph = function() {
    this.start = function() {
        rotateGraph();
    }

    function rotateGraph() {
        var svg = d3.select('#graph');
        var width = document.getElementById('graph').getBoundingClientRect().width;
        var height = document.getElementById('graph').getBoundingClientRect().height;
        var centerX = width/2;
        var centerY = height/2;
        var division = 10
        var increment = width/10;
        var heightDivision = Math.floor(height/increment);
        var boxSize = width/6;
        var rects = [];

        for(var i = 0; i < division+1; i++) {
            rects[i] = [];
            for(var j = 0; j < heightDivision + 2; j++) {
                var rect = svg.append('rect')
                    .attr('width', boxSize)
                    .attr('height', boxSize)
                    .attr('x', increment*i - boxSize/2)
                    .attr('y', increment*j - boxSize/2)
                    .attr('fill', 'rgba(255, 0, 255, .4)');
                rects[i].push(rect);
            }
        }

        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'rgba(0,0,0,0)')
            .on('mousemove', mousemove);

        function mousemove() {
            var x0 = d3.mouse(this)[0];
            var y0 = d3.mouse(this)[1];
            var xDif = (centerX - x0)/4;
            var yDif = (centerY - y0)/4;
            var yPercentage =  y0/height;
            console.log('rgba(' + 255*yPercentage + ',' + (255*(1-yPercentage)) + '255, .8)');
            //255, 0, 255
            //0, 255, 255

            for(var i = 0; i < division+1; i++) {
                for(var j = 0; j < heightDivision + 2; j++) {
                    rects[i][j].attr("transform", "rotate(" + xDif + "," + increment*i + "," + increment*j + ")")
                                .attr('fill', 'rgba(' + Math.floor(255*(1-yPercentage)) + ','  + Math.floor(255*(yPercentage)) +  ', 255, .4)')
                }
            }
        }
    }

    function fourSquareGraph() {
        var svg = d3.select('#graph');
        var width = document.getElementById('graph').getBoundingClientRect().width;
        var height = document.getElementById('graph').getBoundingClientRect().height;
        var centerX = width/2;
        var centerY = height/2;
        var boxSize = width/4;
        
        var section = width/4;

        var yellow = svg.append('rect')
            .attr('width', boxSize)
            .attr('height', boxSize)
            .attr('x', centerX-(boxSize)/2)
            .attr('y', centerY-(boxSize)/2)
            .attr('fill', 'rgba(255, 255, 0, .5)');

        var magenta = svg.append('rect')
            .attr('width', boxSize)
            .attr('height', boxSize)
            .attr('x', centerX-(boxSize)/2)
            .attr('y', centerY-(boxSize)/2)
            .attr('fill', 'rgba(255, 0, 255, .5)');

        var black = svg.append('rect')
            .attr('width', boxSize)
            .attr('height', boxSize)
            .attr('x', centerX-(boxSize)/2)
            .attr('y', centerY-(boxSize)/2)
            .attr('fill', 'rgba(0,0,0, .5)');

        var cyan = svg.append('rect')
            .attr('width', boxSize)
            .attr('height', boxSize)
            .attr('x', centerX-(boxSize)/2)
            .attr('y', centerY-(boxSize)/2)
            .attr('fill', 'rgba(0, 255, 255, .5)');

        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'rgba(0,0,0,0)')
            .on('mousemove', mousemove);

        function mousemove() {
            var x0 = d3.mouse(this)[0];
            var y0 = d3.mouse(this)[1];
            var xDif = (centerX - x0)/4;
            var yDif = (centerY - y0)/4;

            cyan.attr('x', centerX-(boxSize)/2 + xDif)
                .attr('y', centerY-(boxSize)/2 + yDif);

            yellow.attr('x', centerX-(boxSize)/2 - xDif)
                .attr('y', centerY-(boxSize)/2 + yDif);

            magenta.attr('x', centerX-(boxSize)/2 + xDif)
                .attr('y', centerY-(boxSize)/2 - yDif);

            black.attr('x', centerX-(boxSize)/2 - xDif)
                .attr('y', centerY-(boxSize)/2 - yDif);
        }
    }
}