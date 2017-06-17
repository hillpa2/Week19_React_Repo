//grabing articles for appending
$.getJSON("/articles", function(data){
	for (var x=0; x<data.length; x++){
		//appending
		$("#articles").append("<p data-id='" + 
			data[x]._id + "'>" + 
			data[x].title + "<br />" + 
			"https://www.rt.com" + data[x].link + "</p>"
		);
	}
});

//when title clicked
$(document).on("click", "p", function(){
	$("#notes").empty(); //emptying notes
	var thisID=$(this).attr("data-id"); //ID

	$.ajax({
		method: "GET",
		url: "/articles/"+thisID
	})
		.done(function(data){
			console.log(data);

			//apending
			$("#notes").append("<h2>" + data.title + "</h2>");
			$("#notes").append("Title: <input id='titleinput' name='title' ><br>");
			$("#notes").append("Text: <textarea id='bodyinput' name='body'></textarea><br>");
			$("#notes").append("<button data-id='" + data._id + "' id='savenote'>SAVE NOTE</button>");
			$("#notes").append("<button data-id='" + data._id + "' id='removeart'>REMOVE ARTICLE</button>");

			//if already note
			if (data.note){
				$("#titleinput").val(data.note.title);
				$("#bodyinput").val(data.note.body);
			}
		});
});

//When savenote is clicked
$(document).on("click", "#savenote", function() {
	var thisId = $(this).attr("data-id"); //grabing thisId from selected article

	//changing notes
	$.ajax({
		method: "POST",
		url: "/articles/"+thisId,
		//data is from input
		data: {
			title: $("#titleinput").val(),
			body: $("#bodyinput").val()
		}
	})

		.done(function(data) {
			$("#notes").empty();
		});
	//remove inputs
	$("#titleinput").val("");
	$("#bodyinput").val("");
});

//When removeart is clicked
$(document).on("click", "#removeart", function() {
	var thisId = $(this).attr("data-id"); //grabing thisId from selected article

	//erasing notes
	$.ajax({
		method: "GET",
		url: "/erase/"+thisId,
	})
	location.reload();
});

//When removeall is clicked
$(document).on("click", "#removeall", function() {
	//erasing notes
	$.ajax({
		method: "GET",
		url: "/eraser",
	})
	location.reload();
});

//When scrape is clicked
$(document).on("click", "#scrape", function() {
	//erasing notes
	$.ajax({
		method: "GET",
		url: "/scrape",
	})
	location.reload();
});