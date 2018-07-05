/*
 * DB : Mangment functions
 */
function refresh_db() {
	$("#tickets").empty();
    $("#ticket_forms").empty();
	$.getJSON("../db.json", function(result){
        $.each(result, function(i, field){
            print_ticket(i, field);
        });
    });
}

function update_db(id) {

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
            "description": description
        }
    ).done(function() {
        refresh_db();
        $(".modal-content, .modal-content > *, .submit-form, .submit-form > *").css({ 'cursor': 'default' });
        $(".modal").hide();
    });
}

$( document ).ready(function() {
	refresh_db();
});