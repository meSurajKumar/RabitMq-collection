# What is typescript ?.
 - Typescript ek superset hai javascript ka -- yani jo Javascript kat sakta hai woh , Typescript bhi kr sakta hai.
 - Isme static typing , optinal typing add ki gayi hai -- variable , functions etc ki type specify krna possible hai.
 - Code likhne ki baad typescript compiler usko javascript me convert krta hai (transpile) --  fir woh runtime pr chalega.

## Why we use Typescript ?
 - Javascript loosely typed hai -- variable ka ype runtime tak pata nahi hota , bugs ka chance zayada hota hai. Typescript compiler time pr error catch kr leta hai.

 - Large scale appilcations me maintainability aur readability better ho jaati hai. Types , interfaces etc se code structure clear hota hai.

 - Better tooling support --- IDEs ko type info  milti hai , auto-completion , refactoring easier hota hai.

### AB kuch questions :- 
 - Runtime and compile time kya hai ?
 - static typing and optinal typing kya hai ?
 
 Answer :-
 ## Runtime and Compile time.
  
  - Compile-time :- Jb tumhara source code jasi ki (java , Typescript , C++ etc.) "compile" ho raha hai -- yani compiler us code ko check kr raha , error dhundh raha hai , aur phir machine-code ya byte-code bana raha hai.
  ```
  let userName : string;
  userNames = 24 // yaha pr naam galat hai userNames and jb ki userName hona chayee tha. and compiler usko compile time pr pakad lega (error : valiable not found) -- ye compile-time error hai.
  ```

   - Runtime :- Jab compiled program chal raha hai (execute ho raha hai) -- yani user ya system us program  ko run kar raha hai, variables ko values mil rahi hai and logics run ho rahe hai. 
  ```
  const arr : number[] = new Array(3);
  console.log(arr[5]);
  // Typescript compile pr koi error nahi dega (Kyuki array bounds check compile time par nahi hota).
  Runtime error ye simply Undefined print karega.
  ```
 
## Static Typing Aur Optional Typing.
 - Static typing ka matlab hai :- Variables ka type hai jasi (string , number , boolean etc.) compile-time pe known hota hai. Compiler type-checking karta hai aur wrong type assign keye gaye hai to errors deta hai compile-time pe.
     ```
     Static typing example.
        let age:number = 30;
        age = "Ten"; // error at compile time.
    ```

 - Optional typing :- ka mtlab hai ek language aise hai jisme types assign krna   optional hai tum types specify kat sakte ho ya nahi  aur compiler ya tooling tumhe allow karta hai ki type-checking kum stricter ho. 
    ```
    let something; // type is any here.
    something = 10;
    something = 'hello'; // allowed because type was not enforced strictly.
    ```
    #### Why it's matter for the interview.
    ```
     1. Agar language static typed hai, to aise errors early catch hote hain ,    code zyada robust hota hai.
     
     2. Optinal typing ka matlab hai "balance" -- full strictness ko kam kr sakte ho.

     3. In context of TS : TS is "optinally statically typed" yani static typing ka support hai, leeking Javascript-style flexibility bhi milti hai. 

    ```
## Basic Types :-
  - Basic types mtlab woh common types jo variables ko assign ho sakte hain, jaisa text ,number, true/false, array etc. examples :-- 
  ```
  let name : string  = 'Raj';
  let age : number = 26;
  let isActive : boolean = true;
  let scores : number[] = [100 , 99 , 98] 
  ```
  ##### Kuch or details.
  - string, number, boolean ye sab primitive types hain.
  - Arrays bhi type specify kar sakte ho: string[] , Array<number> etc.

## Interface :-
  - Interface ek structure define krta hai -- object ka shape , yani us object ke andar kaunsa property hoga aur uska type kya hoga.
  ```
    interface User {
      id : number;
      name : string;
      isAdmin? : boolean; // optinal property.
    }

    const userData : User = {
      id : 1,
      name : "Raj"
      isAdmin : true // this one is the optinal propery. so ye object me ho bhi sakti hai ya nahi.
    }
    
  ```
    ##### Kuch or details
    - Interface se team code me consistency banata hai -- mtlb sab objects es define shape follow karenge.
    - Interface me function bhi define keye ja sakte hain : method signature define kar sakte ho examples.
      ```
        <!-- Interface me hum sirf properties ka type nahi define ni krte hai balki functions (methods) bhi deine kar sakte hain, jisme hum specify karte hain: function ka naam , uske parameters ka type , aur return type. ye type checking me kam aata hai. Niche mane es example bhi deya hai.
        -->
        
        interface Person {
          name : string; 
          age : number;
          speak(phrase : string) :void; // method signature.
          spend(amount : number) : number // method signature.
        }
        // Yaha pr speak and spend method signature hain --- propery nahi , balki functions ki types hai.

      🧠 Kyu useful hai? :- 
        - Interface se hum define hum ye define kar dete hai ki agar koi object ya class interface ko use kree ga to , usme ye methods and properties honge aur unke typesye honge. Isse code me consistency aati hai.
        
        - Agar interface me method signature mismatched ho -- ya object us method ko implement na kare -- to compile-time me error milega, jo runtime pe bug aane se pahel pakad leta hai.

        - Interview me bol sakte ho ki "Interface me method signature dene se code ka contract clear hota hai , jisse team me code maintain karna easier ho jata hai."

        -- Niche mane ache se example ki sath bataya hai.

        interface Person {
          name : string;
          age : number;
          speak(phrase : string) : void;
          spend(amount : number) : number;
        } 

        const userData : Person = {
          name : "Raj",
          age 25,
          speak(phrase : string) : void {
            console.log(`${this.name} says: ${phrase}`);
          },
          spend(amount : number) : number{
            console.log(`${this.name} spent ${amount}`);
            return amount;
          }
        };

        Yaha pr userData object ko type Person deya hai , and compiler check karega ki name , age , speak , spend sab correctly define hai. Agar spend return type void hota ya paramente type galat hota -- error milega

      ```
    ##### Kuch additional Notes :-
     - Method signature me parameter names important nahi hote type-checking ki liey - lekin parameter types aur retrun type important hote hain.

     - Interface me call signature bhi ho sakte hain -- yani interface khud ek function type define kare:
     ```
     interface SearchFunc{
      (source : string , subString : string) : boolean;
     }

     let mySearch : SearchFunc = function(src : string , sub : string) {return src.includes(sub);};
     ```    

