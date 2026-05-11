<body bgcolor="1883ba" style="white" align="center">
</body>
<?php
GLOBAL $usr;
GLOBAL $contrasena;
$usr = $_POST['usr'];
$contrasena = $_POST['contrasena'];
if (mysqli_connect("localhost", "$usr", "$contrasena", "tiendita")) {
   // code...
$mysqli_link = mysqli_connect("localhost", "$usr", "$contrasena", "tiendita");
echo "CONEXION ESTABLECIDA!!!¡";
echo "<br/>";
echo "<br/>";
echo "Bienvenido Señor Stark¡";
header("Location:home.html");
exit();}
if (mysqli_connect_error()) 
{
    printf("MySQL connection failed with the error: %s", mysqli_connect_error());
echo "<br/>";
echo "<br/>";
echo "<br/>";
echo "<a class='botonmion' href='login.html'>Salir</a>";
echo "<style type='text/css'>";
echo ".botonmion{
   text-decoration: none;
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
   }";
echo "</style>";
echo "<br/>";
echo "<br/>";
echo "<br/>";
    exit;
}
?>