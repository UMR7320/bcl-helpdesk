<?php 

// fonction trouvée sur http://bitprison.net/content/how-to-send-correct-utf-8-mail-in-php/
function mail_utf8($to, $subject = '(No subject)', $message = '', $header = '') {
  $header_ = 'MIME-Version: 1.0' . "\r\n" . 'Content-type: text/plain; charset=UTF-8' . "\r\n";
  mail($to, '=?UTF-8?B?'.base64_encode($subject).'?=', $message, $header_ . $header);
}

function send_mail_to_user($id, $ticket, $what_changed = "Votre ticket a été mis à jour. Vous pouvez le consulter à l'adresse") {
	$to = $ticket->email;
	$subject = "[BCL Ticket n°". $id ."] " . $ticket->objet;
	$txt = $what_changed . " : http://bcl.unice.fr/bcl-helpdesk/tickets.php?id=" . $id;
	$txt = $txt . "\r\n\r\n" . "Description : " . "\r\n\r\n" . $ticket->description;
	$headers = "From: bcl-service-info@unice.fr";
	mail_utf8($to,$subject,$txt,$headers);
}

function send_mail_to_admins($id, $ticket, $what_changed = 'Mise à jour du ticket') {
	$to = "bcl-service-info@unice.fr";
	$subject = "[BCL Ticket n°". $id ."] " . $ticket->objet;
	$txt = $what_changed . " : http://bcl.unice.fr/bcl-helpdesk/admin/?id=" . $id;
	$txt = $txt . "\r\n\r\n" . "Description : " . "\r\n\r\n" . $ticket->description;
	$headers = "From: bcl-service-info@unice.fr";
	mail_utf8($to,$subject,$txt,$headers);
}

?>