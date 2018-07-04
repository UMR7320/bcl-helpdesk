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

	$ticket["type"] = $_REQUEST["type"];
	$ticket["email"] = $_REQUEST["email"];
	$ticket["objet"] = $_REQUEST["objet"];
	$ticket["description"] = $_REQUEST["description"];
	$ticket["responsables"] = [];
	$ticket["status"] = "en attente...";
	$ticket["start"] = "0000-00-00";
	$ticket["end"] = "0000-00-00";

	$tickets->$id = $ticket;

	file_put_contents("db.json", json_encode($tickets));

/**
 * UPDATE
 */
} else if (isset($_REQUEST["action"]) && $_REQUEST["action"] == "update") {

	$id = $_REQUEST["id"];
	
	$ticket = $tickets->$id;

	$ticket->email = $_REQUEST["email"];
	$ticket->objet = $_REQUEST["objet"];
	$ticket->responsables = json_decode($_REQUEST["responsables"]);
	$ticket->start = $_REQUEST["start"];
	$ticket->status = $_REQUEST["status"];
	$ticket->description = $_REQUEST["description"];

	$tickets->$id = $ticket;

	file_put_contents("db.json", json_encode($tickets));
}

?>