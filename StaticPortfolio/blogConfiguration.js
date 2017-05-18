var fs = require('fs');

var root = './blogPosts/';
//Create an array for all of my blog posts
var files = fs.readdirSync(root);

//Use a for loop to create an array the site will use
var posts = [];
for (var i = 0; i < files.length; i++) {
    var post = JSON.parse(fs.readFileSync(root + files[i]));
    var obj = {};
    obj.title = post.title;
    obj.year = post.year;
    obj.month = post.month;
    obj.day = post.day;
    obj.preview = post.preview;
    obj.img = post.img;
    obj.file = files[i];
    posts.push(obj);
}

console.log(posts);
var path = __dirname + '/scripts/blogs.json';

fs.writeFileSync(path, JSON.stringify(posts));