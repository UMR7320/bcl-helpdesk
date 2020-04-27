/*
 * TICKET ENTRY (for the table of tickets views)
 */
function create_ticket_entry(ticket_id, field, admin=false) {

	var i = ticket_id;

    // QUOTE ESCAPE BUG
    field["objet"] = field["objet"].replace("'", "’");
    field["objet"] = field["objet"].replace("'", "’");
    
    // MODAL FOR EACH TICKET
    var modal = ticket_modal(i, field);

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

/*
 * STATISTICAL CHARTs
 */
function print_stats() {

    // ---------------------------------------
    // Line chart : Number of tickets over time
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

    draw_linechart(data, "#ticket_chart");

    // ---------------------------------------
    // Pie chart : Type of ticket proportion
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

    // ---------------------------------------
    // Line chart : Number hours
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
        n = date_array[d];
        data.push({"date" : d, "close" : n});
    });

    draw_linechart(data, "#heure_chart");
}