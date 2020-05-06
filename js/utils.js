/*
 * OPEN MODAL FUNCTION
 */ 
function open_modal(id) {
    $(".modal").hide();
    $(id).slideDown();
}

// GET URL PARAMETERS
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

/*
 * DOCUMENT READY OPERATIONS
 */ 
function get_tickets() {
    // READ DATABASE
	db_read();

    // SORT TABLE OF TICKETS VIEW    
    setTimeout(function(){ 
        $('table').tablesorter();
    }, 300);

    // OPEN TICKET MODAL IF ID PARAM EXIST
	if ($.urlParam("id")) {
		setTimeout(function(){ 
			open_modal("#ticket_" + $.urlParam("id")); 
		}, 300);
	}

	// SET DATE SELECTION RANGE
    var currentYear = new Date().getFullYear(), years = [];
    startYear = 2018;  
    while ( startYear <= currentYear ) {
        $("#filter_annee").append("<option value='"+startYear+"'>"+startYear+"</option>");
        startYear++;
    }   

    // UPDATE LABEL OF FILE INPUT
    $(".file-input").change(function(){
        $(".file-label").text(this.files.length + " fichiers");
    });

};

