<?php 
// DISPLAY ERROR
if ($_SERVER['SERVER_ADDR'] == "::1") { // localhost
	error_reporting(E_ALL);
	ini_set('display_errors', '1');
}

$tickets = json_decode(file_get_contents("../db.json"));
$ids = array_keys(get_object_vars($tickets));
$ids = array_map('intval', $ids);

if (isset($_REQUEST["action"]) && $_REQUEST["action"] == "update") {

	$id = $_REQUEST["id"];
	
	$ticket = $tickets->$id;

	$ticket->email = $_REQUEST["email"];
	$ticket->objet = $_REQUEST["objet"];
	$ticket->responsables = json_decode($_REQUEST["responsables"]);
	$ticket->start = $_REQUEST["start"];
	$ticket->status = $_REQUEST["status"];
	$ticket->description = $_REQUEST["description"];
	$ticket->commentaires = $_REQUEST["commentaires"];

	if($_REQUEST["status"] == "Terminé") {
		$ticket->end = sprintf("%04d-%02d-%02d", $date["year"], $date["mon"], $date["mday"]);

		// ----------------------
		// SEND EMAIL TO THE USER
		$to = $_REQUEST["email"];
		$subject = "[BCL Ticket n°". $id ."] " . $_REQUEST["type"];
		$txt = "Votre ticket à été mis à jour. Vous pouvez le consulter à l'adresse: http://bcl.unice.fr/bcl-helpdesk/tickets.html?id=" . $id;
		$headers = "From: bcl-service-info@unice.fr";
		//mail($to,$subject,$txt,$headers);
	}

	$tickets->$id = $ticket;

	file_put_contents("../db.json", json_encode($tickets));

	// ------------------------------
	// SEND EMAIL TO THE SERVICE INFO
	$to = "bcl-service-info@unice.fr";
	//$to = "laurent.vanni@unice.fr";
	$subject = "[BCL Ticket n°". $id ."] " . $_REQUEST["type"];
	$txt = "Mise à jour du ticket : http://bcl.unice.fr/bcl-helpdesk/admin/?id=" . $id;
	$headers = "From: bcl-service-info@unice.fr";
	mail($to,$subject,$txt,$headers);

} else if (isset($_REQUEST["action"]) && $_REQUEST["action"] == "delete") {

	$id = $_REQUEST["id"];
	unset($tickets->$id);

	file_put_contents("../db.json", json_encode($tickets));
}

?>