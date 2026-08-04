<?php

include("../config/db.php");

$id=$_GET['id'];

mysqli_query($conn,"DELETE FROM customer WHERE id=$id");

header("Location:view_customer.php");

exit();

?>