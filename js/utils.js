$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

$(document).ready(function() {
	db_read();
	if ($.urlParam("id")) {
		setTimeout(function(){ 
			open_modal("#ticket_" + $.urlParam("id")); 
		}, 300);
	}

	setTimeout(function(){ 
			$('table').tablesorter();
	}, 300);

	// SET DATE SELECTION RANGE
    var currentYear = new Date().getFullYear(), years = [];
    startYear = 2018;  
    while ( startYear <= currentYear ) {
        $("#filter_annee").append("<option value='"+startYear+"'>"+startYear+"</option>");
        startYear++;
    }   

});