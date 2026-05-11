
drop database hospital33;
create databases hospital33;
use hospital33;
create table medicos(id_medicos int not null primary key,
nombre varchar(30),
especialidad varchar(30));
describe medicos;

insert into medicos values(30,'mario medina','cirujano');
insert into medicos values(31,'marco de tropoya','cardiologo');
insert into medicos values(32,'zaid santiago','enfermero');
insert into medicos values(33,'yuliana perez','pediatra');
insert into medicos values(34,'lizette Jiménez ','CEO');
insert into medicos values(35,'mario bautista','conserje');
insert into medicos values(36,'daniel montaño','gerente');
insert into medicos values(37,'chiwis','cardiologo');
insert into medicos values(38,'ana de armas', zorra');
insert into medicos values(39,'lalo mora','cirujano');
insert into medicos values(40,'chris martin','cardiologo');
insert into medicos values(41,'guy berryman','psiquiatra');
insert into medicos values(42,'jonny buckland','cardiologo');
insert into medicos values(43,'will champion','forense');
insert into medicos values(44,'alex turner','recepcionista');
insert into medicos values(45,'jonathan morales','cardiologo');
insert into medicos values(46,'john shelby','cardiologo');
insert into medicos values(47,'david zepeda','enfermera');
insert into medicos values(48,'carla fuentes','cardiologo');
insert into medicos values(49,'yamileth zepeda','cardiologo');
insert into medicos values(50,'Angel','Limpieza');
select *from medicos;

create table ingresos(id_ingresos int not null primary key,
cf_medicos int(10),
no_habitacion int(10),
fecha_ingreso date);

insert into ingresos values(200,30,4,'2023/04/23');
select *from ingresos;

describe ingresos;