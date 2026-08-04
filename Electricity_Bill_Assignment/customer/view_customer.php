<?php
include("../config/db.php");
include("../includes/header.php");
include("../includes/sidebar.php");

$result = mysqli_query($conn,"SELECT * FROM customer");
?>

<h2>Customer List</h2>

<br>

<table>

<tr>

<th>ID</th>
<th>Name</th>
<th>Address</th>
<th>Mobile</th>
<th>Meter Number</th>
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

<td><?php echo $row['address']; ?></td>

<td><?php echo $row['mobile']; ?></td>

<td><?php echo $row['meter_number']; ?></td>

<td>

<a class="btn btn-edit"
href="edit_customer.php?id=<?php echo $row['id']; ?>">

Edit

</a>

</td>

<td>

<a class="btn btn-delete"
href="delete_customer.php?id=<?php echo $row['id']; ?>"
onclick="return confirm('Delete this customer?')">

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