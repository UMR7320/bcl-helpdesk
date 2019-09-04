<?php 

include_once("inc/send_mail.php");

// DISPLAY ERROR
if ($_SERVER['SERVER_ADDR'] == "::1") { // localhost
	error_reporting(E_ALL);
	ini_set('display_errors', '1');
}

$tickets = json_decode(file_get_contents("db.json"));
$ids = array_keys(get_object_vars($tickets));
$ids = array_map('intval', $ids);

if (isset($_REQUEST["action"]) && $_REQUEST["action"] == "create") {

	$ticket = new stdClass();
	$id = max($ids) + 1;
	$date = getdate();

	$ticket->type = $_REQUEST["type"];
	$ticket->email = $_REQUEST["email"];
	$ticket->objet = $_REQUEST["objet"];
	$ticket->description = $_REQUEST["description"];
	$ticket->responsables = array();
	$ticket->status = "En attente...";
	$ticket->start = sprintf("%04d-%02d-%02d", $date["year"], $date["mon"], $date["mday"]); //$date["year"] . "-" . $date["mon"] . "-" . $date["mday"];
	$ticket->end = "0000-00-00";
	$ticket->commentaires = "";

	// GESTION DE FICHIERS JOINTS
	$ticket->files = array();
	$uploads_dir = 'admin/uploads';
	foreach ($_FILES["doc"]["error"] as $key => $error) {
	    if ($error == UPLOAD_ERR_OK) {
	        $tmp_name = $_FILES["doc"]["tmp_name"][$key];
	        // basename() peut empêcher les attaques de système de fichiers;
	        // la validation/assainissement supplémentaire du nom de fichier peut être approprié
	        $name = basename($_FILES["doc"]["name"][$key]);
	        // ajout d'un prefix pour l'indexation et le tri
	        $name = "doc" . $id . "_" . $name;
	        move_uploaded_file($tmp_name, "$uploads_dir/$name");
	        array_push($ticket->files, "$name");
	    }
	}

	$tickets->$id = $ticket;
	file_put_contents("db.json", json_encode($tickets));

	if ($_SERVER['SERVER_ADDR'] != "::1") { 
		// ----------------------
		// SEND EMAIL TO THE USER
		send_mail_to_user($id, $ticket, "Votre demande à bien été prise en compte. Vous pouvez suivre l'évolution de votre ticket à l'adresse");
			
		// ------------------------------
		// SEND EMAIL TO THE SERVICE INFO
		send_mail_to_admins($id, $ticket, "Un nouveau ticket a été déposé");
	}

}

?>