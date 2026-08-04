<?php
include("../config/db.php");

$id=$_GET['id'];

$result=mysqli_query($conn,"SELECT * FROM customer WHERE id=$id");

$row=mysqli_fetch_assoc($result);

if(isset($_POST['update']))
{

$name=$_POST['customer_name'];

$address=$_POST['address'];

$mobile=$_POST['mobile'];

$meter=$_POST['meter_number'];

mysqli_query($conn,"UPDATE customer SET

customer_name='$name',

address='$address',

mobile='$mobile',

meter_number='$meter'

WHERE id=$id");

header("Location:view_customer.php");

exit();

}

include("../includes/header.php");

include("../includes/sidebar.php");

?>

<div class="form-container">

<h2>Edit Customer</h2>

<form method="POST">

<label>Customer Name</label>

<input
type="text"
name="customer_name"
value="<?php echo $row['customer_name']; ?>">

<label>Address</label>

<textarea
name="address"><?php echo $row['address']; ?></textarea>

<label>Mobile Number</label>

<input
type="text"
name="mobile"
value="<?php echo $row['mobile']; ?>">

<label>Meter Number</label>

<input
type="text"
name="meter_number"
value="<?php echo $row['meter_number']; ?>">

<input
type="submit"
name="update"
value="Update Customer">

</form>

</div>

<?php

include("../includes/footer.php");

?>