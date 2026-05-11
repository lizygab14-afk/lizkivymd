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

<button type="button" onclick="location.href='botones.html'" class="boton">VOLVER</button>

<br/>
<br/>

<form action="editar1.php" method="POST">
<input type="submit" value="Editar" name="Editar" style="white" class="boton">
<p style="color:#ffff;">Id_compra</p>
<input type="text" name="id_compra" placeholder="Escribe id">

<p style="color:#ffff;">Nombre</p>
<input type="text" name="nombre" placeholder="Escribe nombre del producto">

<p style="color:#ffff;">Marca</p>
<input type="text" name="marca" placeholder="Escribe marca del producto">

<p style="color:#ffff;">Modelo</p>
<input type="text" name="modelo" placeholder="Escribe modelo">

<p style="color:#ffff;">Presentacion</p>
<input type="text" name="presentacion" placeholder="Escribe presentacion del producto">

<p style="color:#ffff;">Proveedor</p>
<input type="text" name="proveedor" placeholder="Escribe proveedor del producto">

<p style="color:#ffff;">Unitario</p>
<input type="text" name="unitario" placeholder="Escribe el precio por pieza del producto">
</form>

</body>


<?php



















?>