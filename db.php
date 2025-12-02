<?php
$host = "localhost";
$user = "root";      // default XAMPP user
$pass = "";          // empty password in XAMPP
$db   = "Avipro"; // your database name

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
   die("DB connection failed");
}

$conn->set_charset("utf8");
?>
