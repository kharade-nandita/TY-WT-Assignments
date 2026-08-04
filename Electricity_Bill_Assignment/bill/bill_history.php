<?php
include("../config/db.php");

// Mark Bill as Paid
if(isset($_GET['paid']))
{
    $id = $_GET['paid'];

    mysqli_query($conn,"UPDATE bill
                        SET payment_status='Paid'
                        WHERE id='$id'");

    header("Location: bill_history.php");
    exit();
}

$search = "";

if(isset($_GET['search']))
{
    $search = mysqli_real_escape_string($conn,$_GET['search']);

    $sql = "SELECT bill.*,
            customer.customer_name

            FROM bill

            INNER JOIN customer
            ON bill.customer_id = customer.id

            WHERE customer.customer_name
            LIKE '%$search%'

            ORDER BY bill.id DESC";
}
else
{
    $sql = "SELECT bill.*,
            customer.customer_name

            FROM bill

            INNER JOIN customer
            ON bill.customer_id = customer.id

            ORDER BY bill.id DESC";
}

$result = mysqli_query($conn,$sql);

include("../includes/header.php");
include("../includes/sidebar.php");
?>

<h2>Bill History</h2>

<br>

<form method="GET">

<input
type="text"
name="search"
placeholder="Search Customer Name"
value="<?php echo $search; ?>"
style="width:300px;padding:10px;">

<input
type="submit"
value="Search"
class="btn btn-edit">

<a
href="bill_history.php"
class="btn btn-delete">

Reset

</a>

</form>

<br><br>

<table>

<tr>

<th>ID</th>

<th>Customer</th>

<th>Units</th>

<th>Amount</th>

<th>Month</th>

<th>Year</th>

<th>Status</th>

<th>Print</th>

<th>Action</th>

</tr>

<?php

if(mysqli_num_rows($result)>0)
{

while($row=mysqli_fetch_assoc($result))
{

?>

<tr>

<td><?php echo $row['id']; ?></td>

<td><?php echo $row['customer_name']; ?></td>

<td><?php echo $row['units']; ?></td>

<td>₹ <?php echo number_format($row['amount'],2); ?></td>

<td><?php echo $row['bill_month']; ?></td>

<td><?php echo $row['bill_year']; ?></td>

<td>

<?php

if($row['payment_status']=="Paid")
{
    echo "<span style='color:green;font-weight:bold;'>Paid</span>";
}
else
{
    echo "<span style='color:red;font-weight:bold;'>Unpaid</span>";
}

?>

</td>

<td>

<a
class="btn btn-edit"
href="print_bill.php?id=<?php echo $row['id']; ?>">

Print

</a>

</td>

<td>

<?php

if($row['payment_status']=="Unpaid")
{

?>

<a
class="btn btn-edit"
href="bill_history.php?paid=<?php echo $row['id']; ?>">

Mark Paid

</a>

<?php

}
else
{

echo "-";

}

?>

</td>

</tr>

<?php

}

}
else
{

?>

<tr>

<td colspan="9">

No Bills Found.

</td>

</tr>

<?php

}

?>

</table>

<?php
include("../includes/footer.php");
?>