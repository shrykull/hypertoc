<?php

	$curl = curl_init();
	curl_setopt($curl, CURLOPT_POST, 1);

	curl_setopt($curl, CURLOPT_URL, "http://shrye.net:8080/game");
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

	$result = curl_exec($curl);
	curl_close($curl);
	echo $result;

?>
