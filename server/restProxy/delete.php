<?php 
	$id = $_GET['id'];
	$url ="shrye.net:8080/game";
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL,$url);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
	curl_setopt($curl, CURLOPT_POSTFIELDS, $id);
    $result = curl_exec($curl);
    curl_close($curl);
    echo $result;
?>