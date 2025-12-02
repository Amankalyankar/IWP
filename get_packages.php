<?php
header("Content-Type: application/json");
require "db.php";

$result = $conn->query(
  "SELECT id,title,image,price,description AS desc_text FROM packages"
);

$packages = [];

if($result){
    while($row = $result->fetch_assoc()){
        $packages[] = $row;
    }
}

echo json_encode($packages);
