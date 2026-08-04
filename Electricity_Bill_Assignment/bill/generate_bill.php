<?php
include("../config/db.php");

$message = "";

if(isset($_POST['generate']))
{
    $reading_id = $_POST['reading_id'];
    $bill_month = trim($_POST['bill_month']);
    $bill_year = $_POST['bill_year'];

    // Check if bill already exists
    $check = mysqli_query($conn,
    "SELECT * FROM bill
    WHERE reading_id='$reading_id'
    AND bill_month='$bill_month'
    AND bill_year='$bill_year'");

    if(mysqli_num_rows($check)>0)
    {
        $message="<div class='error-message'>
        Bill already generated for this month.
        </div>";
    }
    else
    {
        $reading=mysqli_query($conn,
        "SELECT meter_reading.*,customer.customer_name
        FROM meter_reading
        INNER JOIN customer
        ON meter_reading.customer_id=customer.id
        WHERE meter_reading.id='$reading_id'");

        $row=mysqli_fetch_assoc($reading);

        $customer_id=$row['customer_id'];
        $units=$row['units_consumed'];

        /* ---------- Slab Calculation ---------- */

        if($units<=100)
        {
            $amount=$units*4;
            $rate="₹4 / Unit";
        }

        elseif($units<=200)
        {
            $amount=(100*4)+(($units-100)*6);
            $rate="₹4 + ₹6 Slab";
        }

        else
        {
            $amount=(100*4)+(100*6)+(($units-200)*8);
            $rate="₹4 + ₹6 + ₹8 Slab";
        }

        $insert=mysqli_query($conn,

        "INSERT INTO bill
        (
        customer_id,
        reading_id,
        units,
        amount,
        bill_month,
        bill_year,
        bill_date,
        payment_status
        )

        VALUES

        (
        '$customer_id',
        '$reading_id',
        '$units',
        '$amount',
        '$bill_month',
        '$bill_year',
        CURDATE(),
        'Unpaid'
        )");

        if($insert)
        {
            $message="<div class='success-message'>
            Electricity Bill Generated Successfully!
            </div>";
        }
        else
        {
            $message="<div class='error-message'>".
            mysqli_error($conn).
            "</div>";
        }
    }
}

include("../includes/header.php");
include("../includes/sidebar.php");
?>

<div class="form-container">

<h2>Generate Electricity Bill</h2>

<?php echo $message; ?>

<form method="POST">

<label>Select Meter Reading</label>

<select name="reading_id" required>

<option value="">Select Meter Reading</option>

<?php

$result=mysqli_query($conn,

"SELECT meter_reading.id,
customer.customer_name,
meter_reading.units_consumed

FROM meter_reading

INNER JOIN customer

ON meter_reading.customer_id=customer.id

ORDER BY customer.customer_name");

while($r=mysqli_fetch_assoc($result))
{

?>

<option value="<?php echo $r['id']; ?>">

<?php

echo $r['customer_name'];

echo " - ";

echo $r['units_consumed'];

echo " Units";

?>

</option>

<?php

}

?>

</select>

<label>Bill Month</label>

<input
type="text"
name="bill_month"
placeholder="Example : July"
required>

<label>Bill Year</label>

<input
type="number"
name="bill_year"
value="<?php echo date('Y'); ?>"
required>

<br><br>

<input
type="submit"
name="generate"
value="Generate Bill">

</form>

<br>

<div style="background:#eef6ff;padding:15px;border-radius:8px;">

<h3>Current Tariff</h3>

<p>0 - 100 Units : ₹4 / Unit</p>

<p>101 - 200 Units : ₹6 / Unit</p>

<p>Above 200 Units : ₹8 / Unit</p>

</div>

</div>

<?php
include("../includes/footer.php");
?>