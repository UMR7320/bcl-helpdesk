var current_tickets = {};

/*
 * DB : Managment functions
 * CREATE OPERATION
 */
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

/*
 * DB : Managment functions
 * READ OPERATION
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

/*
 * PRINT TICKET MANAGMENT MODAL
 */
function ticket_modal(i, field) {

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
        var temps_resp = "0";
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

    return modal;

}
