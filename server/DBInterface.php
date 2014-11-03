<?php 
class DbInterface{
	
	var $dbServer = "shrye.net";
	var $username = "game";
	var $passwd = "hyp3rt0c";
	var $dbName = "game";
	var $conn;
	function __construct(){
	//	$this->conn = new mysqli($this->dbServer, $this->username, null, $this->dbName);
		$this->conn = new mysqli($this->dbServer, $this->username,$this->passwd,$this->dbName);
		if($this->conn->connect_error){ 
			die("Fuck" . $conn->connect_error);
	    		
		}
		echo "works";

	}
	
/*	public function getTest(){
		if($this->conn->connect_error){
	    	die("Fehler beim zugriff auf die DB: " . $conn->connect_error);
		}
		$sqlQueryString = "SELECT * FROM games;";
		$result = $this->conn->query($sqlQueryString);
		if(!$result) die("Fehler bei der abfrage: " . $this->conn->error);
		
		return $result->fetch_object();
		
	}*/
		public function getTest(){
		if($this->conn->connect_error){
	    	die("Fehler beim zugriff auf die DB: " . $conn->connect_error);
		}
		$sqlQueryString = "SELECT * FROM games;";
		$result = $this->conn->query($sqlQueryString);
		if(!$result) die("Fehler bei der abfrage: " . $this->conn->error);
		
		return $result->fetch_object();
		
	}
}
?>