type u = 1 | 2

function foo(x: u) {
    if (x !== 1 || x !== 2) {
       // Operator '!==' cannot be applied to types '1' and '2'.
    }
}

foo(2)
