const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const methodOverride = require('method-override')

const Product = require('./models/product');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/farmStand');
    await console.log("MONGO CONNECTED!!!")
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// When someone submits a form on your site, the data they enter is encoded in a special way (URL-encoded). The express.urlencoded() function takes that encoded data and converts it into a format your app can understand and use.
app.use(express.urlencoded({ extended: true }));
// This allows method override to simulate PUT and DELETE requests via POST requests
app.use(methodOverride('_method'))


const categories = ['fruit', 'vegetable', 'dairy', 'herb and spice']

app.get('/products', async (req, res) => {
    const { category } = req.query;
    if(category) {
        const products = await Product.find({ category: category });
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
    }    
    
})
    
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async (req, res) => {
     const newProduct = new Product(req.body);
     await newProduct.save();
     console.log(newProduct);
     res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories })
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`)
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})



app.listen(3000, () => {
    console.log("App is listening on port 3000")
})

// choco milk 66206b447a3edf0c80675b27
// celery 66206b447a3edf0c80675b26
// watermelon 66206b447a3edf0c80675b25
// goddess melon 66206b447a3edf0c80675b24
// eggplant 66206b447a3edf0c80675b23