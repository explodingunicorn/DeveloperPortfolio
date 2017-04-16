var _PROJECTS = [
    {
        name: 'Headlinr',
        img: '',
        snippet: 'Headlinr is a social media simulation game. The game focuses heavily on the impacts of social media manipulation. This game was built with Electron, and Vue.'
    },
    {
        name: 'Vizzy',
        img: '',
        snippet: 'Vizzy is a tool that allows users to create their own music visualizations with an easy to grasp editor. This project was built with Electron, Vue, and D3'
    },
    {
        name: 'Analogy Visualization',
        img: '',
        snippet: 'This visualization aims to help users understand analogies between data sets. This was built for CISL, a research lab at RPI. This project was built with Node, D3, and Vue.'
    },
    {
        name: 'Twitter Haiku',
        img: '',
        snippet: 'This small experiment was built for a writing contest. It uses the Twitter API to search through tweets. Twitter Haiku then displays any tweets that happen to be haikus. This project was built with Node.js, Vue, and RiTa.js'
    },
    {
        name: 'Destino',
        img: '',
        snippet: "A winner at RPI's Hackathon 2016 in the Most Polished category. This is a visualization that takes Google Places Data to create a universe and it's respective solar systems. This project was built with D3"
    },
    {
        name: 'EMPAC Video Kiosk',
        img: '',
        snippet: 'This project is a front-end interface for EMPACs video library. The interface is put on touch screens inside special chairs that allow visitors to experience every performance EMPAC has had over the years.'
    },
]
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
var home = {
    template: '#home',
    data: function() {
        return {
            projects: _PROJECTS,
            graph: new Graph(),
            getProjectRoute: function(route) {
                return '/project/'+route;
            }
        }
    },
    mounted: function() {
        this.graph.start();
    }
}

var project = {
    template: '#project-template',
    data: function() {
        return {
            projects: _PROJECTS,
            currentProject: '',
        }
    },
    mounted: function() {
        for(var i = 0; i < this.projects.length; i++) {
            if (this.projects[i].name.toLowerCase() === this.$route.params.id.toLowerCase()) {
                this.currentProject = this.projects[i];
            }
        }
    }
}

var routes = [
    { path: '/', component: home },
    { path: '/project/:id', component: project }
]

var router = new VueRouter({
    routes: routes
})



var app = new Vue({
    el: '.app',
    router: router,
    data: {
        projects: _PROJECTS
    },
    methods: {
        scrollTo: function(section) {
            var rect = document.getElementById(section).getBoundingClientRect();
            console.log(rect.top);
            window.scrollTo(0, rect.top-70);
        }
    }
})