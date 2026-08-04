<?php
include("../config/db.php");

$message = "";

if(isset($_POST['save']))
{
    $customer_name = $_POST['customer_name'];
    $address = $_POST['address'];
    $mobile = $_POST['mobile'];
    $meter_number = $_POST['meter_number'];

    $sql = "INSERT INTO customer(customer_name,address,mobile,meter_number)
            VALUES('$customer_name','$address','$mobile','$meter_number')";

    if(mysqli_query($conn,$sql))
    {
        $message = "Customer Added Successfully!";
    }
    else
    {
        $message = "Error : ".mysqli_error($conn);
    }
}

include("../includes/header.php");
include("../includes/sidebar.php");
?>

<div class="form-container">

<h2>Add Customer</h2>

<?php
if($message!="")
{
    echo "<p style='color:green;font-weight:bold;'>$message</p>";
}
?>

<form method="POST">

<label>Customer Name</label>
<input type="text" name="customer_name" required>

<label>Address</label>
<textarea name="address" required></textarea>

<label>Mobile Number</label>
<input type="text" name="mobile" required>

<label>Meter Number</label>
<input type="text" name="meter_number" required>

<input type="submit" name="save" value="Save Customer">

</form>

</div>

<?php
include("../includes/footer.php");
?>