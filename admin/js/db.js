var current_tickets = {};

/*
 * DB : Mangment functions
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

    console.log(type);

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
        date = date[0] + "-" + date[1];
        date_array[date] =  (date_array[date] || 0) + 1;
    });
    dates = Object.keys(date_array);
    dates.sort();

    $.each(dates, function(i, d){
        //console.log(d);
        n = date_array[d];
        data.push({"date" : d, "close" : n});
    });

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
        date = date[0] + "-" + date[1];
        date_array[date] = (date_array[date] || 0) + temps_resp;
    });
    dates = Object.keys(date_array);
    dates.sort();

    $.each(dates, function(i, d){
        //console.log(d);
        n = date_array[d];
        data.push({"date" : d, "close" : n});
    });

    //console.log(data);
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
