<?php
header("Content-Type: application/json");
require "db.php";

$destination  = $_POST["destination"] ?? "";
$name          = $_POST["name"] ?? "";
$email         = $_POST["email"] ?? "";
$phone         = $_POST["phone"] ?? "";
$persons       = $_POST["persons"] ?? 1;
$travel_date   = $_POST["travel_date"] ?? "";
$message       = $_POST["message"] ?? "";

if(!$destination || !$name || !$email || !$phone || !$travel_date){
    echo json_encode(["success"=>false,"message"=>"Missing fields"]);
    exit;
}

$stmt = $conn->prepare("
INSERT INTO bookings
(destination,name,email,phone,persons,travel_date,message)
VALUES (?,?,?,?,?,?,?)
");

$stmt->bind_param(
    "ssssiss",
    $destination,
    $name,
    $email,
    $phone,
    $persons,
    $travel_date,
    $message
);

$stmt->execute();

echo json_encode(["success"=>true]);
