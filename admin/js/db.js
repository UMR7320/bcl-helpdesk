var current_tickets = {};

/*
 * DB : Mangment functions
 */
function db_read() {
    current_tickets = {};

	$("#tickets").empty();
    $("#ticket_forms").empty();
	$.getJSON("../db.json", function(result){
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
            // -----------

            current_tickets[i] = field;

            var modal = "<div id='ticket_" + i + "' class='modal'>";
            modal += "<div class='button-icon modal-content'>";
            modal += '<span class="close" onclick="$(\'#ticket_' + i + '\').hide();">&times;</span>';
            modal += "<h4><i class='button-icon icon fa-edit'></i>&nbsp;Contenu du ticket</h4>";

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

            modal += "<label>Commentaires: </label><textarea id='commentaires" + i + "'>" + field["commentaires"] + "</textarea>";

            modal += '<br/><div class="submit-form"><a href="#four" class="button special"  onclick="db_update(' + i + ')">Mettre à jour le ticket</a></div>';
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
            tr.append($('<td>').append('<i onclick="open_modal(\'#ticket_' + i + '\');" class="button-icon icon fa-edit"></i>'));
            tr.append($('<td>').append('<i onclick="$(\'#delete_id\').val(' + i + '); open_modal(\'#delete_modal\');" class="button-icon icon fa-close"></i>'));

            $("#tickets").append(tr);

            $("#ticket_forms").append(modal);
        });
        print_stats();
    });
}

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

    // Linechart data (nb heure)
    var data = [];
    var date_array = {};
    $.each(current_tickets, function(i, field){
        var temps_resp = 0;
        for (var resp_i = 1; resp_i <= 3; resp_i++) { 
            if (field["responsables"].length > resp_i-1) {                   
                responsable_args = field["responsables"][resp_i-1].split(":");
                nom_resp = responsable_args[0];
                temps_resp += parseInt(responsable_args[1]);
            }
        }   
        date = field["start"].split("-");
        date = date[1] + "-" + date[0];
        date_array[date] = (date_array[date] || 0) + temps_resp;
    });

    $.each(date_array, function(d, n){
        data.push({"date" : d, "close" : n});
    });

    draw_linechart(data, "#heure_chart");

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
