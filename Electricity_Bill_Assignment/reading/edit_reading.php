<?php

include("../config/db.php");

$id=$_GET['id'];

$result=mysqli_query($conn,"SELECT * FROM meter_reading WHERE id=$id");

$row=mysqli_fetch_assoc($result);

if(isset($_POST['update']))
{

$previous=$_POST['previous_reading'];

$current=$_POST['current_reading'];

$units=$current-$previous;

mysqli_query($conn,"UPDATE meter_reading
SET
previous_reading='$previous',
current_reading='$current',
units_consumed='$units'
WHERE id=$id");

header("Location:view_reading.php");

exit();

}

include("../includes/header.php");
include("../includes/sidebar.php");

?>

<div class="form-container">

<h2>Edit Reading</h2>

<form method="POST">

<label>Previous Reading</label>

<input
type="number"
name="previous_reading"
value="<?php echo $row['previous_reading']; ?>">

<label>Current Reading</label>

<input
type="number"
name="current_reading"
value="<?php echo $row['current_reading']; ?>">

<input
type="submit"
name="update"
value="Update Reading">

</form>

</div>

<?php

include("../includes/footer.php");

?>