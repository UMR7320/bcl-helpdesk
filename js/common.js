function create_admin_modal(i, field) {

	var modal = "<div id='ticket_" + i + "' class='modal'>";
    modal += "<div class='button-icon modal-content'>";
    modal += '<span class="close" onclick="$(\'#ticket_' + i + '\').hide();">&times;</span>';
    modal += "<h4><i class='button-icon icon fa-edit'></i>&nbsp;Contenu du ticket n°" + i + "</h4>";

    modal += "<label>Objet : </label><input id='objet" + i + "' type='text' value='" + field["objet"] + "' />";
    modal += "<label>Description: </label><textarea id='description" + i + "'>" + field["description"] + "</textarea>";
    modal += "<label>Contact : </label><input id='email" + i + "' type='text' value='" + field["email"] + "' />";

    modal += "<label>Debut : </label><input id='start" + i + "' type='text' value='" + field["start"] + "' />";

    modal += "<label>Type : </label>";
    modal += "<select id='type" + i + "'>Type : </label>";
    $.each(["Développement", "Dépannage", "Maintenance"], function(i, type){
        if (type == field["type"]) {
            modal += "<option value='" + type + "' selected>" + type + "</option>";
        } else {
            modal += "<option value='" + type + "'>" + type + "</option>";
        }
        
    });
    modal += "</select>";

    for (var resp_i = 1; resp_i <= 3; resp_i++) {

        var nom_resp = "";
        var temps_resp = "0";
        if (field["responsables"].length > resp_i-1) {
            responsable_args = field["responsables"][resp_i-1].split(":");
            nom_resp = responsable_args[0];
            temps_resp = responsable_args[1];
        }

        modal += "<label>Responsable" + resp_i + " : </label>";
        modal += "<select id='responsables" + resp_i + "_" + i + "' class='responsables' style='width:75%;'>Type : </label>";
        modal += "<option value=''></option>";
        $.each(["Laurent", "Pierre-Aurélien"], function(i, nom){
            if (nom == nom_resp) {
                modal += "<option value='" + nom + "' selected>" + nom + "</option>";
            } else {
                modal += "<option value='" + nom + "'>" + nom + "</option>";
            }
        });
        modal += "</select>";
        
        modal += "<span class='resp-label'>&nbsp:&nbsp</span>";

        modal += "<input id='temps" + resp_i + "_" + i + "'  type='number' min='0' step='0.5' value='" + temps_resp + "' class='responsables' style='width:10%;' />";
        modal += "<span class='resp-label'>&nbsp;heure(s)</span><br /><br />";
    }

    modal += "<label>Etat : </label>";
    modal += "<select id='status" + i + "'>Type : </label>";
    $.each(["En attente...", "En cours", "Terminé"], function(i, status){
        if (status == field["status"]) {
            modal += "<option value='" + status + "' selected>" + status + "</option>";
        } else {
            modal += "<option value='" + status + "'>" + status + "</option>";
        }
        
    });
    modal += "</select>";
    modal += "<label>Commentaires: </label><textarea id='commentaires" + i + "'>" + field["commentaires"] + "</textarea>";
    modal += '<br/><div class="submit-form"><a href="#four" class="button special"  onclick="db_update(' + i + ')">Mettre à jour le ticket</a></div>';
    modal += "</div>";
    modal += "</div>";

    return modal;
}

function create_user_modal(i, field) {

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

function create_ticket_entry(ticket_id, field, admin=false) {

	var i = ticket_id;

    // QUOTE ESCAPE BUG
    field["objet"] = field["objet"].replace("'", "’");
    
    // CREATE MODAL
    if (admin) {
    	var modal = create_admin_modal(i, field);
    } else {
    	var modal = create_user_modal(i, field);
    }

    // Normalize objet string size
    objet = field["objet"];
    if (objet.length > 25) {
        objet = objet.substring(0,25) + "...";
    }

    var tr = $('<tr>');
    tr.append($('<td>').text(field["start"]));
    tr.append($('<td>').text(field["type"]));
    tr.append($('<td>').text(objet));
    tr.append($('<td>').text(field["status"]));
    if (admin) {
	    tr.append($('<td>').append('<i onclick="open_modal(\'#ticket_' + i + '\');" class="button-icon icon fa-edit"></i>'));
	    tr.append($('<td>').append('<i onclick="$(\'#delete_id\').val(' + i + '); open_modal(\'#delete_modal\');" class="button-icon icon fa-close"></i>'));
	} else {
		tr.append($('<td>').append('<i onclick="open_modal(\'#ticket_' + i + '\');" class="button-icon icon fa-file"></i>'));
	}

    $("#tickets").prepend(tr);
    $("#ticket_forms").append(modal);
}