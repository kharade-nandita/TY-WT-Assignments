<?php
include("config/db.php");
include("includes/header.php");
include("includes/sidebar.php");

// Total Customers
$customerQuery = mysqli_query($conn, "SELECT COUNT(*) AS total FROM customer");
$customerData = mysqli_fetch_assoc($customerQuery);
$totalCustomers = $customerData['total'];

// Total Meter Readings
$readingQuery = mysqli_query($conn, "SELECT COUNT(*) AS total FROM meter_reading");
$readingData = mysqli_fetch_assoc($readingQuery);
$totalReadings = $readingData['total'];

// Total Bills
$billQuery = mysqli_query($conn, "SELECT COUNT(*) AS total FROM bill");
$billData = mysqli_fetch_assoc($billQuery);
$totalBills = $billData['total'];

// Total Revenue
$revenueQuery = mysqli_query($conn, "SELECT SUM(amount) AS revenue FROM bill");
$revenueData = mysqli_fetch_assoc($revenueQuery);

$totalRevenue = $revenueData['revenue'];

if($totalRevenue == "")
{
    $totalRevenue = 0;
}
?>

<h1>Dashboard</h1>

<br>

<div class="card-container">

    <div class="card">
        <h2>👥 Customers</h2>
        <h1><?php echo $totalCustomers; ?></h1>
        <p>Total Registered Customers</p>
    </div>

    <div class="card">
        <h2>⚡ Meter Readings</h2>
        <h1><?php echo $totalReadings; ?></h1>
        <p>Total Meter Readings</p>
    </div>

    <div class="card">
        <h2>🧾 Bills</h2>
        <h1><?php echo $totalBills; ?></h1>
        <p>Total Bills Generated</p>
    </div>

    <div class="card">
        <h2>💰 Revenue</h2>
        <h1>₹ <?php echo number_format($totalRevenue,2); ?></h1>
        <p>Total Revenue</p>
    </div>

</div>

<br><br>

<h2>Latest Customers</h2>

<table>

<tr>
    <th>ID</th>
    <th>Name</th>
    <th>Mobile</th>
    <th>Meter Number</th>
</tr>

<?php

$latestCustomers = mysqli_query($conn,"SELECT * FROM customer ORDER BY id DESC LIMIT 5");

while($row = mysqli_fetch_assoc($latestCustomers))
{
?>

<tr>

<td><?php echo $row['id']; ?></td>

<td><?php echo $row['customer_name']; ?></td>

<td><?php echo $row['mobile']; ?></td>

<td><?php echo $row['meter_number']; ?></td>

</tr>

<?php
}
?>

</table>

<br><br>

<h2>Latest Bills</h2>

<table>

<tr>

<th>Customer</th>
<th>Units</th>
<th>Amount</th>
<th>Month</th>
<th>Status</th>

</tr>

<?php

$latestBills = mysqli_query($conn,"
SELECT bill.*,customer.customer_name
FROM bill
INNER JOIN customer
ON bill.customer_id=customer.id
ORDER BY bill.id DESC
LIMIT 5
");

while($bill = mysqli_fetch_assoc($latestBills))
{

?>

<tr>

<td><?php echo $bill['customer_name']; ?></td>

<td><?php echo $bill['units']; ?></td>

<td>₹ <?php echo $bill['amount']; ?></td>

<td><?php echo $bill['bill_month']; ?></td>

<td><?php echo $bill['payment_status']; ?></td>

</tr>

<?php

}

?>

</table>

<?php
include("includes/footer.php");
?>