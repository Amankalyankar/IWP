<?php
header("Content-Type: application/json");
require "db.php";

$title    = $_POST["title"];
$subtitle = $_POST["subtitle"];
$about    = $_POST["about"];
$email    = $_POST["email"];
$phone    = $_POST["phone"];
$hours    = $_POST["hours"];

$stmt = $conn->prepare(
"UPDATE site_content 
 SET banner_title=?,banner_subtitle=?,about_text=?,contact_email=?,contact_phone=?,contact_hours=?
 WHERE id=1"
);

$stmt->bind_param("ssssss",$title,$subtitle,$about,$email,$phone,$hours);
$stmt->execute();

echo json_encode(["success"=>true]);
