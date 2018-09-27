<?php 

include_once("../inc/send_mail.php");

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
		send_mail_to_user($id, $ticket);

		// ------------------------------
		// SEND EMAIL TO THE SERVICE INFO
		send_mail_to_admins($id, $ticket);
	}

	$tickets->$id = $ticket;
	file_put_contents("../db.json", json_encode($tickets));

} else if (isset($_REQUEST["action"]) && $_REQUEST["action"] == "delete") {

	$id = $_REQUEST["id"];
	unset($tickets->$id);

	file_put_contents("../db.json", json_encode($tickets));
}

?>