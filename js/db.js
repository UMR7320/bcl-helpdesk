
/*
 * DB : Mangment functions
 */
function refresh_db() {
	$("#tickets").empty();
    $("#ticket_forms").empty();
	$.getJSON("db.json", function(result){
        $.each(result, function(i, field){
            
            var modal = "<div id='ticket_" + i + "' class='modal'>";
            modal += "<div class='button-icon modal-content'>";
            modal += '<span class="close" onclick="$(\'#ticket_' + i + '\').hide();">&times;</span>';
            modal += "<h4><i class='button-icon icon fa-edit'></i>&nbsp;Contenu du ticket</h4>";
            modal += "<label>Type : </label><input id='type" + i + "' type='text' value='" + field["type"] + "' />";
            modal += "<label>Email : </label><input id='email" + i + "' type='text' value='" + field["email"] + "' />";
            modal += "<label>Responsables : </label><input id='responsables" + i + "' type='text' value='' />";
            modal += "<label>Debut : </label><input id='start" + i + "' type='text' value='" + field["start"] + "' />";
            modal += "<label>Etat : </label><input id='status" + i + "' type='text' value='" + field["status"] + "' />";
            modal += "<label>Objet : </label><input id='objet" + i + "' type='text' value='" + field["objet"] + "' />";
            modal += "<label>Description : </label><textarea id='description" + i + "'>" + field["description"] + "</textarea>";
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
        });
    });
}

function update_db(id) {

    type = $("#type" + id).val();
    email = $("#email" + id).val();
    responsables = $("#responsables" + id).val();
    start = $("#start" + id).val();
    status = $("#status" + id).val();
    objet = $("#objet" + id).val();
    description = $("#description" + id).val();

    $(".modal-content, .modal-content > *, .submit-form, .submit-form > *").css({ 'cursor': 'wait' })
    $.post( "db.php", {
        "action" : "update", 
        "id" : id, 
        "email": email,
        "responsables": responsables,
        "start": start,
        "status": status,
        "objet": objet,
        "description": description
    }, function() {
        setTimeout(function(){ 
                $(".modal").hide();
                refresh_db();
                $(".modal-content, .modal-content > *, .submit-form, .submit-form > *").css({ 'cursor': 'default' })
            }, 3000);
        }
    );
}

$( document ).ready(function() {
	refresh_db();
});