function target(x) {
    return (sin(x) + sin(x / 2)) / 2
    // return -sin(x / 2)
}

// calculate the discret fourier transform for a real input.
// 
// f(x) * e^(2*pi*i*w)
// f is the input function.
// w is the chosen frequency.
// 
// Returns the complex result as a string.
function fourier(f, x, w) {

    const evaluation = f(x)
    const exponent = w * x
    const real = evaluation * cos(exponent)
    const imaginary = evaluation * sin(exponent)

    return new Complex(real, imaginary)
}
