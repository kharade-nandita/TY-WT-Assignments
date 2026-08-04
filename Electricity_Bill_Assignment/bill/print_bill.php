<?php
include("../config/db.php");

if(!isset($_GET['id']))
{
    die("Invalid Bill ID");
}

$id = $_GET['id'];

$sql = "SELECT
            bill.*,
            customer.customer_name,
            customer.address,
            customer.mobile,
            customer.meter_number
        FROM bill
        INNER JOIN customer
        ON bill.customer_id = customer.id
        WHERE bill.id = '$id'";

$result = mysqli_query($conn, $sql);

if(mysqli_num_rows($result)==0)
{
    die("Bill Not Found");
}

$row = mysqli_fetch_assoc($result);
?>

<!DOCTYPE html>

<html>

<head>

    <title>Electricity Bill</title>

    <link rel="stylesheet" href="../css/style.css">

    <style>

        body{
            background:#f2f2f2;
        }

        .bill-container{

            width:750px;
            margin:30px auto;
            background:white;
            padding:30px;
            border:2px solid #1565C0;
            border-radius:10px;
            box-shadow:0 0 10px rgba(0,0,0,0.2);

        }

        .bill-header{

            text-align:center;
            border-bottom:2px solid #1565C0;
            padding-bottom:15px;
            margin-bottom:20px;

        }

        .bill-header h1{

            color:#1565C0;

        }

        .bill-header h3{

            color:#555;

        }

        .bill-section{

            margin-top:20px;

        }

        .bill-section table{

            width:100%;
            border-collapse:collapse;

        }

        .bill-section td{

            padding:10px;
            border:1px solid #ddd;

        }

        .print-btn{

            margin-top:25px;
            text-align:center;

        }

        .print-btn button{

            background:#1565C0;
            color:white;
            border:none;
            padding:12px 25px;
            border-radius:5px;
            cursor:pointer;
            font-size:16px;

        }

        .print-btn button:hover{

            background:#0d47a1;

        }

        @media print{

            .print-btn{

                display:none;

            }

            body{

                background:white;

            }

            .bill-container{

                box-shadow:none;
                border:none;

            }

        }

    </style>

</head>

<body>

<div class="bill-container">

<div class="bill-header">

<h1>Electricity Bill Management System</h1>

<h3>Electricity Bill Receipt</h3>

</div>

<div class="bill-section">

<table>

<tr>

<td><b>Bill ID</b></td>

<td><?php echo $row['id']; ?></td>

</tr>

<tr>

<td><b>Bill Date</b></td>

<td><?php echo $row['bill_date']; ?></td>

</tr>

<tr>

<td><b>Bill Month</b></td>

<td><?php echo $row['bill_month']; ?></td>

</tr>

<tr>

<td><b>Bill Year</b></td>

<td><?php echo $row['bill_year']; ?></td>

</tr>

</table>

</div>

<br>

<h3>Customer Details</h3>

<div class="bill-section">

<table>

<tr>

<td><b>Customer Name</b></td>

<td><?php echo $row['customer_name']; ?></td>

</tr>

<tr>

<td><b>Address</b></td>

<td><?php echo $row['address']; ?></td>

</tr>

<tr>

<td><b>Mobile Number</b></td>

<td><?php echo $row['mobile']; ?></td>

</tr>

<tr>

<td><b>Meter Number</b></td>

<td><?php echo $row['meter_number']; ?></td>

</tr>

</table>

</div>

<br>

<h3>Bill Details</h3>

<div class="bill-section">

<table>

<tr>

<td><b>Units Consumed</b></td>

<td><?php echo $row['units']; ?> Units</td>

</tr>

<tr>

<td><b>Total Amount</b></td>

<td><b>₹ <?php echo number_format($row['amount'],2); ?></b></td>

</tr>

<tr>

<td><b>Payment Status</b></td>

<td><?php echo $row['payment_status']; ?></td>

</tr>

</table>

</div>

<br>

<h3>Tariff Information</h3>

<div class="bill-section">

<table>

<tr>

<td>0 - 100 Units</td>

<td>₹4 per Unit</td>

</tr>

<tr>

<td>101 - 200 Units</td>

<td>₹6 per Unit</td>

</tr>

<tr>

<td>Above 200 Units</td>

<td>₹8 per Unit</td>

</tr>

</table>

</div>

<br>

<p style="text-align:center;font-size:18px;font-weight:bold;color:#1565C0;">

Thank You for Using the Electricity Bill Management System

</p>

<div class="print-btn">

<button onclick="window.print()">

🖨 Print Bill

</button>

</div>

</div>

</body>

</html>