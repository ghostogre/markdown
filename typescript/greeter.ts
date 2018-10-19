function greeter (person: string) {
    return "Hello, " + person
}

let user = "Jane User"

document.body.innerHTML = greeter(user)

interface man {
  name?: string,
  age?: number
}

// 以下是错误示范
let boy: man = {name: '王八', age: 12, stage: '舞台'}

let a: (firstName: string, lastName = "123") => string


