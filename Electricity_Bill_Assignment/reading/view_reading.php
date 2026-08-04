<?php

include("../config/db.php");
include("../includes/header.php");
include("../includes/sidebar.php");

$sql="SELECT meter_reading.*,customer.customer_name
FROM meter_reading
INNER JOIN customer
ON meter_reading.customer_id=customer.id";

$result=mysqli_query($conn,$sql);

?>

<h2>Meter Reading List</h2>

<table>

<tr>

<th>ID</th>
<th>Customer</th>
<th>Previous</th>
<th>Current</th>
<th>Units</th>
<th>Date</th>
<th>Edit</th>
<th>Delete</th>

</tr>

<?php

while($row=mysqli_fetch_assoc($result))
{

?>

<tr>

<td><?php echo $row['id']; ?></td>

<td><?php echo $row['customer_name']; ?></td>

<td><?php echo $row['previous_reading']; ?></td>

<td><?php echo $row['current_reading']; ?></td>

<td><?php echo $row['units_consumed']; ?></td>

<td><?php echo $row['reading_date']; ?></td>

<td>

<a class="btn btn-edit"
href="edit_reading.php?id=<?php echo $row['id']; ?>">

Edit

</a>

</td>

<td>

<a class="btn btn-delete"
href="delete_reading.php?id=<?php echo $row['id']; ?>"
onclick="return confirm('Delete this record?')">

Delete

</a>

</td>

</tr>

<?php

}

?>

</table>

<?php
include("../includes/footer.php");
?>