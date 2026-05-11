
<body bgcolor="1883ba" style="white" >

<style>
.styled-table { border-collapse: collapse; margin: 0px 0; font-size: .8em; font-family: sans-serif; min-width: 450px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15); }
.styled-table thead tr { background-color: #ff9400; color: "black";}

.styled-table th, .styled-table td { padding: 10px 15px;}

.styled-table tbody tr { border-bottom: 3px solid #1883ba ; } .styled-table tbody tr:nth-of-type(even) { background-color: #f3f3f3; } .styled-table tbody tr:last-of-type { border-bottom: 2px solid "orange"; }
</style>

<style type="text/css">
  .boton{
    alignment-baseline: center;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    font-family: helvetica;
    font-weight: 300;
    font-size: 20px;
    color: #ffff;
    background-color: orange;
    border-radius: 15px;
    border: 3px double; #006504;
    opacity: 1;
    text-decoration: none;
       }
</style>
<button type="button" onClick="location.href='botones.html'" class="boton">VOLVER</button>
<br/>
<button type="button" onClick="location.href='home.html'" class="boton">HOME</button>
<br>

</body>
<?php
$mysqli_link = mysqli_connect("localhost", "root", "", "tiendita");
echo "CONEXION ESTABLESIDA¡";
echo "<br/>";
echo "<br/>";
if (mysqli_connect_error()) 
{
    printf("MySQL connection failed with the error: %s", mysqli_connect_error());
    exit;
}

$id_compra = $_POST['id_compra'];
$select_query = "DELETE FROM compras WHERE id_compra='$id_compra'";
$result = mysqli_query($mysqli_link, $select_query);
$select_query = "SELECT * FROM compras";
$result = mysqli_query($mysqli_link, $select_query);
echo "<table class='styled-table'> <thead> <tr> <th>Id</th> <th>Nombre</th> <th>Marca</th> <th>Modelo</th> <th>Presentación</th> <th>Proveedor</th> <th>Unitario</th> </tr> ";
 
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    echo "</thead><table class='styled-table'> <tbody> <td sty>$row[id_compra]</td> <td>$row[nombre]</td> <td>$row[marca]</td> <td>$row[modelo]</td> <td>$row[presentacion]</td> <td>$row[proveedor]</td> <td>$row[unitario]</td> </tbody> </table>";

    }