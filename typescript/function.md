> # 函数

可以给每个参数添加类型之后再为函数本身添加返回值类型。 TypeScript能够根据返回语句自动推断出返回值类型，因此我们通常省略它。

    let myAdd: (baseValue: number, increment: number) => number =
    function(x: number, y: number): number { return x + y; };

`函数类型`包含两部分：参数类型和返回值类型。 当写出完整函数类型的时候，这两部分都是需要的。 我们以参数列表的形式写出参数类型，为每个参数指定一个名字和类型。 这个名字只是为了增加可读性。只要参数类型是匹配的，那么就认为它是有效的函数类型，而不在乎参数名是否正确。

对于返回值，我们在函数和返回值类型之前使用( =>)符号，使之清晰明了。 如果函数没有返回任何值，你也必须指定返回值类型为 void而不能留空。

如果你在赋值语句的一边指定了类型但是另一边没有类型的话，TypeScript编译器会自动识别出类型.这叫做“按上下文归类”，是类型推论的一种。 

> ## 可选参数和默认参数

TypeScript里的每个函数参数都是必须的。 这不是指不能传递 null或undefined作为参数，而是说编译器检查用户是否为每个参数都传入了值。 传递给一个函数的参数个数必须与函数期望的参数个数一致。

JavaScript里，每个参数都是可选的，可传可不传。 没传参的时候，它的值就是undefined。 在TypeScript里我们可以在参数名后使用 ?实现可选参数的功能。

在TypeScript里，我们也可以为参数提供一个默认值当用户没有传递这个参数或传递的值是undefined时。 它们叫做有默认初始化值的参数。 

    function buildName(firstName: string, lastName = "Smith") {
        return firstName + " " + lastName;
    }

    let result1 = buildName("Bob");                  // works correctly now, returns "Bob Smith"
    let result2 = buildName("Bob", undefined);       // still works, also returns "Bob Smith"

在所有必须参数后面的带默认初始化的参数都是可选的，与可选参数一样，在调用函数的时候可以省略。 也就是说可选参数与末尾的默认参数共享参数类型。

    function buildName(firstName: string, lastName?: string) {
        // ...
    }
和

    function buildName(firstName: string, lastName = "Smith") {
        // ...
    }

共享同样的类型(firstName: string, lastName?: string) => string。 默认参数的默认值消失了，只保留了它是一个可选参数的信息。

与普通可选参数不同的是，带默认值的参数不需要放在必须参数的后面。 如果带默认值的参数出现在必须参数前面，用户必须明确的传入 undefined值来获得默认值。

> ## 剩余参数

必要参数，默认参数和可选参数有个共同点：它们表示某一个参数。 有时，你想同时操作多个参数，或者你并不知道会有多少参数传递进来。 在JavaScript里，你可以使用 arguments来访问所有传入的参数。

剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个。 编译器创建参数数组，名字是你在省略号（ ...）后面给定的名字，你可以在函数体内使用这个数组。

省略号也会在带有剩余参数的`函数类型定义`上

> ## this

修改的方法是，提供一个显式的 this参数。this参数是个假的参数，它出现在参数列表的最前面：

    function f(this: void) {
        // make sure `this` is unusable in this standalone function
    }

让类型重用能够变得清晰简单些：

    interface Card {
        suit: string;
        card: number;
    }
    interface Deck {
        suits: string[];
        cards: number[];
        createCardPicker(this: Deck): () => Card;
    }
    let deck: Deck = {
        suits: ["hearts", "spades", "clubs", "diamonds"],
        cards: Array(52),
        // NOTE: The function now explicitly specifies that its callee must be of type Deck
        createCardPicker: function(this: Deck) {
            return () => {
                let pickedCard = Math.floor(Math.random() * 52);
                let pickedSuit = Math.floor(pickedCard / 13);

                return {suit: this.suits[pickedSuit], card: pickedCard % 13};
            }
        }
    }

    let cardPicker = deck.createCardPicker();
    let pickedCard = cardPicker();

    alert("card: " + pickedCard.card + " of " + pickedCard.suit);

`在回调函数里的this` -- 当你将一个函数传递到某个库函数里稍后会被调用时。 因为当回调被调用的时候，它们会被当成一个普通函数调用， this将为undefined。 稍做改动，你就可以通过 this参数来避免错误。

    // 例如
    interface UIElement {
        addClickListener(onclick: (this: void, e: Event) => void): void;
    }

> https://www.tslang.cn/docs/handbook/functions.html

这是可行的因为箭头函数不会捕获this，所以你总是可以把它们传给期望this: void的函数。 缺点是每个对象都会创建一个箭头函数。 另一方面，方法只会被创建一次，添加到`原型链`上。 它们在不同 Handler对象间是共享的。

> ## 重载

根据传入参数的不同会返回两种不同的类型。方法是**为同一个函数提供多个函数类型定义**来进行函数重载。 编译器会根据这个列表去处理函数的调用。 

JS重载

