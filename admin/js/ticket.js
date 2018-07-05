function print_ticket(i, field) {
    var modal = "<div id='ticket_" + i + "' class='modal'>";
    modal += "<div class='button-icon modal-content'>";
    modal += '<span class="close" onclick="$(\'#ticket_' + i + '\').hide();">&times;</span>';
    modal += "<h4><i class='button-icon icon fa-edit'></i>&nbsp;Contenu du ticket</h4>";

    modal += "<label>Objet : </label><input id='objet" + i + "' type='text' value='" + field["objet"] + "' />";
    modal += "<label>Description et commentaires: </label><textarea id='description" + i + "'>" + field["description"] + "</textarea>";
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
        var temps_resp = "";
        if (field["responsables"].length > resp_i-1) {
            responsable_args = field["responsables"][resp_i-1].split(":");
            nom_resp = responsable_args[0];
            temps_resp = responsable_args[1];
        }

        modal += "<label>Responsable" + resp_i + " : </label>";
        modal += "<select id='responsables" + resp_i + "_" + i + "' class='responsables' style='width:75%;'>Type : </label>";
        modal += "<option value=''></option>";
        $.each(["Carlos", "Laurent", "Pierre-Aurélien"], function(i, nom){
            if (nom == nom_resp) {
                modal += "<option value='" + nom + "' selected>" + nom + "</option>";
            } else {
                modal += "<option value='" + nom + "'>" + nom + "</option>";
            }
        });
        modal += "</select>";
        
        modal += "<span class='resp-label'>&nbsp:&nbsp</span>";

        /*
        modal += "<select id='temps" + resp_i + "_" + i + "' class='responsables' style='width:10%;'>Type : </label>";
        modal += "<option value=''></option>";
        for (var temps = 50; temps <= 100; temps = temps+50) {
            if (temps == temps_resp) {
                modal += "<option value='" + temps + "' selected>" + temps + "</option>";
            } else {
                modal += "<option value='" + temps + "'>" + temps + "</option>";
            }
        };
        modal += "</select>";
        */
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

    modal += '<br/><div class="submit-form"><a href="#four" class="button special"  onclick="update_db(' + i + ')">Mettre à jour le ticket</a></div>';
    modal += "</div>";
    modal += "</div>";

    var tr = $('<tr>');
    tr.append($('<td>').text(field["start"]));
    tr.append($('<td>').text(field["type"]));
    tr.append($('<td>').text(field["objet"]));
    tr.append($('<td>').text(field["status"]));
    tr.append('<i onclick="open_modal(\'#ticket_' + i + '\');" class="button-icon icon fa-edit"></i>');

    $("#tickets").append(tr);

    $("#ticket_forms").append(modal);
}