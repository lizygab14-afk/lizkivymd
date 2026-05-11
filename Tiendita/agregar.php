<body bgcolor="1883ba" style="white" >
</br>
</br>
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
<a href="botones.html" class="boton">VOLVER</a>

<br/>
<br/>
<button type="button" onClick="location.href='home.html'" class="boton">HOME</button>
<br>
</form>

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
echo "CONEXION ESTABLESIDA¡";
echo "<br/>";
echo "<br/>";
if (mysqli_connect_error()) 
{
    printf("MySQL connection failed with the error: %s", mysqli_connect_error());
    exit;
}

$id_compra = $_POST['id_compra'];
echo $Id_compra;
$nombre = $_POST['nombre'];
echo $nombre;
$marca = $_POST['marca'];
echo $marca;
$modelo = $_POST['modelo'];
echo $modelo;
$presentacion = $_POST['presentacion'];
echo $presentacion;
$proveedor = $_POST['proveedor'];
echo $proveedor;
$unitario = $_POST['unitario'];
echo $unitario;



$insert_query = "INSERT INTO compras(`id_compra`,`nombre`,`marca`,`modelo`,`presentacion`,`proveedor`,`unitario`)
VALUES ('$id_compra','$nombre','$marca','$modelo','$presentacion','$proveedor','$unitario')";
  
// run the insert query
If (mysqli_query($mysqli_link, $insert_query)) {
    echo 'REGISTRO GUARDADO CORRECTAMENTE¡';
    echo "<br/>";
    echo "<br/>";
}
$select_query = "SELECT * FROM compras";
$results = mysqli_query($mysqli_link, $select_query);
while ($row = mysqli_fetch_array($results, MYSQLI_ASSOC)) {
//Aqui esta la magia...esta linea crea el código y pasa el valor de $row a eliminar.php-->
echo "<form action='eliminar.php?id_compra=$row[id_compra]' method='POST'>";
    echo "Id_compra:&nbsp" . $row['id_compra']. "&nbsp &nbsp";
    $contadorq='$row[id_compra]';
    echo "Nombre:&nbsp" . $row['nombre'] . "&nbsp &nbsp";
    echo "Marca:&nbsp" . $row['marca'] . "&nbsp &nbsp";
    echo "Modelo:&nbsp" . $row['modelo'] . "&nbsp &nbsp";
    echo "Presentacion:&nbsp" . $row['presentacion'] . "&nbsp &nbsp";
    echo "Proveedor:&nbsp" . $row['proveedor'] . "&nbsp &nbsp";
    echo "Unitario:&nbsp" . $row['unitario'] . "&nbsp &nbsp";
    echo "<input method='POST' type='submit' name='$row[id_compra]' class='botonc' value='Eliminar'/>";      
echo"</form>";
    }
$delete_query = "DELETE FROM compras WHERE `id_compra` = '23'";
// ACTUALIZAR QUERY
If (mysqli_query($mysqli_link, $delete_query)) {
    echo 'REGISTRO BORRADO¡';
} 
// CERRANDO BASE DE DATOS 
mysqli_close($mysqli_link);
?>
