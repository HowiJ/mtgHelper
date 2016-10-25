module.exports = (function() {
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
    TrieSet.prototype.insertScalable = function(str) {
        var curr    = this.root,
            currStr = str;

        while( currStr ) {
            if (!curr.children[str[0]]) {
                curr.children[str[0]] = new Node(currStr[0]);
            }
            curr = curr.children[str[0]];
            currStr = currStr.substr(1);
        }
        console.log(str);
        curr.isWord = true;
    }

    Node.prototype.find = function (str) {
        if (str.length <= 0) {
                return true;
        } else {
            if (this.children[str[0].toLowerCase]) {
                return this.children[str[0].toLowerCase].find(str.substr(1));
            } else {
                return false;
            }
        }
    };
    TrieSet.prototype.find = function(str) {
        if (str.length < 1)  { return; }
        if (!this.root.children[str[0].toLowerCase]) {
            return false;
        } else {
            return this.root.children[str[0].toLowerCase].find(str.substr(1));
        }
    }

    Node.prototype.findWords = function (arr) {
        if (this.isWord) { arr.push(this.value); }
        for (var i in this.children) {
            this.children[i].findWords(arr);
        }
    };
    TrieSet.prototype.wordsStartingWith = function(char) {
        var arr = [];

        if (this.root.children[char]) {
            this.root.children[char].findWords(arr);
        }

        return arr;
    }

    Node.prototype.wordsStartingWithStr = function (str, arr) {
        if (str.length < 1) {
            return this.findWords(arr);
        } else {
            if (this.children[str[0]]) {
                this.children[str[0]].wordsStartingWithStr(str.substr(1), arr);
            }
        }
    };
    TrieSet.prototype.wordsStartingWithStr = function(str) {
        var arr = [];

        if (this.root.children[str[0]]) {
            this.root.children[str[0]].wordsStartingWithStr(str.substr(1), arr);
        }

        return arr;
    }

    return new trie();
())
