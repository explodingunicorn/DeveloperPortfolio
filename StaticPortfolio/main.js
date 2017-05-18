var _PROJECTS = [
    {
        name: 'Headlinr',
        img: '',
        snippet: 'Headlinr is a social media simulation game. The game focuses heavily on the impacts of social media manipulation. This game was built with Electron, and Vue.',
        paragraph: "This game spawned from my interest in fake news, and the recent election. When creating this game I was thinking about the mass manipulation of users on social media. Everyone likes to think that they know what they are doing, and who they are supporting on social media. But realistically, popular social media users are most likely manipulating their fan bases in some way for their own gain. This game aims to uncover this problem. You play as a regular social media user on a website called Headlinr. On Headlinr users can only write about trending topics, and they can only write 10 words at most. The goal of the game is to manipulate your connections to get the maximum amount of likes on your headlines. The game can run infinitely, with upgrades that you unlock along the way. This game is still in development, but will be finished soon. You can play the alpha by cloning my repo and running it locally.",
        tech: ['Electron', 'Vue', 'RiTa.js'],
        repo: 'https://github.com/explodingunicorn/headlinr',
        pics: 5
    },
    {
        name: 'Vizzy',
        img: '',
        snippet: 'Vizzy is a tool that allows users to create their own music visualizations with an easy to grasp editor. This project was built with Electron, Vue, and D3',
        paragraph: "Last fall I worked with one of my professors on his live coding, audio visualization platform. I loved the work he was doing, but it was a bit complicated. He was using fragment shaders for the visualizations, and writing shaders isn't the easiest skill to pick up. I decided I would make something similar, but with a much easier learning curve. Thus Vizzy was born. Vizzy is an application that allows anyone to create music visualizations for their music library. The ultimate goal for Vizzy is to create a platform where users can share 'Vizzies'. Right now this project is still in development, but you can still clone the repo and run it locally on your computer. The editor is fully functional, and pretty fun to play around with.",
        tech: ['Electron', 'Vue', 'd3.js'],
        repo: 'https://github.com/NewKidsOnTheBlock/vizzy',
        pics: 3
    },
    // {
    //     name: 'Analogy Visualization',
    //     img: '',
    //     snippet: 'This visualization aims to help users understand analogies between data sets. This was built for CISL, a research lab at RPI. This project was built with Node, D3, and Vue.'
    // },
    {
        name: 'Twitter Haiku',
        img: '',
        snippet: 'This small experiment was built for a writing contest. It uses the Twitter API to search through tweets. Twitter Haiku then displays any tweets that happen to be haikus. This project was built with Node.js, Vue, and RiTa.js',
        paragraph: "Twitter Haiku is a small application I wrote in a few days for fun. I wanted to learn the RiTa.js library for an upcoming game I was going to create, and I figured Twitter Haiku would be the perfect side project for that. Twitter Haiku features a search bar where you either input a user with the @ symbol, or just search plain text. Twitter Haiku will then retrieve all tweets related to the search through the Twitter API, and analyze them for potential haiku's. Once the process is complete, it will put them on the screen for the user to browse. This project is currently running on heroku, and you can test it out by clicking the link below",
        tech: ['Vue', 'Node.js', 'Twitter API', 'RiTa.js'],
        link: 'https://twitterhaiku.herokuapp.com',
        repo: 'https://github.com/explodingunicorn/twitterhaiku',
        pics: 3
    },
    {
        name: 'Destino',
        img: '',
        snippet: "A winner at RPI's Hackathon 2016 in the Most Polished category. This is a visualization that takes Google Places Data to create a universe and it's respective solar systems. This project was built with D3",
        paragraph: "When RPI's hackathon came around last year, I knew that I wanted to challenge myself. I decided that I wanted to take on the hackathon alone, and I also wanted to do something related to data visualization. After player around with d3 for a few hours, an idea popped into my head. What if I took the data I was playing with, and used it to generate something interesting. So I began to work on visualizaing a solar system. Eventually as I worked into the night, Destino emerged. Destino takes Google Places data, and transforms it into a universe. All of the stars in the background are actually cities in the United States, and when one is clicked a new solar system is generated. You can test it out by clicking on the link below",
        tech: ['d3.js', 'jquery'],
        link: 'http://destino.tech',
        repo: 'https://github.com/explodingunicorn/destino',
        pics: 3
    },
    // {
    //     name: 'EMPAC Video Kiosk',
    //     img: '',
    //     snippet: 'This project is a front-end interface for EMPACs video library. The interface is put on touch screens inside special chairs that allow visitors to experience every performance EMPAC has had over the years.'
    // },
]
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
var home = {
    template: '#home',
    data: function() {
        return {
            projects: _PROJECTS,
            blogs: '',
            blogAmt: 0,
            graph: new Graph(),
            getProjectRoute: function(route) {
                return '/project/'+route;
            }
        }
    },
    mounted: function() {
        this.graph.start();
        var app = this;
        axios.get('scripts/blogs.json')
            .then(function(response) {
                app.blogs = response.data;
                if (app.blogs.length > 3) {
                    app.blogAmt = 3;
                }
                else {
                    app.blogAmt = app.blogs.length;
                }
            });
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
    methods: {
        resolvePic: function(n) {
            return './img/' + this.currentProject.name + (n + '.png');
        },
    },
    mounted: function() {
        this.$parent.secondNav = true;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        for(var i = 0; i < this.projects.length; i++) {
            if (this.projects[i].name.toLowerCase() === this.$route.params.id.toLowerCase()) {
                this.currentProject = this.projects[i];
            }
        }
    }
}

var blog = {
    template: '#blog-template',
    data: function() {
        return {
            blog: ''
        }
    },
    methods: {

    },
    mounted: function() {
        var component = this;
        this.$parent.secondNav = true;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        axios.get('blogPosts/' + this.$route.params.id + '.json')
            .then(function(response) {
                component.blog = response.data;
            })
    }
}

var routes = [
    { path: '/', component: home },
    { path: '/project/:id', component: project },
    { path: '/blog/:id', component: blog }
]

var router = new VueRouter({
    routes: routes
})



var app = new Vue({
    el: '.app',
    router: router,
    data: {
        projects: _PROJECTS,
        secondNav: false
    },
    watch: {
        $route: function() {
            if(this.$route.path === '/') {
                this.secondNav = false;
            }
        }
    },
    methods: {
        scrollTo: function(section) {
            var rect = document.getElementById(section).getBoundingClientRect();
            window.scrollTo(0, window.pageYOffset + rect.top-70);
        }
    },
    mounted: function() {
    }
})