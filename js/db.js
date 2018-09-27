var current_tickets = {};

/*
 * DB : Mangment functions
 */
function db_read() {
	current_tickets = {};
	$("#tickets").empty();
    $("#ticket_forms").empty();
	$.getJSON("db.json", function(result){
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
	type = $(id + " [name=type]").val();
    objet = $(id + " [name=objet]").val();
	email = $(id + " [name=email]").val();
    description = $(id + " [name=description]").val();

    if (!email || !objet || !description) {
    	open_modal('#form_error_modal');

    } else {
	    $.post( "db.php", {
	            "action" : "create", 
	            "type": type,
	            "objet": objet,
	            "email": email,
	            "description": description
	        }
	    ).done(function() {
	        console.log("db updated!");
	        open_modal('#submitted_modal');
	    });
	}
}

function print_stats() {

	// Linechart data
	var data = [];
	date_array = {};
	$.each(current_tickets, function(i, field){
		date = field["start"].split("-");
		date = date[1] + "-" + date[0];
		date_array[date] =  (date_array[date] || 0) + 1;
	});

	$.each(date_array, function(d, n){
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