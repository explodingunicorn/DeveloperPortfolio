var Graph = function() {
    this.start = function() {
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