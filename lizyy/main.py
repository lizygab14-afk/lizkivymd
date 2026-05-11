from kivy.app import App
from kivy.uix.gridlayout import GridLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.graphics import Color, RoundedRectangle
from kivy.core.window import Window

Window.clearcolor = (0.08, 0.08, 0.08, 1)

class BotonRedondo(Button):
    def __init__(self, bg_color, **kwargs):
        super().__init__(**kwargs)
        self.background_normal = ""
        self.background_color = (0,0,0,0)
        self.bg_color = bg_color

        with self.canvas.before:
            Color(*self.bg_color)
            self.rect = RoundedRectangle(radius=[15])

        self.bind(pos=self.update_rect, size=self.update_rect)

    def update_rect(self, *args):
        self.rect.pos = self.pos
        self.rect.size = self.size


class Calculadora(App):

    def build(self):
        self.operacion = ""

        layout = GridLayout(cols=4, padding=10, spacing=10)

        # Pantalla
        self.pantalla = TextInput(
            text="",
            font_size=40,
            readonly=True,
            halign="right",
            size_hint=(1, 0.3),
            background_color=(0.1, 0.1, 0.1, 1),
            foreground_color=(1,1,1,1)
        )

        layout.add_widget(self.pantalla)

        botones = [
            ("7","num"),("8","num"),("9","num"),("/","op"),
            ("4","num"),("5","num"),("6","num"),("*","op"),
            ("1","num"),("2","num"),("3","num"),("-","op"),
            ("C","esp"),("0","num"),("=","esp"),("+","op"),
        ]

        for texto, tipo in botones:

            if tipo == "op":
                color = (0.2, 0.6, 0.9, 1)  # azul
                text_color = (1,1,1,1)
            elif tipo == "esp":
                color = (0.2, 0.6, 0.9, 1)
                text_color = (1,1,1,1)
            else:
                color = (0.9, 0.9, 0.9, 1)  # gris claro
                text_color = (0,0,0,1)

            boton = BotonRedondo(
                text=texto,
                font_size=22,
                bg_color=color,
                color=text_color
            )

            boton.bind(on_press=self.on_button_press)
            layout.add_widget(boton)

        return layout

    def on_button_press(self, instance):
        texto = instance.text

        if texto == "C":
            self.operacion = ""
        elif texto == "=":
            try:
                self.operacion = str(eval(self.operacion))
            except:
                self.operacion = "Error"
        else:
            self.operacion += texto

        self.pantalla.text = self.operacion


if __name__ == "__main__":
    Calculadora().run()