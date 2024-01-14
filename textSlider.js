class TextSlider {
    constructor(x, y, w, lable, min, max, initial = 0) {
        this.x = x
        this.y = y
        this.lable = lable

        this.slider = createSlider(min, max, initial, 0.05)
        this.slider.position(x, y + 20)
        this.slider.size(w)

        this.div = createDiv(lable)
        this.div.position(x, y)
    }

    update() {
        this.div.html(`${this.lable}: ${this.value()}`)
    }

    value() {
        return this.slider.value()
    }
}