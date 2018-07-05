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
	$ticket["status"] = "en attente...";
	$ticket["start"] = sprintf("%04d-%02d-%02d", $date["year"], $date["mon"], $date["mday"]); //$date["year"] . "-" . $date["mon"] . "-" . $date["mday"];
	$ticket["end"] = "0000-00-00";

	$tickets->$id = $ticket;

	file_put_contents("db.json", json_encode($tickets));


}

?>