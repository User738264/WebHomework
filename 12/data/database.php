<?php

class Database {
    private $host = 'localhost';
    private $db_name = 'blog';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function connect() {
        $this->conn = null;

        
        $this->conn = new PDO(
            "mysql:host={$this->host};dbname={$this->db_name}", 
            $this->username, 
            $this->password
        );

        return $this->conn;
    }
}