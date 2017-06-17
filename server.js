//requires
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var request = require("request");
var cheerio = require("cheerio");
mongoose.Promise = Promise;
//end requires

// Initializing Express and 
var app = express();
//using morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));
//end

app.use(express.static("public")); // Making public a static directory

//mongoose connect
mongoose.connect("mongodb://localhost/week18");
var db = mongoose.connection;
//mongoose success and error
db.on("error", function(error) {
	console.log("MONGOOSE ERRORS: ", error);
});
db.once("open", function() {
	console.log("MONGOOSE IS SUCCESS");
});
//end mongoose connect

//Scraping
app.get("/scrape", function(req, res) {
	request("http://www.rt.com/", function(error, response, html){
		var $ = cheerio.load(html);
		$('li div').each(function(i, element){
			var result = {}; //initial result
			//scrapped link and title
			result.link = $(this).children("a").attr("href");
    		result.title = $(this).children("a").text();
    		//end SCLT
    		
    		var entry = new Article(result); //making new entries with article

    		//saving entry
    		entry.save(function(err, doc){
    			if (err) {
    				console.log(err);
    			}
    			else {
    				console.log(doc);
    			}
    		});
		});
	});
	res.send("SCRAPING IS DONE");
});
//end Scrapping

//getting all articles
app.get("/articles", function(req, res){
	//using Article.find
	Article.find({}, function(error, doc){
		if (error) {
    		console.log(error);
    	}
    	else {
    		res.json(doc);
    	}
	});
});
//end getting all articles

//getting id specific articles
app.get("/articles/:id", function(req, res){
	//using Article.findOne
	Article.findOne({ "_id": req.params.id })
	.populate("note")
	.exec(function(error, doc){
		if (error) {
    		console.log(error);
    	}
    	else {
    		res.json(doc);
    	}
	});
});
//end getting id specific articles

//creating and modifying notes
app.post("/articles/:id", function(req, res){
	var newNote = new Note(req.body); //creating newNote with req.body

	//saving newNote to db
	newNote.save(function(error, doc) {
		if (error) {
    		console.log(error);
    	}
    	else {
    		//using Article.findOneAndUpdate
    		Article.findOneAndUpdate({"_id": req.params.id}, {"note": doc._id})
    		//executing
    		.exec(function(err, doc){
				if (err) {
    				console.log(err);
    			}
    			else {
    				res.json(doc);
    			}
			});
    	}
	});
});

//erase all
app.get("/eraser", function(req, res){
	Article.remove({})

	.exec(function(err, doc){
		if (err) {
    		console.log(err);
    	}
    	else {
    		res.json(doc);
    	}
	});
})

//erase by id
app.get("/erase/:id", function(req, res){
	Article.remove({"_id": req.params.id})

	.exec(function(err, doc){
		if (err) {
    		console.log(err);
    	}
    	else {
    		res.json(doc);
    	}
	});
})

// Listen on port 8080
app.listen(8080, function(){
	console.log("APP RUNING ON THE PORT OF 8080")
});