<?php

if(isset($_POST['username'])){
  $username = $_POST['username'];
  require_once('DBInterface.php');
  $dbI = new DBInterface();
  $dbI->enquePlayer($username);
}else{
  echo "Error: no username";
}

?>
