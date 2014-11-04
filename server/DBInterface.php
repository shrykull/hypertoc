<?php
class DbInterface{

	var $dbServer = "shrye.net";
	var $username = "game";
	var $passwd = "hyp3rt0c";
	var $dbName = "game";
	var $conn;
	function __construct(){
		$this->conn = new mysqli($this->dbServer, $this->username,$this->passwd,$this->dbName);
		if($this->conn->connect_error){
			die("Error: " . $conn->connect_error);
		}
		echo "works";

	}

	public function getTest(){

	$gueryString = "SELECT * FROM games;";
	$result = $this->conn->query($gueryString);

	return $result->fetch_object();

	}
	public function enquePlayer($username){
		$queryString = "INSERT INTO quenue(username) VALUES	'".$username."';";
		$result = $this->conn->query($queryString);
	}

	public function updateModel(){
		//TODO: update when al player makes a turn
		$queryString = "ALTER TABLE..";
	}

	public function initGame(){
		//TODO: when both players are found insert the game into the game table
		//player 1 sends the request
		$queryString = "INSET INTO...";
	}

}

?>
