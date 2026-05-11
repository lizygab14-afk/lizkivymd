<button type="button" onclick="javascript:window.print()">Imprimir</button>
<button type="button" onclick="javascript:history.back()">Regresar</button>
<div id="imp1"><div style="background-color:#d4eefd;padding:12px;margin:12px 0 12px 0;">

<style>
.styled-table { border-collapse: collapse; margin: 0px 0; font-size: .8em; font-family: sans-serif; min-width: 450px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15); }
.styled-table thead tr { background-color: #ff9400; color: "black";}

.styled-table th { padding: 10px 15px;} 
.styled-table td { padding: 10px 15px;}
.styled-table th:nth-child(1){width:15px;}
.styled-table th:nth-child(2){width:120px;}
.styled-table th:nth-child(3){width:120px;}
.styled-table th:nth-child(4){width:120px;}
.styled-table th:nth-child(5){width:120px;}
.styled-table th:nth-child(6){width:120px;}
.styled-table th:nth-child(7){width:120px;}
.styled-table td:nth-child(1){width:15px;}
.styled-table td:nth-child(2){width:120px;}
.styled-table td:nth-child(3){width:120px;}
.styled-table td:nth-child(4){width:120px;}
.styled-table td:nth-child(5){width:120px;}
.styled-table td:nth-child(6){width:120px;}
.styled-table td:nth-child(7){width:120px;}

.styled-table tbody tr { border-bottom: 3px solid #1883ba ; } .styled-table tbody tr:nth-of-type(even) { background-color: #f3f3f3; } .styled-table tbody tr:last-of-type { border-bottom: 2px solid "orange"; }
</style>

<?php
$mysqli_link = mysqli_connect("localhost", "root", "", "tiendita");

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

echo "<table class='styled-table'> <thead> <tr> <th>Id</th> <th>Nombre</th> <th>Marca</th> <th>Modelo</th> <th>Presentación</th> <th>Proveedor</th> <th>Unitario</th> </tr> ";

echo "<h1>Reporte de búsqueda</h1>"; 
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    echo "</thead><table class='styled-table'> <tbody> <td sty>$row[id_compra]</td> <td>$row[nombre]</td> <td>$row[marca]</td> <td>$row[modelo]</td> <td>$row[presentacion]</td> <td>$row[proveedor]</td> <td>$row[unitario]</td> </tbody> </table>";
    }
?>
</div></div>
<button type="button" onclick="javascript:imprim1(imp1);">Imprimir</button>
<script>
function imprim1(imp1){
var printContents = document.getElementById('imp1').innerHTML;
        w = window.open();
        w.document.write(printContents);
        w.document.close(); // necessary for IE >= 10
        w.focus(); // necessary for IE >= 10
		w.print();
		w.close();
        return true;}
</script>