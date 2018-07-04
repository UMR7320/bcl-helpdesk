<?php 
// DISPLAY ERROR
if ($_SERVER['SERVER_ADDR'] == "::1") { // localhost
	error_reporting(E_ALL);
	ini_set('display_errors', '1');
}

$tickets = json_decode(file_get_contents("db.json"));

/**
 * UPDATE DB
 */
if (isset($_REQUEST["action"]) && $_REQUEST["action"] == "update") {

	$id = $_REQUEST["id"];
	
	//$type = $_REQUEST["type"];
	//$responsables = $_REQUEST["responsables"];
	//$start = $_REQUEST["start"];
	//$status = $_REQUEST["status"];
	//$objet = $_REQUEST["objet"];
	//$description = $_REQUEST["description"];

	$ticket = $tickets->$id;

	$ticket->objet = $_REQUEST["objet"];
	$ticket->responsables = json_decode($_REQUEST["responsables"]);
	$ticket->start = $_REQUEST["start"];
	$ticket->status = $_REQUEST["status"];
	$ticket->description = $_REQUEST["description"];

	$tickets->$id = $ticket;

	file_put_contents("db.json", json_encode($tickets));
}

?>