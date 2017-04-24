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
        projects: _PROJECTS,
        secondNav: false
    },
    watch: {
        $route: function() {
            console.log(this.$route);
            if(this.$route.path === '/') {
                this.secondNav = false;
                console.log(this.secondNav);
            }
        }
    },
    methods: {
        scrollTo: function(section) {
            var rect = document.getElementById(section).getBoundingClientRect();
            window.scrollTo(0, window.pageYOffset + rect.top-70);
        }
    }
})