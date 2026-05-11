<body bgcolor="1883ba" style="white" >

<button type="button" onclick="location.href='botones.html'" class="boton";>VOLVER</button>

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
</body>

<?php

$mysqli_link = mysqli_connect("localhost", "root", "", "tiendita");
echo "Estamos ready¡ la connection is fine fine fine¡";
echo "<br/>";
echo "<br/>";
if (mysqli_connect_error()) 
{
    printf("MySQL connection failed with the error: %s", mysqli_connect_error());
    exit;
}

$select_query = "SELECT * FROM compras";
$result = mysqli_query($mysqli_link, $select_query);
 
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    echo "<form action='eliminar.php?id_compra=$row[id_compra]' method='POST'>";
    echo "Id_compra:&nbsp" . $row['id_compra'] . "&nbsp &nbsp";
    echo "Nombre:&nbsp" . $row['nombre'] . "&nbsp &nbsp";
    echo "Marca:&nbsp" . $row['marca'] . "&nbsp &nbsp";
    echo "Modelo:&nbsp" . $row['modelo'] . "&nbsp &nbsp";
    echo "Presentacion:&nbsp" . $row['presentacion'] . "&nbsp &nbsp";
    echo "Proveedor:&nbsp" . $row['proveedor'] . "&nbsp &nbsp";
    echo "Unitario:&nbsp" . $row['unitario'] . "&nbsp &nbsp";
    echo "<input method='POST' type='submit' name='$row[id_compra]' class='botonc' value='Eliminar'/>";
    echo"</form>";

    }


?>