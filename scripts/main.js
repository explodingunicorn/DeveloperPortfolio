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