function refresh_db() {
	$("#tickets").empty();
	$.getJSON("db.json", function(result){
        $.each(result, function(i, field){
        	console.log(field);
        	var tr = $('<tr>');
        	tr.append($('<td>').text(field["start"]));
        	tr.append($('<td>').text(field["type"]));
        	tr.append($('<td>').text(field["objet"]));
        	tr.append($('<td>').text(field["status"]));
        	tr.append('<a href="#" class="icon fa-edit"><span class="label">Maintenance</span></a>');

            $("#tickets").append(tr);
        });
    });
}

$( document ).ready(function() {
	refresh_db();
});