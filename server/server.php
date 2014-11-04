<?php

//TODO: check first argument in $_POST or multiple files?
require_once('DBInterface.php');
//$dbI = new DbInterface();
//$jsonCont = $dbI->getTest();
//echo json_encode($jsonCont);
if(isset($_POST['turnNumber'])){
  echo $_POST['turnNumber'];  
}

?>