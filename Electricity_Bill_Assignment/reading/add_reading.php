<?php
include("../config/db.php");

$message = "";

if(isset($_POST['save']))
{
    $customer_id = $_POST['customer_id'];
    $previous = $_POST['previous_reading'];
    $current = $_POST['current_reading'];

    if($current < $previous)
    {
        $message = "Current Reading cannot be smaller than Previous Reading.";
    }
    else
    {
        $units = $current - $previous;

        $sql = "INSERT INTO meter_reading
        (customer_id,previous_reading,current_reading,units_consumed,reading_date)
        VALUES
        ('$customer_id','$previous','$current','$units',CURDATE())";

        if(mysqli_query($conn,$sql))
        {
            $message = "Meter Reading Added Successfully!";
        }
        else
        {
            $message = mysqli_error($conn);
        }
    }
}

include("../includes/header.php");
include("../includes/sidebar.php");
?>

<div class="form-container">

<h2>Add Meter Reading</h2>

<p style="color:green;"><?php echo $message; ?></p>

<form method="POST">

<label>Select Customer</label>

<select name="customer_id" required>

<option value="">Select Customer</option>

<?php

$result=mysqli_query($conn,"SELECT * FROM customer");

while($row=mysqli_fetch_assoc($result))
{

?>

<option value="<?php echo $row['id']; ?>">

<?php echo $row['customer_name']; ?>

</option>

<?php

}

?>

</select>

<label>Previous Reading</label>

<input type="number" name="previous_reading" required>

<label>Current Reading</label>

<input type="number" name="current_reading" required>

<input type="submit" name="save" value="Save Reading">

</form>

</div>

<?php
include("../includes/footer.php");
?>