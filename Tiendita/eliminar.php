<body bgcolor="1883ba" style="white" >
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

<button type="button" onClick="location.href='botones.html'" class="boton";>VOLVER</button>

<br/>
<br/>
<button type="button" onClick="location.href='home.html'" class="boton">HOME</button>

</body>
<?php

$mysqli_link = mysqli_connect("localhost", "root", "", "tiendita");
echo "CONECXION CORRECTA¡";
echo "<br/>";
echo "<br/>";
if (mysqli_connect_error()) 
{
    printf("MySQL connection failed with the error: %s", mysqli_connect_error());
    exit;
}
$id_compra = $_GET['id_compra'];
//Se borra registro campo Id_compra

$select_query = "DELETE FROM compras WHERE id_compra='$id_compra'";
$result = mysqli_query($mysqli_link, $select_query);

$select_query = "SELECT * FROM compras";
$result = mysqli_query($mysqli_link, $select_query);
 
while ($rowb = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    echo "Id_compra:" . $rowb['id_compra'] . "&nbsp &nbsp";
    echo "Nombre:" . $rowb['nombre'] . "&nbsp &nbsp";
    echo "Marca:" . $rowb['marca'] . "&nbsp &nbsp";
    echo "Modelo:" . $rowb['modelo'] . "&nbsp &nbsp";
    echo "Presentacion:" . $rowb['presentacion'] . "&nbsp &nbsp";
    echo "Proveedor:" . $rowb['proveedor'] . "&nbsp &nbsp";
    echo "Unitario:" . $rowb['unitario'] . "&nbsp &nbsp";
    echo "<br/>";
    }
?>