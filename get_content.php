<?php
header("Content-Type: application/json");
require "db.php";

$res = $conn->query("SELECT * FROM site_content WHERE id=1");
echo json_encode($res->fetch_assoc());
