<?php
include "db.php";

$id=$_POST['id'];

$conn->query("DELETE FROM packages WHERE id=$id");

echo json_encode(["success"=>true]);
