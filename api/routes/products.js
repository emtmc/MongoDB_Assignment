const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

//Handle incoming GET requests to /products
router.get('/', (req, res, next) => {
    //Returns all products
  Product.find()
  .exec()
  
  //Validation
  .then(docs =>{
    console.log(docs);
     res.status(200).json(docs);  
    })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      })
  })
});

//Handle incoming POST requests to /products
router.post('/', (req, res, next) => {
    //Creates a new product based on the schema created
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    //stores the product in the database
    product.save()
    //Validation
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Handling POST requests to /products',
            createdProduct: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

});

//Handle incoming GET requests to /products/id
router.get('/:productId', (req, res, next) => {
    //extract product id
    const id = req.params.productId;
    //Finds product based on the ID
    Product.findById(id)
    .exec()
    //Validation
    .then(doc => {
        console.log("From Database",doc);
        if(doc) {

        } else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
});
});

//Handle incoming PATCH requests to /products/id
router.patch('/:productId', (req, res, next) => {
    //Gets ID
    const id = req.params.productId;

    //update operations is setup so only one parameter can be updated if needs be.
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
        }

    //updates the product by setting the update ops to the id of the object.
    Product.update({_id: id}, {$set: updateOps})
    .exec()

    //Validation
    .then( result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

//Handle incoming DELETE requests to /products/id
router.delete('/:productId', (req, res, next) => {
    //Gets ID
    const id = req.params.productId;
    //Removes ID
    Product.remove({_id: id})
    .exec()

    //Validation
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

module.exports = router;