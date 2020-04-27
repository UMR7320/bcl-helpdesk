<?php 

// Check the IP of the client
function getRealIpAddr()
{
    if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
    {
      $ip=$_SERVER['HTTP_CLIENT_IP'];
    }
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
    {
      $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    else
    {
      $ip=$_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

// For restricted area => only university IPs or VPN
$RealIpAddr = getRealIpAddr();
$unknown_ip = strpos(getRealIpAddr(), "10.75.129") === false && 
strpos($RealIpAddr, "134.59.75.") === false && 
$RealIpAddr !== "::1";
?>

<!DOCTYPE HTML>
<!--
	Spectral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
	<head>
		<title>BCL - Service Info | Tickets en cours</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
		<link rel="stylesheet" href="assets/css/main.css" />
		<!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
		<!--[if lte IE 9]><link rel="stylesheet" href="assets/css/ie9.css" /><![endif]-->

		<link rel="stylesheet" href="css/style.css" />

	</head>
	<body>

		<!-- Page Wrapper -->
			<div id="page-wrapper">

				<!-- Header -->
					<header id="header">
						<h1><a href="index.html">BCL - Service Info</a></h1>
						<nav id="nav">
							<ul>
								<li class="special">
									<a href="#menu" class="menuToggle"><span>Menu</span></a>
									<div id="menu">
										<ul>
											<li><a href="index.html">Accueil</a></li>
											<li><a href="index.html#add_ticket">Nouveau ticket</a></li>
											<li><a href="tickets.php">Tickets en cours</a></li>
										</ul>
									</div>
								</li>
							</ul>
						</nav>
					</header>

				<?php if ($unknown_ip) { ?>

					<!-- RESTRICTED AREA MODAL -->
					<div id='restricted_modal' class='modal'>
						<div class='button-icon modal-content'>
							<h4>Accès restreint</h4>
							<p>Cette page ne peut être consultée que depuis l'université ou en utilisant le VPN.</p>
							<a href="index.html" class="button fit">Continuer</a>
						</div>
					</div>

				<?php } else { ?>

					<!-- Main -->
						<article id="main">
							<header>
								<h2>Tickets en cours</h2>
								<p>Liste des tickets gérés par le service</p>
							</header>
							<section class="wrapper style5">
								<div class="myinner">

									<div class="statistiques">
										<label>Nombre de tickets</label>
										<div id="ticket_chart" class="line_chart"></div>
										<br /><br />
										<label>Répartition</label>
										<div id="type_chart"></div>
									</div>

									<div class="filter_box" style="width: auto; top:0.5em;">
										<label>Filtrer par : </label>
									</div>

									<div class="filter_box">
										<select id="filter_annee" onchange="db_read()">
											<option selected value="all">Années</option>
										</select>
									</div>

									<div class="filter_box">
										<select id="filter_type" onchange="db_read()">
											<option selected value="all">Types</option>
											<option value="Développement">Développement</option>
											<option value="Dépannage">Dépannage</option>
											<option value="Maintenance">Maintenance</option>
										</select>
									</div>

									<div class="filter_box">
										<select id="filter_status" onchange="db_read()">
											<option selected value="all">Etats</option>
											<option value="En attente...">En attente...</option>
											<option value="En cours">En cours</option>
											<option value="Terminé">Terminé</option>
										</select>
									</div>

									<table class="tablesorter">
										<thead>
											<tr><th>Date</th><th>Type</th><th>Objet</th><th>Etat</th><th></th></tr>
										</thead>
										<tbody id="tickets">

										</tbody>
									</table>

								</div>

								<div id="ticket_forms"></div>

							</section>
						</article>
				<?php } ?>

				<!-- Footer -->
				<footer id="footer">
					<ul class="icons">
						<li><a href="index.html#developpement" class="icon fa-code"><span class="label">Développement</span></a></li>
						<li><a href="index.html#depannage" class="icon fa-heartbeat"><span class="label">Dépannage</span></a></li>
						<li><a href="index.html#maintenance" class="icon fa-gears"><span class="label">Maintenance</span></a></li>
					</ul>
					<ul class="copyright">
						<li><a href="index.html">Accueil</a></li>
						<li><a href="http://bcl.cnrs.fr" target="_blank">UMR 7320</a> : Bases, Corpus, Langage</li>
						<li><a href="admin">Administration</a></li>
					</ul>
				</footer>

			</div>

		<!-- Scripts -->
		<script src="assets/js/jquery.min.js"></script>
		<script src="assets/js/jquery.scrollex.min.js"></script>
		<script src="assets/js/jquery.scrolly.min.js"></script>
		<script src="assets/js/skel.min.js"></script>
		<script src="assets/js/util.js"></script>
		<!--[if lte IE 8]><script src="assets/js/ie/respond.min.js"></script><![endif]-->
		<script src="assets/js/main.js"></script>
		<script src="lib/__jquery.tablesorter/jquery.tablesorter.js"></script>
		<script src="lib/d3/d3.min.js"></script>

		<?php if ($unknown_ip) { ?>
			<script type="text/javascript">
				$(document).ready(function() {
					// OPEN MODAL
   					$("#restricted_modal").slideDown();
				});
			</script>
		<?php } else { ?>
			<script src="js/utils.js"></script>
			<script src="js/piechart.js"></script>
			<script src="js/linechart.js"></script>
			<script src="js/common.js"></script>
			<script src="js/db.js"></script>
		<?php } ?>

	</body>
</html>