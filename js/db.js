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

        	current_tickets[i] = field;

            var modal = "<div id='ticket_" + i + "' class='modal'>";
		    modal += "<div class='button-icon modal-content'>";
		    modal += '<span class="close" onclick="$(\'#ticket_' + i + '\').hide();">&times;</span>';
		    modal += "<h4><i class='button-icon icon fa-edit'></i>&nbsp;Contenu du ticket</h4>";

		    modal += "<label>Objet : </label><input disabled id='objet" + i + "' type='text' value='" + field["objet"] + "' />";
		    modal += "<label>Description et commentaires: </label><textarea disabled id='description" + i + "'>" + field["description"] + "</textarea>";
		    modal += "<label>Contact : </label><input disabled id='email" + i + "' type='text' value='" + field["email"] + "' />";

		    modal += "<label>Debut : </label><input disabled id='start" + i + "' type='text' value='" + field["start"] + "' />";

		    modal += "<label>Type : </label>";
		    modal += "<input disabled type='text' value='" + field["type"] + "' />";

		    for (var resp_i = 1; resp_i <= 3; resp_i++) {

		        var nom_resp = "";
		        var temps_resp = "";
		        if (field["responsables"].length > resp_i-1) {
		            responsable_args = field["responsables"][resp_i-1].split(":");
		            nom_resp = responsable_args[0];
		            temps_resp = responsable_args[1];
		        }
		        modal += "<label>Responsable" + resp_i + " : </label>";
		        if (nom_resp != "") {
		            modal += "<input disabled type='text' value='" + nom_resp + "' />";
		        } else {
		            modal += "<input disabled type='text' value='' />";
		        }

		    }

		    modal += "<label>Etat : </label>";
		    modal += "<input disabled type='text' value='" + field["status"] + "' />";

		    modal += '<br/>';
		    modal += "</div>";
		    modal += "</div>";

		    objet = field["objet"];
		    if (objet.length > 25) {
		    	objet = objet.substring(0,25) + "...";
		    }

		    var tr = $('<tr>');
		    tr.append($('<td>').text(field["start"]));
		    tr.append($('<td>').text(field["type"]));
		    tr.append($('<td>').text(objet));
		    tr.append($('<td>').text(field["status"]));
		    tr.append('<i onclick="open_modal(\'#ticket_' + i + '\');" class="button-icon icon fa-file"></i>');

		    $("#tickets").append(tr);

		    $("#ticket_forms").append(modal);
        });
        print_stats();
    });
}

function db_create(id) {
	type = $(id + " [name=type]").val();
    objet = $(id + " [name=objet]").val();
	email = $(id + " [name=email]").val();
    description = $(id + " [name=description]").val();

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