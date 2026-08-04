<?php

include("../config/db.php");

$id=$_GET['id'];

mysqli_query($conn,"DELETE FROM meter_reading WHERE id=$id");

header("Location:view_reading.php");

exit();

?>