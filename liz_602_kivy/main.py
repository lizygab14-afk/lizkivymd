from kivy.app import App
from kivy.uix.gridlayout import GridLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
import math


class CalculatorApp(App):

    def build(self):
        main_layout = GridLayout(cols=1)

        self.solution = TextInput(
            multiline=False,
            readonly=True,
            halign="right",
            font_size=50
        )

        main_layout.add_widget(self.solution)

        buttons = [
            ["7", "8", "9", "/"],
            ["4", "5", "6", "*"],
            ["1", "2", "3", "-"],
            [".", "0", "C", "+"],
            ["^", "%", "√", "π"]
        ]

        for row in buttons:
            h_layout = GridLayout(cols=4)

            for label in row:
                button = Button(text=label)
                button.bind(on_press=self.on_button_press)
                h_layout.add_widget(button)

            main_layout.add_widget(h_layout)

        equals_button = Button(
            text="=",
            font_size=32
        )

        equals_button.bind(on_press=self.on_solution)
        main_layout.add_widget(equals_button)

        return main_layout

    def on_button_press(self, instance):
        current = self.solution.text
        button_text = instance.text

        if button_text == "C":
            self.solution.text = ""

        elif button_text == "π":
            self.solution.text += str(math.pi)

        elif button_text == "√":
            self.solution.text = str(math.sqrt(float(current)))

        else:
            self.solution.text = current + button_text

    def on_solution(self, instance):
        text = self.solution.text

        try:
            # reemplazar símbolos por Python real
            text = text.replace("^", "**")
            text = text.replace("%", "/100")

            self.solution.text = str(eval(text))

        except:
            self.solution.text = "Error"


CalculatorApp().run()