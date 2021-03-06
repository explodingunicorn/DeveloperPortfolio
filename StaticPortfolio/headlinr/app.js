(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = require('os');
var electron = require('electron');
var jetpack = _interopDefault(require('fs-jetpack'));
var sentiment = require('sentiment');

//import sentiment from sentiment;
var fs = require('fs');
var path = require('path');
var fFirstNames = require('../src/data/femalenames').names;
var mFirstNames = require('../src/data/malenames').names;
var lastNames = require('../src/data/lastnames').names;

//Other classes needed
var Headline$2 = require('../src/users/headline.js').Headline;
var sentence = require('../src/users/sentenceGeneration.js');

//Utilities
var rand10 = require('../src/utilities.js').rand10;
var headlineChance = require('../src/utilities.js').headlineChance;
var interactChance = require('../src/utilities.js').interactChance;
var commentChance = require('../src/utilities.js').commentChance;

//Sentiment
var sentimentAnalysis = require('sentiment');

//Basic class for user, a user represents multiple connections
function User(game, group) {
        //Age, sex, name
    var sex = Math.floor(Math.random() * 10);
    this.names = (function() {
        var arr = [];
        arr.push(generateName());
        arr.push(generateName());
        return arr;
    })();
    this.game = game;
    this.group = group;
    this.playerOpinion = rand10() * 5;
    var activityLevel = 800 + Math.floor((Math.random() * 300) + 1);
    var scaleReacts = 1;
    var aggression = rand10();
    console.log(aggression);
    this.pic = {
        type: 'user',
        link: ''
    };
    if (sex > 4) {
        this.pic.link = '/boys/boy (' + Math.floor((Math.random() * 60) + 1) + ')';
        console.log('boy');
    } else {
        this.pic.link = '/girls/girl (' + Math.floor((Math.random() * 60) + 1) + ')';
        console.log('girl');
    }
    var self = this;

    function generateName() {
        var randFirstF = Math.floor((Math.random() * fFirstNames.length) + 1);
        var randFirstM = Math.floor((Math.random() * mFirstNames.length) + 1);
        var randLast = Math.floor((Math.random() * lastNames.length) + 1);
        var name = {};
        name.pic = {
            type: 'user'
        };
        if (sex > 4) {
            name.first = mFirstNames[randFirstM];
            name.pic.link = '/boys/boy (' + Math.floor((Math.random() * 60) + 1) + ')';
        } else {
            name.first = fFirstNames[randFirstF];
            name.pic.link = '/girls/girl (' + Math.floor((Math.random() * 60) + 1) + ')';
        }
        name.last = lastNames[randLast];

        return name;
    }

    this.generateTopicFeelings = function() {
        var trends = {};

        for (var i = 0; i < this.game.trends.length; i++) {
            trends[this.game.trends[i]] = rand10();
        }
        return trends;
    };

    this.generateNewFeelings = function() {
        trendFeelings = this.generateTopicFeelings();
    };

    var trendFeelings = this.generateTopicFeelings();

    this.generateMoreNames = function(num) {
        if(num<1000) {
            for(var i = 0; i < num; i++) {
                this.names.push(generateName());
            }
        }
    };

    this.generateNewActivityLevel = function() {
        var sub;
        if (this.names.length > 100) {
            if(activityLevel < 100) {
                scaleReacts += 8;
            }
            else {
                activityLevel = activityLevel - 150;
                console.log(activityLevel);
            }
        }
        else {
            activityLevel = activityLevel - (this.names.length * 5);
            scaleReacts += 1;
            console.log(activityLevel);
        }
        console.log(this.names.length);
    };

    //Function exposed to game, determines when the user is checking the timeline
    this.checkUpdate = function(time) {
        //Select random name from our pool
        var name = this.names[Math.floor(Math.random() * this.names.length)];
        //Checking users activity level, and seeing if it's time for them to comment
        if(time % activityLevel=== 0) {
            //Running function to check headlinr, passing game, and itself
            checkHeadlinr(this.game, this, name);
        }
    };

    this.influence = function(val) {
        if (this.playerOpinion < 100 && this.playerOpinion > 0) {
            this.playerOpinion += val;
        }
    };

    //Function that runs everything involved in a users turn
    function checkHeadlinr(game, user, name) {
        //Function to read headlines
        checkHeadlines(game.userGroupQueues[user.group], user, game, name);
        //Function to create a headline
        createHeadline(game, user, name);
    }

    //Function for user to check new posts
    function checkHeadlines(headlines, user, game, name) {
        var postsToCheck = 0;
        //Checks the last 10 headlines
        postsToCheck = headlines.length;

        for (var i = 0; i < postsToCheck; i++) {
            //Read the headline, and determine the reaction to the headline
            var trend = headlines[i].trend;
            var userFeeling = trendFeelings[trend];
            var sentiment$$1 = headlines[i].sentimentScore;
            var playerFactor = 0;
            var repeatFactor = 0;
            var player = false;
            var scale = 1;

            if(headlines[i].playerCreated) {
                playerFactor = user.playerOpinion/10;
                player = true;
                scale = scaleReacts;
                if(game.userHeadlines.length > 1) {
                    for(var j = game.userHeadlines.length-2; j >= 0; j--) {
                        if (game.userHeadlines[j].trend === trend) {
                            repeatFactor += 4;
                        }
                    }
                }
            }
            //Check if sentiment is positive
            if (sentiment$$1 > 0 && userFeeling > 5) {
                if (player) {
                    user.playerOpinion += rand10();
                }
                //If the user feels positively towards the trend, there's a chance to like
                var total = userFeeling + sentiment$$1 + playerFactor - repeatFactor;
                if (total >= interactChance()) {
                    headlines[i].like(scale);
                }

                if((total+aggression) >= commentChance()) {
                    headlines[i].addComment(sentence.affirm(), user, name);
                }
            }
            //If the user feels negatively towards the trend, there's a chance to dislike
            else if (sentiment$$1 > 0 && userFeeling <= 5) {
                if (player) {
                    user.playerOpinion -= rand10();
                }
                //Add 5 to users feeling to simulate negative feeling
                var total = (userFeeling + 5) + sentiment$$1 - playerFactor - repeatFactor;

                if (total >= interactChance()) {
                    headlines[i].dislike(scale);
                }

                if((total+aggression) >= commentChance()) {
                    headlines[i].addComment(sentence.deny(), user, name);
                }
            }
            //If it's negative
            else if (sentiment$$1 <= 0 && userFeeling > 5) {
                if (player) {
                    user.playerOpinion -= rand10();
                }
                //If the user feels positively, there's a chance to dislike
                //Create a total, reverse the sentiment
                var total = (userFeeling + 5) + (-1 * sentiment$$1) - playerFactor - repeatFactor;

                //React if it's greater than the interaction chance, and they haven't interacted before
                if (total >= interactChance()) {
                    headlines[i].dislike(scale);
                }

                if((total+aggression) >= commentChance()) {
                    headlines[i].addComment(sentence.deny(), user, name);
                }
            }
            //If the user feels negatively also, there's a chance to like
            else {
                if (player) {
                    user.playerOpinion += rand10();
                }
                //Add 5 to users feeling to simulate negative feeling, reverse sentiment
                var total = (userFeeling + 5) + (-1 * sentiment$$1) + playerFactor - repeatFactor;

                if (total >= interactChance()) {
                    headlines[i].like(scale);
                }

                if((total+aggression) >= commentChance()) {
                    headlines[i].addComment(sentence.affirm(), user, name);
                }
            }
        }
    }

    //Function for user to push a new headline
    function createHeadline(game, user, name) {
        if (aggression >= headlineChance()) {
            var trend = game.trends[Math.floor(Math.random() * game.trends.length)];
            var feeling = trendFeelings[trend];
            var statement = sentence.generate(feeling, trend);

            //Creating a new headline
            var headline = new Headline$2(statement, user, trend, name);
            //
            game.pushHeadline(headline, self.group);
        }
    }
}

var Headline$1 = require('../src/users/headline.js').Headline;
var DataCollector = require('../src/users/dataCollector.js').DataCollector;
var Player$1 = require('../src/users/player.js').Player;
var sentenceGenerator = require('../src/users/sentenceGeneration');

var trends = ['cats', 'dogs', 'birth-control', 'the police', 'teachers', 'babies', 'white people', 'purple people', 'fire fighters', 'hamsters', 'macaroni','kangaroos', 'politicians', 'hospitals', 'girlfriends', 'boyfriends', 'exercises', 'eating dinner', 'pool parties', 'scooters', 'skateboards', 'apples', 'oranges', 'hotdogs', 'hamburgers', 'fat people', 'skinny people', 'doors', 'houses', 'cigars', 'marijuanas', 'bands', 'popcorn', 'sodas', 'movies', 'blind people', 'elephants', 'shoes', 'hippies', 'beards', 'eyeballs', 'hands', 'noses', 'farts', 'computers', 'hackers', 'men', 'women', 'actors', 'actresses', 'pencils', 'fries', 'fires', 'lights', 'cities', 'websites', 'hopes', 'dreams', 'subs', 'hamsters', 'keyboards', 'phones', 'moms', 'dads', 'grandparents', 'old people', 'millenials', 'wars', 'christians', 'muslims', 'liberals', 'rednecks', 'neo-nazis', 'snow-flakes', 'ducks', 'colds', 'fevers', 'pancakes', 'boogers', 'white people', 'black people', 'red people', 'green people', 'televisions', 'haters', 'bugs', 'basketballs', 'sweatshirts', 'clothes', 'donuts', 'dinosaurs', 'bosses', 'co-workers', 'snakes', 'fingers', 'coats', 'jellies', 'essays', 'toys', 'marbles', 'grenades', 'bombs', 'guns', 'bicycles', 'tricycles', 'indians', 'paraplegics', 'nurses', 'doctors', 'maids', 'mexican people', 'drinks', 'bananas', 'keys', 'chairs', 'couches', 'lions', 'video games', 'mountains', 'trees', 'plants', 'flowers', 'Tyranosaurus', 'parties', 'birthdays', 'republicans', 'democrats', 'presidents', 'dictators'];

function Game(user) {
    var connections = 50;
    var trendsAmt = 10;
    var game = this;

    this.player = new Player$1(this); 
    this.collector = new DataCollector(this);
    
    this.totalConnections = 50;
    this.headlines = [];
    this.userHeadlines = [];
    this.bestHeadlines = [];
    
    this.trends = generateTrends();
    this.trendsCost = 30000;
    this.postsToRead = 5;
    this.visualsUnlocked = {
        posts: false,
        likes: false,
        comments: false,
        feelings: false,
        topPosts: false
    };
    this.automation = {
        like: 0,
        likeCount: 0,
        comment: 0,
        commentCount: 0,
        headline: false,
        headlineCount: 0
    };
    this.userGroupQueues = (function() {
        var arr = [];
        for (var i = 0; i < 5; i++) {
            arr[i] = [];
        }

        return arr;
    })();

    function generateTrends() {
        var gameTrends = [];
        trends.sort(function() { return 0.5 - Math.random() });
        for (var i = 0; i < trendsAmt; i++) {
            gameTrends[i] = trends[i];
        }

        return gameTrends;
    }

    this.users = (function () {
        var usersArr = [];
        var groupCount = game.userGroupQueues.length;
        for (var i = 0; i < connections/groupCount; i++) {
            for (var j = 0; j < groupCount; j++) {
                usersArr.push(new User(game, j));
            }
        }
        return usersArr;
    })();

    this.createNewTrends = function() {
        this.trends = generateTrends();
    };

    this.update = function(time) {
        for (var i = 0; i < this.users.length; i++) {
            game.users[i].checkUpdate(time);
        }

        if(this.automation.headline) {
            if(time % this.automation.headlineCount === 0) {
                this.player.headline();
            }
        }
    };

    function checkAutomation() {
        //Check if like is activated
        if(game.automation.like) {
            game.automation.likeCount++;

            if(game.automation.like === game.automation.likeCount) {
                game.player.like(0);
                game.automation.likeCount = 0;
            }
        }

        if(game.automation.comment) {
            game.automation.commentCount++;

            if(game.automation.comment === game.automation.commentCount) {
                game.player.comment(0);
                game.automation.commentCount = 0;
            }
        }
    }

    this.pushHeadline = function(headline, group, user) {
        this.collector.pushNewHeadline(headline);
        //If a user is posting, post to all groups
        if (group === 'all') {
            for (var i = 0; i < this.userGroupQueues.length; i++) {
                this.userGroupQueues[i].unshift(headline);

                if(this.userGroupQueues[i].length > this.postsToRead) {
                    this.userGroupQueues[i].pop();
                }
            }
        }
        //Otherwise post to the respective group
        else {
            this.userGroupQueues[group].unshift(headline);

            if(this.userGroupQueues[group].length > this.postsToRead) {
                this.userGroupQueues[group].pop();
            }
        }
        //Also post it to the collective group for the user to view all posts
        this.headlines.unshift(headline);

        //If the user is posting push it to the users headlines as well
        if(user) {
            this.userHeadlines.unshift(headline);

            if(this.userHeadlines.length > 20) {
                this.userHeadlines.pop();
            }
        }

        //Pop off the 30th post so the timeline isn't infinite
        if(this.headlines.length > 30) {
            this.headlines.pop();
        }

        checkAutomation();
    };

    this.pushBestHeadline = function(post) {
        this.bestHeadlines.unshift(post);

        if(this.bestHeadlines.length > 10) {
            this.bestHeadlines.pop();
        }
    };

    this.addUsers = function(scale) {
        var modeledScale = scale*100;
        console.log(modeledScale);
        if(scale < 10) {
            this.postsToRead++;
        }
        else {
            this.postsToRead += 8;
        }
        var amountToAdd = modeledScale/this.users.length;
        for (var i = 0; i < this.users.length; i++) {
            this.users[i].generateMoreNames(amountToAdd);
            this.users[i].generateNewActivityLevel();
        }
        this.totalConnections = this.totalConnections + modeledScale;
    };

    this.reduceTrendsCost = function(scale) {
        this.trendsCost = this.trendsCost - scale;
    };

    this.addNewTrends = function(scale, points) {
        if(scale !== "purchase") {
            trendsAmt = trendsAmt + scale;
        }
        this.trends = generateTrends();
        this.collector.clearData();

        for (var i = 0; i < this.users.length; i++) {
            this.users[i].generateNewFeelings();
        }
    };

    this.addVisual = function(type) {
        this.visualsUnlocked[type] = true;
    };

    this.addAutomation = function(type, scale) {
        console.log(type, scale);
        if(type !== 'headline') {
            this.automation[type] = scale;
            this.automation[type+'Count'] = 0;
        }
        else {
            this.automation[type] = true;
            this.automation[type+'Count'] = scale;
        }
    };
}

// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
var Headline =  require('../src/users/headline.js').Headline;
var Player = require('../src/users/player.js').Player;
var UpgradeSystem = require('../src/users/upgrade.js').Upgrade;
var Vue = require('vue/dist/vue.common.js');
var Webcam = require('../src/webcam.js');

var app = electron.remote.app;
var appDir = jetpack.cwd(app.getAppPath());

var app = new Vue({
    el: "#app",
    data: {
        state: {
            start: 1,
            game: 0,
            stats: 0,
            dashboard: 0
        },
        headline: '',
        time: 'Time',
        game: new Game(),
        player: new Player(),
        data: null,
        pause: false,
        upgradeSystem: new UpgradeSystem(),
        upgrades: 0,
        takingPicture: false,
        editing: false,
        wordLimit: false,
        noTrend: false
    },
    methods: {
        attachCamera: function() {
            setTimeout(function() {
                Webcam.attach('#myCamera');
            }, 0);
        },
        takePicture: function() {
            var app = this;
            Webcam.snap( function(data_uri) {
				app.player.pic.link = data_uri;
                app.takingPicture = false;
			} );
        },
        startGame: function() {
            this.moveState('game');
        },
        moveState: function(state) {
            for(var name in this.state) {
                if (name === state) {
                    this.state[name] = true;
                }
                else {
                    this.state[name] = false;
                }
            }
        },
        submitHeadline: function() {
            var key = false;
            var userTopic;
            var headline = this.headline.toLowerCase();
            var len = headline.split(' ').length;
            if (len < 10) {
                var check = this.player.headline(headline, this);
            }
            else {
                this.wordLimit = true;
            }

            if(check) {
                this.headline = '';
                this.wordLimit = false;
                this.noTrend = false;
            }
        },
        likePost: function(index) {
            this.player.like(index);
        },
        dislikePost: function(index) {
            this.player.dislike(index);
        },
        addComment: function(index) {
            this.player.comment(index, this.user);
            this.pause = false;
        },
        changeTrends: function() {
            if (this.player.points > this.game.trendsCost) {
                this.game.addNewTrends('purchase');
                this.player.points = this.player.points - this.game.trendsCost;
            }
        },
        resolvePic: function(pic) {
            if (pic.link) {
                if (pic.type === 'player') {
                    var link = this.player.pic.link;
                }
                else {
                    var link = './img' + encodeURI(pic.link) + '.jpg';
                }
            }
            else {
                var link = 'http://bulma.io/images/placeholders/96x96.png';
            }
            return link;
        },
        formatNum: function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    mounted: function() {
        this.data = this.game.collector;
        this.player = this.game.player;
        var sec = 0;
        var pastLikes = 0;
        var pastComments = 0;
        function gameLoop() {
            if(!app.pause) {
                sec++;
                app.game.update(sec);
            }

            app.player.calculateCurrentPoints();

            window.requestAnimationFrame(gameLoop);
        }

        window.requestAnimationFrame(gameLoop);
    }
});

}());
//# sourceMappingURL=app.js.map