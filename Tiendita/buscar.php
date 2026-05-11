<body bgcolor="1883ba" style="white" >

  <style>
.styled-table { border-collapse: collapse; margin: 0px 0; font-size: .8em; font-family: sans-serif; min-width: 450px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15); }
.styled-table thead tr { background-color: #ff9400; color: "black";}

.styled-table th { padding: 10px 14px;} 
.styled-table td { padding: 10px 15px;}
.styled-table th:nth-child(1){width:15px;}
.styled-table th:nth-child(2){width:120px;}
.styled-table th:nth-child(3){width:120px;}
.styled-table th:nth-child(4){width:120px;}
.styled-table th:nth-child(5){width:120px;}
.styled-table th:nth-child(6){width:120px;}
.styled-table th:nth-child(7){width:120px;}
.styled-table th:nth-child(8){width:120px;}
.styled-table td:nth-child(1){width:15px;}
.styled-table td:nth-child(2){width:120px;}
.styled-table td:nth-child(3){width:120px;}
.styled-table td:nth-child(4){width:120px;}
.styled-table td:nth-child(5){width:120px;}
.styled-table td:nth-child(6){width:120px;}
.styled-table td:nth-child(7){width:120px;}
.styled-table td:nth-child(8){width:104px;}

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

<style type="text/css">
  .botonc{
    alignment-baseline: center;
    padding: 3px;
    padding-left: 10px;
    padding-right: 10px;
    font-family: helvetica;
    font-weight: 300;
    font-size: 12px;
    color: #ffff;
    background-color: orange;
    border-radius: 5px;
    border: 3px double; #006504;
    opacity: .8;
    text-decoration: none;
       }
</style>

<button type="button" onClick="location.href='botones.html'" class="boton">VOLVER</button>

<br/>
<br/>

</body>

<?php
$mysqli_link = mysqli_connect("localhost", "root", "", "tiendita");
echo "";
echo "<br/>";
echo "<br/>";
if (mysqli_connect_error()) 
{
    printf("MySQL connection failed with the error: %s", mysqli_connect_error());
    exit;
}

$id_compra = $_POST['id_compra'];

$select_query = "SELECT * FROM compras WHERE id_compra='$id_compra'";
$result = mysqli_query($mysqli_link, $select_query);

echo "<table class='styled-table'> <thead> <tr> <th>Id</th> <th>Nombre</th> <th>Marca</th> <th>Modelo</th> <th>Presentación</th> <th>Proveedor</th> <th>Unitario</th> <th>Herramientas</th> </tr> ";
 
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
echo "<form action='eliminar.php?id_compra=$row[id_compra]' method='POST'>";
echo "</thead><table class='styled-table'> <tbody> <td sty>$row[id_compra]</td> <td>$row[nombre]</td> <td>$row[marca]</td> <td>$row[modelo]</td> <td>$row[presentacion]</td> <td>$row[proveedor]</td> <td>$row[unitario]</td> <td><input method='POST' type='submit' name='$row[id_compra]' class='botonc' value='Eliminar'/></td> </tbody> </table>";
    }
?>