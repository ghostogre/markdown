> ## 安装TypeScript
 
    npm install -g typescript

编写.ts文件后，在命令行上，运行TypeScript编译器：

    tsc greeter.ts

输出结果为一个.js文件.

> TypeScript 只会进行静态检查，如果发现有错误，编译的时候就会报错。如果要在报错的时候终止 js 文件的生成，可以在 tsconfig.json 中配置 noEmitOnError 即可。

## 接口

    interface Person {
        firstName: string;
        lastName: string;
    }

    function greeter(person: Person) {
        return "Hello, " + person.firstName + " " + person.lastName;
    }

    let user = { firstName: "Jane", lastName: "User" };

    document.body.innerHTML = greeter(user);

## 类

TypeScript支持JavaScript的新特性。在构造函数的参数上使用public等同于创建了同名的成员变量。

    class Student {
        fullName: string;
        constructor(public firstName, public middleInitial, public lastName) {
            this.fullName = firstName + " " + middleInitial + " " + lastName;
        }
    }

    interface Person {
        firstName: string;
        lastName: string;
    }

    function greeter(person : Person) {
        return "Hello, " + person.firstName + " " + person.lastName;
    }

    let user = new Student("Jane", "M.", "User");

    document.body.innerHTML = greeter(user);

## 类型

ts里面声明变量：let isDone: boolean = false

> 基本类型：

1. 布尔: 
    
    使用构造函数 Boolean 创造的对象不是布尔值,new Boolean() 返回的是一个 Boolean 对象
    直接调用 Boolean 也可以返回一个 boolean 类型：

        let createdByBoolean: boolean = Boolean(1);

    在 TypeScript 中，boolean 是 JavaScript 中的基本类型，而 Boolean 是 JavaScript 中的构造函数。其他基本类型（除了 null 和 undefined）一样。

2. 数字
3. 字符串(支持模板字符串)
4. 数组
    
        let list: number[] = [1, 2, 3]; // 由此类型元素组成的一个数组

        let list: Array<number> = [1, 2, 3]; // 数组泛型

    类数组（Array-like Object）不是数组类型，比如 arguments

5. 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。

        // Declare a tuple type
        let x: [string, number];
        // Initialize it
        x = ['hello', 10]; // OK
        // Initialize it incorrectly
        x = [10, 'hello']; // Error
    
    当访问一个已知索引的元素，会得到正确的类型。

    当访问一个越界的元素，会使用联合类型替代。
6. 枚举：enum类型是对JavaScript标准数据类型的一个补充。使用枚举我们可以定义一些带名字的常量。TypeScript支持数字的和基于字符串的枚举。
   
    默认情况下，从0开始为元素初始化，你也可以手动的指定成员的数值。或者全部都采用手动赋值.枚举类型提供的一个便利是你可以由枚举的值得到它的名字。

        enum Color {Red = 1, Green, Blue}
        let colorName: string = Color[2];

        alert(colorName);  // 显示'Green'因为上面代码里它的值是2

    在一个字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。

7. Any:
    
    **任意值**用来表示允许赋值为任意类型。

    不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用`any`类型来标记这些变量。Object类型的变量只是允许你给它赋任意值 - 但是却不能够在它上面调用任意的方法，即便它真的有这些方法。

    > 1. 声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值。
    > 2. 变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型。
    > 3. 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查
8. 某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void。声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null
9.  TypeScript里，undefined和null两者各自有自己的类型分别叫做undefined和null。默认情况下null和undefined是所有类型的子类型。指定了--strictNullChecks标记，null和undefined只能赋值给void和它们各自。
10. never类型表示的是那些永不存在的值的类型。
never类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 never类型，当它们被永不为真的类型保护所约束时。
never类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使 any也不可以赋值给never。
11. 类型断言，使用<>和as解决。 TypeScript会假设你，程序员，已经进行了必须的检查。主要用于绕开检查


> ## 接口

用于类型检查的规则。

带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个?符号。可选属性的好处之一是可以对可能存在的属性进行预定义，好处之二是可以捕获引用了不存在的属性时的错误。

可以在属性名前用 readonly来指定只读属性

    interface Point {
        readonly x: number;
        readonly y: number;
    }
    let p1: Point = { x: 10, y: 20 };
    p1.x = 5; // error!

TypeScript具有ReadonlyArray<T>类型，它与Array<T>相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改

最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 const，若做为属性则使用readonly。

对象字面量会被特殊对待而且会经过 额外属性检查，当将它们赋值给变量或作为参数传递的时候。 如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。

最佳的方式是能够添加一个字符串索引签名，前提是你能够确定这个对象可能具有某些做为特殊用途使用的额外属性。

    interface SquareConfig {
        color?: string;
        width?: number;
        [propName: string]: any;
    }

**一旦定义了任意属性，那么确定属性和可选属性都必须是它的子属性.**

接口能够描述JavaScript中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，接口也可以描述函数类型。

    interface SearchFunc {
        (source: string, subString: string): boolean;
    }

对于`函数类型`的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。

`可索引类型`具有一个 索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。 

    interface StringArray {
        [index: number]: string;
    }

    let myArray: StringArray;
    myArray = ["Bob", "Fred"];
    // 这个索引签名表示了当用 number去索引StringArray时会得到string类型的返回值。

共有支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 number来索引时，JavaScript会将它转换成string然后再去索引对象。 也就是说用 100（一个number）去索引等同于使用"100"（一个string）去索引，因此两者需要保持一致。

**实现接口**

    interface ClockInterface {
        currentTime: Date;
        setTime(d: Date);
    }

    class Clock implements ClockInterface {
        currentTime: Date;
        setTime(d: Date) {
            this.currentTime = d;
        }
        constructor(h: number, m: number) { }
    }

接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。

当一个类实现了一个接口时，只对其实例部分进行类型检查。 constructor存在于类的静态部分，所以不在检查的范围内。constructor存在于类的静态部分，所以不在检查的范围内。

    interface ClockConstructor {
        new (hour: number, minute: number): ClockInterface;
    }
    interface ClockInterface {
        tick();
    }

    function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
        return new ctor(hour, minute);
    }

    class DigitalClock implements ClockInterface {
        constructor(h: number, m: number) { }
        tick() {
            console.log("beep beep");
        }
    }
    class AnalogClock implements ClockInterface {
        constructor(h: number, m: number) { }
        tick() {
            console.log("tick tock");
        }
    }

    let digital = createClock(DigitalClock, 12, 17);
    let analog = createClock(AnalogClock, 7, 32);

**接口继承**

和类一样，接口也可以相互继承。

一个接口可以继承多个接口，创建出多个接口的合成接口。

**混合类型**

接口能够描述JavaScript里丰富的类型。
    interface Counter {
        (start: number): string;
        interval: number;
        reset(): void;
    }

    function getCounter(): Counter {
        let counter = <Counter>function (start: number) { };
        counter.interval = 123;
        counter.reset = function () { };
        return counter;
    }

    let c = getCounter();
    c(10);
    c.reset();
    c.interval = 5.0;

**接口继承类**

当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的private和protected成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。


> http://www.css88.com/doc/typescript/doc/handbook/Enums.html