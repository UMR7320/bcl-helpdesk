<?php

$to = "laurent.vanni@gmail.com";
$subject = "un test de mail automatique";
$txt = "Hello world!";
$headers = "From: bcl-service-info@unice.fr";

mail($to,$subject,$txt,$headers);
?>