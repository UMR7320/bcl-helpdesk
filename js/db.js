var current_tickets = {};

/*
 * DB : Mangment functions
 */
function db_read() {
	current_tickets = {};
	$("#tickets").empty();
    $("#ticket_forms").empty();
	$.getJSON("db.json?" + new Date().getTime(), function(result){
        $.each(result, function(i, field){

        	// -----------
        	// FILTER VIEW
        	if ($("#filter_annee").val() != "all") {
        		annee = field["start"].split("-")[0];
        		if (annee != $("#filter_annee").val()) {
        			return;
        		}
        	}
        	if ($("#filter_type").val() != "all") {
        		type = field["type"];
        		if (type != $("#filter_type").val()) {
        			return;
        		}
        	}
			if ($("#filter_status").val() != "all") {
        		status = field["status"].split("-")[0];
        		if (status != $("#filter_status").val()) {
        			return;
        		}
        	}
        	// -----------

        	// Create ticket
            create_ticket_entry(i, field, false);
            
            // cache db
            current_tickets[i] = field;

        });
        print_stats();
    });
}

function db_create(id) {
	var form = $(id + '_form')[0];
	var formData = new FormData(form);// get the form data

	// on envoi formData vers mail.php
	$.ajax({
		type		: 'POST', // define the type of HTTP verb we want to use (POST for our form)
		url		    : 'db.php', // the url where we want to POST
		data		: formData, // our data object
		dataType	: 'text', // what type of data do we expect back from the server
		processData: false,
		contentType: false
	}).done(function() {
        console.log("db updated!");
        open_modal('#submitted_modal');
    });
}

function print_stats() {

	// Linechart data
	var data = [];
	date_array = {};
	$.each(current_tickets, function(i, field){
		date = field["start"].split("-");
		date = date[0] + "-" + date[1];
		date_array[date] =  (date_array[date] || 0) + 1;
	});
    dates = Object.keys(date_array);
    dates.sort();

    $.each(dates, function(i, d){
        console.log(d);
        n = date_array[d];
        data.push({"date" : d, "close" : n});
    });

	console.log(data);

	draw_linechart(data, "#ticket_chart");

	// Piechart data
	var total = 0;
	var nb_dev = 0;
	var nb_dep = 0;
	var nb_main = 0;

	$.each(current_tickets, function(i, field){
		//console.log(field["type"])
		if (field["type"] == "Développement") {
			nb_dev++;
		} else if (field["type"] == "Dépannage") {
			nb_dep++;
		} else if (field["type"] == "Maintenance") {
			nb_main++;
		}
		total++;
	});

	var data = [];
	if (nb_dev > 0) {
		data.push({"label":"Développement", "value":nb_dev/total});
	}
	if (nb_dep > 0) {
		data.push({"label":"Dépannage", "value":nb_dep/total});
	}
	if (nb_main > 0) {
		data.push({"label":"Maintenance", "value":nb_main/total});
	}
	draw_piechart(data);
}

$("document").ready(function(){
    $(".file-input").change(function(){
        $(".file-label").text(this.files.length + " fichiers");
    });
});