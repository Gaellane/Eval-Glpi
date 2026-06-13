# Supprimer un element

```js 
const fruits = ["Banana", "Orange", "Apple", "Mango"];
delete fruits[0];

```

# Concatener 
```js

const myGirls = ["Cecilie", "Lone"];
const myBoys = ["Emil", "Tobias", "Linus"];

const myChildren = myGirls.concat(myBoys);

const arr1 = ["Cecilie", "Lone"];
const arr2 = ["Emil", "Tobias", "Linus"];
const arr3 = ["Robin", "Morgan"];
const myChildren = arr1.concat(arr2, arr3);

const arr1 = ["Emil", "Tobias", "Linus"];
const myChildren = arr1.concat("Peter"); 


const myArr = [[1,2],[3,4],[5,6]];
const newArr = myArr.flat();

const myArr = [1, 2, 3, 4, 5, 6];
const newArr = myArr.flatMap(x => [x, x * 10]); 

```

# Copying element an index to another
```js
const fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.copyWithin(2, 0);
["Banana", "Orange", "Banana", "Mango"]

```

# Splice (Suppression et remplacement d'element)

```js 
const fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.splice(2, 0, "Lemon", "Kiwi");
["Banana", "Orange", "Lemon", "Kiwi" , "Apple" , "Mango"]

const fruits = ["Banana", "Orange", "Apple", "Mango"];
document.getElementById("demo1").innerHTML = "Original Array:<br> " + fruits;
let removed = fruits.splice(2, 2, "Lemon", "Kiwi"); 
document.getElementById("demo2").innerHTML = "New Array:<br>" + fruits;
document.getElementById("demo3").innerHTML = "Removed Items:<br> " + removed; 

const fruits = ["Banana", "Orange", "Apple", "Mango"];
document.getElementById("demo1").innerHTML = fruits;
fruits.splice(0, 1);
document.getElementById("demo2").innerHTML = fruits;
[ "Orange", "Apple", "Mango"]

```
# Splice avec possibilite de garder le array original 

```js 
const months = ["Jan", "Feb", "Mar", "Apr"];
const spliced = months.toSpliced(0, 1);

const fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
const citrus = fruits.slice(1);

["Orange", "Lemon", "Apple", "Mango"]

const fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
const citrus = fruits.slice(1,3);
document.getElementById("demo").innerHTML = fruits + "<br><br>" + citrus;
["Orange", "Lemon"]

```

# get element at an index
```js
const fruits = ["Banana", "Orange", "Apple", "Mango"];
let fruit = fruits.at(2);

```

## SEARCHING 

# 1- Position

```js 

const fruits = ["Apple", "Orange", "Apple", "Mango"];
let position = fruits.indexOf("Apple") + 1;

array.indexOf(item, start)
```
# Last position 
```js
const fruits = ["Apple", "Orange", "Apple", "Mango"];
let position = fruits.lastIndexOf("Apple") + 1;
```

# 2- Find

```js 
const numbers = [4, 9, 16, 25, 29];
let first = numbers.find(myFunction);

function myFunction(value, index, array) {
  return value > 18;
}

const numbers = [4, 9, 16, 25, 29];
let first = numbers.findIndex(myFunction);

function myFunction(value, index, array) {
  return value > 18;
}

const temp = [27, 28, 30, 40, 42, 35, 30];
let high = temp.findLast(x => x > 40);


const temp = [27, 28, 30, 40, 42, 35, 30];
let pos = temp.findLastIndex(x => x > 40);
```


## SORT

# 1-   Alphabetique

```js
const fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.sort();

```

# 2- Reverse

```js 
const fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.reverse();
```

# 3 - Numweic sort
```js
const points = [40, 100, 1, 5, 25, 10];
points.sort(function(a, b){return a - b});

const points = [40, 100, 1, 5, 25, 10];
points.sort(function(a, b){return b - a});

```