const express = require('express');
const router = express.Router();



router.get('/', (req, res) => {
res.render('index');})


router.get('/about', (req, res) => {
    res.render('about');
})



/* //
const miFuncion1 = function(){
    return 'hello, world';
}

const miFuncion2 = function(products,tax){ 
    let total = 0;
    for (let i=0; i<products.length; i++){
        total += products[i] + products[i] * tax;
    }
    return total;
}

//converting into arrow functions
const miArrow1 = () =>'hello,world';

//calls
const result = miArrow1();
console.log(result);

console.log(miArrow1())



const miArrow2 = (products,tax) => {
    let total = 0;
    for (let i=0; i<products.length; i++){
        total += products[i] + products[i] * tax;
        //equals like 
        total = total + (products[i] + products[i]*tax;)
    }
    return total;
} */

module.exports = router;




