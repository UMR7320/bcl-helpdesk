var current_tickets = {};

/*
 * DB : Mangment functions
 * READ OPERATION
 */
function db_read() {
    current_tickets = {};

	$("#tickets").empty();
    $("#ticket_forms").empty();
	$.getJSON("../db.json?" + new Date().getTime(), function(result){
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
            if ($("#filter_responsable").val() != "all") {
                var not_responsable = true;
                for (var resp_i = 1; resp_i <= 3; resp_i++) { 
                    if (field["responsables"].length > resp_i-1) {                   
                        responsable_args = field["responsables"][resp_i-1].split(":");
                        nom_resp = responsable_args[0];
                        temps_resp = responsable_args[1];
                        if(nom_resp == $("#filter_responsable").val()) {
                            not_responsable = false;
                            break;
                        }
                    }
                }
                if(not_responsable) {
                    return
                }
            }

            // Create ticket
            create_ticket_entry(i, field, true);
            
            // cache db
            current_tickets[i] = field;
        });
        print_stats();
    });
}

/*
 * DB : Mangment functions
 * UPDATE OPERATION
 */
function db_update(id) {

    type = $("#type" + id).val();
    email = $("#email" + id).val();

    var responsables = "[";
    for (var resp_i = 1; resp_i <= 3; resp_i++) {
        responsable = $("#responsables" + resp_i + "_" + id).val();
        if (responsable != "") {
            temps = $("#temps" + resp_i + "_" + id).val();
            responsables += "\"" + responsable + ":" + temps + "\",";
        }
    }
    if(responsables.length - 1) {
        responsables = responsables.substring(0,responsables.length - 1) + "]";
    } else {
        responsables = "[]";
    }

    start = $("#start" + id).val();
    status = $("#status" + id).val();
    objet = $("#objet" + id).val();
    description = $("#description" + id).val();
    commentaires = $("#commentaires" + id).val();

    $(".modal-content, .modal-content > *, .submit-form, .submit-form > *").css({ 'cursor': 'wait' })
    $.post( "db.php", {
            "action" : "update", 
            "id" : id, 
            "type": type,
            "email": email,
            "responsables": responsables,
            "start": start,
            "status": status,
            "objet": objet,
            "description": description,
            "commentaires": commentaires
        }
    ).done(function() {
        db_read();
        $(".modal-content, .modal-content > *, .submit-form, .submit-form > *").css({ 'cursor': 'default' });
        $(".modal").hide();
    });
}

/*
 * DB : Mangment functions
 * DELETE OPERATION
 */
function db_delete(id) {
    $(".modal-content, .modal-content > *, .submit-form, .submit-form > *").css({ 'cursor': 'wait' })
    $.post( "db.php", {
            "action" : "delete", 
            "id" : id
        }
    ).done(function() {
        db_read();
        $(".modal-content, .modal-content > *, .submit-form, .submit-form > *").css({ 'cursor': 'default' });
        $(".modal").hide();
    });
}

/*
 * PRINT TICKET MANAGMENT MODAL
 */
function ticket_modal(i, field) {

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
        $.each(["Laurent", "Pierre-Aurélien", "Raaj"], function(i, nom){
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

    // LECTURE DES FICHIERS JOINTS
    if(field["files"] && field["files"].length > 0) {
        modal += "<label>Fichiers joints : </label><br />";
        $.each(field["files"], function(i, file){
            modal += "<a href='uploads/" + file + "' target='_blank'>" + file + "</a><br />";
        });
    }

    modal += '<br/><div class="submit-form"><a href="#four" class="button special"  onclick="db_update(' + i + ')">Mettre à jour le ticket</a></div>';
    modal += "</div>";
    modal += "</div>";

    return modal;
}