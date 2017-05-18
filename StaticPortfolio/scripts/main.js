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