## Type (type alias) :- 
  - ```type``` keyword se hum ek alias bana sakte hain kisi type ki leye, ya ek new type define kar sakte hain object-shape, union, intersection tuples ke leye.
  ##### Interview me bol sakte ho:
  “type alias se hum ek naam de sakte hain kisi type signature ko, ya complex types bana sakte hain (union, tuple etc), jisse code readable aur reusable hota hai.”
  ```
  type User = {
    name : string;
    age : number;
  }

  type ID = string | number; // union
  type Point = [number , number]; // tuple

  - Yahan User ek alias hai object shape ka, ID ek union type hai (string ya number), Point ek tuple hai.
  
  - Type aliases flexible hain — primitive, union, intersection, tuple, function types, sab ke saath use ho sakte hain.
  
  <!-- tuple ki case me yaha pr hum ke bata rahe hai ki dono elements number honge , tuple me app har element ka type sepecify krte ho. -->
  ```
  
  ### Difference between type and interface :-
### Difference between `type` and `interface`

| Feature                                    | interface                                                                 | type                                                                        |
|--------------------------------------------|---------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| Object shape define karna                  | Haan — object ka shape define kar sakte hai                               | Haan — object ka shape bhi define kar sakte hai                             |
| Union / Intersection types                  | Interface se direct unions ka use thoda limited hai (object‐shape ke alawa) | Fully support karta hai — union `|`, intersection `&` dono use ho sakte hain |
| Declaration merging                         | Haan — same interface naam se multiple definitions merge ho sakte hain     | Nahi — type alias merge nahi hoti                                           |
| Use for primitives, tuples, advanced types | Thoda limited                                                              | Bahut flexible — primitives, tuples, mapped types etc support karta hai     |

##### Short summary for interview :
  “Interface aur type alias dono object shapes ko define kar sakte hain, lekin type alias zyada flexible hai (unions, tuples, primitives) aur interface deep object-oriented style me achha hai jahan inheritance/merging chahiye.”

## Generics
 - Generics woh feature hai jisse hum functions, classes ya interfaces ko “type parameter” dene layak bana sakte hain, jisse woh multiple types ke saath kaam kar sakte hain — bina type safety khoe. 
 - Simple tarike se: “agar mujhe function banaana hai jo kisi bhi type ka input le sakta hai, aur usi type ka output dega” — uske liye generics use karte hain.

 ```
  function identity<T>(arg: T): T {
    return arg;
  }
  let output1 = identity<string>("hello");  // arg aur return dono string
  let output2 = identity<number>(123);      // arg aur return dono number

 ```
 Yahan <T> ek type-parameter hai, placeholder hai type ke liye.

 ### Kyu Use Karte Hain? 
 - Reusable code banane ke liye: Agar tum har type ke liye alag function likhoge — bahut duplication hogi.  Generics se ek hi function ya class, multiple types ke saath kaam karegi. 

 - Type safety maintain rakhte hue: any use karne se type safety km ho jaati hai. Generics se tum specify kar sakte ho ki output ka type input type ke saath match karega.

 #### Kaise Use Karte Hain? (Examples)
 ##### 1. Generic Function.
 ```
  function getArray<T>(items: T[]): T[] {
    return items;
  }
  const numArr = getArray<number>([1,2,3]);      // type inferred as number[]
  const strArr = getArray<string>(["a", "b"]);   // type inferred as string[]

 ```
 ##### 2. Generic Interface / Type Alias.
 ```
  interface Box<T> {
    value: T;
  }
  const box1: Box<number> = { value: 100 };
  const box2: Box<string> = { value: "hello" };

 ```
 ##### 3. Generic Class.
 ```
  class DataHolder<T> {
    private data: T;
    constructor(value: T) {
      this.data = value;
    }
    getData(): T {
      return this.data;
    }
  }
  const dh1 = new DataHolder<number>(123);
  const dh2 = new DataHolder<string>("Suraj");
  console.log(dh1.getData());  // number
  console.log(dh2.getData());  // string

 ```

 ##### 4. Generic Constraints — kab constrain karna padta hai.
 ```
  interface HasLength {
    length: number;
  }

  function logLength<T extends HasLength>(item: T): T {
    console.log(item.length);
    return item;
  }

  logLength("hello");           // valid (string has length)
  logLength([1,2,3]);           // valid (array has length)
  // logLength(123);            // ❌ Error: number doesn’t have length property

 ```

 #### Interview ke liye Key-Points

 1. Generics ka syntax samjho: function fn<T>(arg: T): T { … }

 2. Default inference: Agar <T> specify na karein ho, TypeScript khud infer karega type. 

 3. Constraint ka concept: T extends … se specify kar sakte ho ki generic type me kuch specific property ya structure required ho.

 4. Generic ka use cases: reusable collections (arrays, stacks), utility functions, APIs jahan input/output type variable ho.

 5. Over-use na karo: Agar function ya class sirf ek specific type ke saath hi use hoga, to generics ki zarurat kam ho sakti hai — simplicity better hai.