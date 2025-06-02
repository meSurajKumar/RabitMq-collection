const a = {name : '3' , g :4 , data : {'user' : 'pp' , 'number' : 4}}

// const b = {...a} // shallow copy

// // const b = {name : '4' , g : 6}

// b.name = 'ii'

// b.data.user = 'changed'

// // console.log(b.name)
// // console.log(a == b)
// console.log('a',a)
// console.log('b',b)

// const b = structuredClone(a) // deep copy

const c = JSON.stringify(a)
const b = JSON.parse(c)

b.name = 'ii'

b.data.user = 'changed'

console.log('a',a)
console.log('b',b)