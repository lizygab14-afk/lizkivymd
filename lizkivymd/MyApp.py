import sqlite3

from kivymd.app import MDApp
from kivymd.uix.screen import MDScreen
from kivymd.uix.textfield import MDTextField
from kivymd.uix.button import MDRaisedButton
from kivymd.uix.label import MDLabel


class MyApp(MDApp):

    def build(self):

        # CONEXIÓN A BASE DE DATOS
        self.conexion = sqlite3.connect("miapp.db")
        self.cursor = self.conexion.cursor()

        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            edad TEXT
        )
        """)

        self.conexion.commit()

        # PANTALLA
        screen = MDScreen()

        # INPUT NOMBRE
        self.nombre = MDTextField(
            hint_text="Nombre",
            pos_hint={"center_x": 0.5, "center_y": 0.65},
            size_hint_x=0.8
        )

        # INPUT EDAD
        self.edad = MDTextField(
            hint_text="Edad",
            pos_hint={"center_x": 0.5, "center_y": 0.55},
            size_hint_x=0.8
        )

        # BOTÓN GUARDAR
        boton = MDRaisedButton(
            text="Guardar",
            pos_hint={"center_x": 0.5, "center_y": 0.40},
            on_release=self.guardar_datos
        )

        # MENSAJE
        self.label = MDLabel(
            text="",
            halign="center",
            pos_hint={"center_y": 0.25}
        )

        # AGREGAR A PANTALLA
        screen.add_widget(self.nombre)
        screen.add_widget(self.edad)
        screen.add_widget(boton)
        screen.add_widget(self.label)

        return screen

    def guardar_datos(self, obj):

        nombre = self.nombre.text
        edad = self.edad.text

        if nombre == "" or edad == "":
            self.label.text = "Completa todos los campos"
            return

        self.cursor.execute(
            "INSERT INTO usuarios (nombre, edad) VALUES (?, ?)",
            (nombre, edad)
        )

        self.conexion.commit()

        self.label.text = f"Guardado: {nombre} ({edad})"

        self.nombre.text = ""
        self.edad.text = ""

    def on_stop(self):
        self.conexion.close()


MyApp().run()