/*
 * DB : Mangment functions
 */
function refresh_db() {
	$("#tickets").empty();
    $("#ticket_forms").empty();
	$.getJSON("db.json", function(result){
        $.each(result, function(i, field){
            print_ticket(i, field);
        });
    });
}

$(document).ready(function() {
	refresh_db();
});