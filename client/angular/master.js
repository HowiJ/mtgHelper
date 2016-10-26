////////////////////////////////////////////////////////////
//                        Angular                         //
////////////////////////////////////////////////////////////
var app = angular.module('app', []);

var TrieSet = function() {
    this.root = new Node();
}
var Node = function(value) {
    this.value  = value;
    this.isWord = false;
    //Using a dictionary would be more memory intensive whereas array wouldn't be less efficient.
    this.children = {};
}
//Node method for inserting
Node.prototype.insert = function (str) {
    //If str is length of 0, we've reached the end node
    if (str.length < 1) {
        //So since we reached the end node, we want to set the word to true
        this.isWord = true;
        //And leave the method
        return;
    }
    //At this point, we have something in the string
    //So we check if the child exists, if not...
    if (!this.children[str[0]]) {
        //...we would want to make a new node first before going
        this.children[str[0]] = new Node(this.value + str[0]);
    }
    //Since the string exists at this point, we want to move to the next node.
    this.children[str[0]].insert(str.substr(1));
};
//Trie method for insert
TrieSet.prototype.insert = function (str) {
    if (str.length < 1) { return; }
    //IF the child of root does not exist
    if (!this.root.children[str[0]]) {
        //we make a new one and we go through
        this.root.children[str[0]] = new Node(str[0]);
    }
    //And then after, we go to the next one anyways
    this.root.children[str[0]].insert(str.substr(1));
};
Node.prototype.findWords = function (arr) {
    if (this.isWord) { arr.push(this.value); }
    for (var i in this.children) {
        this.children[i].findWords(arr);
    }
};

Node.prototype.wordsStartingWithStr = function (str, arr) {
    if (str.length < 1) {
        return this.findWords(arr);
    } else {
        if (this.children[str[0]] && this.children[str[0].toLowerCase()]) {
            this.children[str[0].toLowerCase()].wordsStartingWithStr(str.substr(1), arr);
        }
        else if (this.children[str[0].toUpperCase()]) {
            this.children[str[0].toUpperCase()].wordsStartingWithStr(str.substr(1), arr);
        }
    }
};
TrieSet.prototype.wordsStartingWithStr = function(str) {
    var arr = [];

    if (str && this.root.children[str[0].toLowerCase()]) {
        this.root.children[str[0].toLowerCase()].wordsStartingWithStr(str.substr(1), arr);
    }
    else if (str && this.root.children[str[0].toUpperCase()]) {
        this.root.children[str[0].toUpperCase()].wordsStartingWithStr(str.substr(1), arr);
    }

    return arr;
}

app.config(function( $locationProvider) {
    $locationProvider.html5Mode(true);
})

app.factory('cardsFactory', function($http) {
    var factory = {};
    var cards   = [];

    factory.retrieve = function(callback) {
        if (cards.length < 1) {
            $http.get('/api/cards').then(function(res) {
                if (callback && typeof callback == "function") {
                    cards = res.data;
                    callback(res.data);
                }
            })
        } else {
            if (callback && typeof callback == "function") {
                callback(cards);
            }
        }
    }

    factory.getCard = function(name,callback) {
        $http.get('/api/card/'+name).then(function(res) {
            if (callback && typeof callback == "function") {
                var card = res.data;
                if (card.legalities) {
                    var legal = '', banned='',restricted='';
                    for (var i = 0; i < card.legalities.length; i++) {
                        if (card.legalities[i].legality == "Legal") {
                            legal = legal+", "+card.legalities[i].format;
                        }
                        else if (card.legalities[i].legality == "Banned") {
                            banned = banned+", "+card.legalities[i].format;
                        }
                        else if (card.legalities[i].legality == "Restricted") {
                            restricted = restricted+", "+card.legalities[i].format;
                        }
                    }
                    card.legal = legal.substr(2, legal.length-1);
                    card.banned = banned.substr(2, banned.length-1);
                    card.restricted = restricted.substr(2, restricted.length-1);
                }
                callback(res.data);
            }
        })
    }

    return factory;
})

app.controller('mtgController', function($scope, cardsFactory) {
    setTimeout(function () {
        // $('.currCard').height(parseInt($('.menu').offset().top));
        $('.possibleCards').height(window.innerHeight-parseInt($("#cardForm").height())-40);
    }, 100);
    // $(window).resize(function() {
    //     // $('.currCard').height(parseInt($(window).height())-parseInt($('.menu').height())-20);
    //     $('.currCard').height(parseInt($('.menu').offset().top));
    // })
    $scope.cardTrie = new TrieSet();
    $scope.new_card = "";
    $scope.loading = true;
    cardsFactory.retrieve(function(data) {
        $scope.allCards = data;
        for (var i = 0; i < data.length; i++) {
            $scope.cardTrie.insert(data[i]);
        }
        $scope.loading = false;
        setTimeout(function () {
            $('#new_card_input').focus();
        }, 0);
    })

    var possible;
    ////////////////////////////////////////////////////////////
    //                       Methods                          //
    ////////////////////////////////////////////////////////////
    $scope.addCard = function() {
        $scope.checkCard(possible[0]);

        $scope.new_card = "";
    }
    $scope.searchCard = function() {
        $scope.currIndex = 0;
        var str = $scope.new_card;
        possible = $scope.cardTrie.wordsStartingWithStr(str);
        if (possible.length <= 50) {
            $scope.possibleCard = possible;
        }
    }
    $scope.checkCard = function(card) {
        cardsFactory.getCard(card, function(data) {
            $scope.currentCard = data;
            console.log(data);
        })
    }
})
