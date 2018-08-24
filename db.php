<?php 
// DISPLAY ERROR
if ($_SERVER['SERVER_ADDR'] == "::1") { // localhost
	error_reporting(E_ALL);
	ini_set('display_errors', '1');
}

$tickets = json_decode(file_get_contents("db.json"));
$ids = array_keys(get_object_vars($tickets));
$ids = array_map('intval', $ids);

if (isset($_REQUEST["action"]) && $_REQUEST["action"] == "create") {

	$ticket = [];
	$id = max($ids) + 1;
	$date = getdate();

	$ticket["type"] = $_REQUEST["type"];
	$ticket["email"] = $_REQUEST["email"];
	$ticket["objet"] = $_REQUEST["objet"];
	$ticket["description"] = $_REQUEST["description"];
	$ticket["responsables"] = [];
	$ticket["status"] = "En attente...";
	$ticket["start"] = sprintf("%04d-%02d-%02d", $date["year"], $date["mon"], $date["mday"]); //$date["year"] . "-" . $date["mon"] . "-" . $date["mday"];
	$ticket["end"] = "0000-00-00";
	$ticket["commentaires"] = "";

	$tickets->$id = $ticket;

	file_put_contents("db.json", json_encode($tickets));

	// ----------------------
	// SEND EMAIL TO THE USER
	$to = $_REQUEST["email"];
	$subject = "[BCL Ticket n°". $id ."] " . $_REQUEST["type"];
	$txt = "Votre demande à bien été prise en compte. Vous pouvez suivre l'évolution de votre ticket à l'adresse : http://bcl.unice.fr/bcl-helpdesk/tickets.html?id=" . $id;
	$headers = "From: bcl-service-info@unice.fr";
	mail($to,$subject,$txt,$headers);

	// ------------------------------
	// SEND EMAIL TO THE SERVICE INFO
	$to = "bcl-service-info@unice.fr";
	//$to = "lvanni@unice.fr";
	$subject = "[BCL Ticket n°". $id ."] " . $_REQUEST["type"];
	$txt = "Un nouveau ticket a été déposé : http://bcl.unice.fr/bcl-helpdesk/admin/?id=" . $id;
	$headers = "From: bcl-service-info@unice.fr";
	mail($to,$subject,$txt,$headers);
}

?>