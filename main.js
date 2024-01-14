const PI = 3.14159265

let xSlider, wSlider

const width = 300
const height = 600

const xMax = 100
const xStep = 0.02
const wMax = 2
const wStep = 0.01

function setup() {
    createCanvas(width, height);

    xSlider = new TextSlider(10, height + 20, width - 20, "max(x)", 0, xMax, 20)
    wSlider = new TextSlider(10, height + 70, width - 20, "winding frequency (ω)", 0, wMax)
}

function draw() {
    background("#1C1C26");
    wSlider.update()
    xSlider.update()

    let pg = drawOriginal(width, height / 4, target)
    image(pg, 0, 0)

    pg = drawWrapped(width, height / 2, target)
    image(pg, 0, height / 4)

    pg = drawIntegral(width, height / 4, target)
    image(pg, 0, 3 * height / 4)
}

function drawOriginal(width, height, func) {
    let pg = createGraphics(width, height)

    // background
    pg.push()
    {
        pg.background("#2b2b3b")
        pg.stroke("#575775")
        pg.strokeWeight(10)
        pg.line(0, height, width, height)

        pg.fill(255)
        pg.noStroke()
        pg.textSize(16)
        pg.text("f(x)", 5, 20)
    }
    pg.pop()

    // axis
    pg.push()
    {
        pg.stroke("#575775")
        pg.strokeWeight(3)

        // y axis
        pg.line(40, 20, 40, height - 20)

        pg.fill(255)
        pg.noStroke()
        pg.textSize(16)

        pg.text("x", 10, height / 2 + 4)
        pg.text("y", 35, height - 10)
    }
    pg.pop()

    // gradients
    pg.push()
    {
        pg.stroke("#575775")
        pg.strokeWeight(0.5)
        // x axis
        pg.line(20, height / 2, width, height / 2)

        for (let i = 0; i < xMax; i += 2 * PI) {
            x = i / xMax * (width - 40)
            x += 40

            pg.line(x, height / 2 + 30, x, height / 2 - 30)
        }
    }
    pg.pop()

    // graph
    pg.push()
    {
        pg.stroke("#D6C4BA")
        pg.strokeWeight(2)
        pg.noFill()
        pg.beginShape()

        pg.translate(40, height / 2)

        for (let x = 0; x < xSlider.value(); x += xStep) {

            let eval = func(x) * 10
            let i = (x * (width - 40) / xMax)

            pg.vertex(
                i,
                eval,
            )
        }

        pg.endShape()
    }
    pg.pop()

    return pg
}

function drawWrapped(width, height, func) {
    let pg = createGraphics(width, height)

    // background
    pg.push()
    {
        pg.background("#2b2b3b")
        pg.stroke("#575775")
        pg.strokeWeight(10)
        pg.line(0, height, width, height)

        pg.fill(255)
        pg.noStroke()
        pg.textSize(16)
        pg.text("Wrapped", 5, 20)
    }
    pg.pop()

    // axis
    pg.push()
    {
        pg.stroke("#575775")
        pg.strokeWeight(3)

        // x
        pg.line(20, height / 2, width, height / 2)

        // y
        pg.line(width / 2, 20, width / 2, height - 20)

        pg.fill(255)
        pg.noStroke()
        pg.textSize(16)

        pg.text("R", 5, height / 2 + 4)
        pg.text("im", width / 2 - 10, height - 10)
    }
    pg.pop()

    // wrapped
    let realSum = 0, imgSum = 0, pointCount = 0
    pg.push()
    {
        pg.strokeWeight(2)
        pg.stroke("#D6C4BA")
        pg.noFill()
        pg.beginShape()

        pg.translate(width / 2, height / 2)

        for (let x = 0; x < xSlider.value(); x += xStep) {
            eval = fourier(target, x, wSlider.value())
            real = (width * eval.real) / 4
            img = (height * eval.img) / 4
            vertex(
                real,
                img,
            )

            realSum += real
            imgSum += img
            pointCount += 1
        }

        pg.endShape()
    }
    pg.pop()

    // sum
    pg.push()
    {
        pg.strokeWeight(20)
        pg.stroke("#8C6472")

        pg.translate(width / 2, height / 2)

        pg.point(
            realSum / pointCount,
            imgSum / pointCount,
        )
    }
    pg.pop()

    return pg
}

function drawIntegral(width, height, func) {
    let pg = createGraphics(width, height)

    // background
    pg.push()
    {
        pg.background("#2b2b3b")
        pg.stroke("#575775")
        pg.strokeWeight(10)
        pg.line(0, height, width, height)

        pg.fill(255)
        pg.noStroke()
        pg.textSize(16)
        pg.text("∫f(x)", 5, 20)
    }
    pg.pop()

    // axis
    pg.push()
    {
        pg.stroke("#575775")
        pg.strokeWeight(3)

        // x axis
        pg.line(20, height / 2, width, height / 2)

        // y axis
        pg.line(40, 20, 40, height - 20)

        pg.fill(255)
        pg.noStroke()
        pg.textSize(16)

        pg.text("ω", 10, height / 2 + 4)
        pg.text("y", 35, height - 10)
    }
    pg.pop()

    // gradients
    pg.push()
    {
        pg.stroke("#575775")
        pg.strokeWeight(1)
        // x axis
        pg.line(20, height / 2, width, height / 2)

        for (let i = 0; i < wMax; i += 0.1) {
            x = i / wMax * (width - 40)
            x += 40


            pg.line(x, height / 2 + 5, x, height / 2 - 5)
        }
    }
    pg.pop()

    // integral
    pg.push()
    {
        pg.strokeWeight(2)
        pg.stroke("#D6C4BA")
        pg.noFill()
        pg.beginShape()

        pg.translate(40, height / 2)

        // loop over each w value
        for (let w = 0; w < wSlider.value(); w += wStep) {

            let realSum = 0, imgSum = 0, pointCount = 0

            // calculate the area under the curve for this w and xMax
            for (let x = 0; x < xSlider.value() * 2; x += xStep) {
                eval = fourier(target, x, w)
                real = (width * eval.real) / 4
                img = (height * eval.img) / 4

                realSum += real
                imgSum += img
                pointCount += 1
            }

            let i = (w * (width - 40) / wMax)
            let x = imgSum / pointCount
            let y = realSum / pointCount
            let d = -sqrt(x ** 2 + y ** 2)
            pg.vertex(i, d)
            // pg.stroke("#D6C4BA")
            // pg.point(
            //     i,
            //     imgSum / (pointCount)
            // )

            // pg.stroke("#8C6472")
            // pg.point(
            //     i,
            //     realSum / (pointCount)
            // )
        }

        pg.endShape()
    }
    pg.pop()

    return pg
}