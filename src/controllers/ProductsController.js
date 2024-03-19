const Product = require('../models/Product');

class ProductsController {
    async showAll(req, res, next) {
        const {search, category} = req.query;
        const products = await Product.find({
            title: new RegExp(search, 'i'),
            category: new RegExp(category, 'i')
        }).catch(err => console.error(err));
        const categories = await Product.distinct('category').catch(err => console.error(err));
        res.render('products/index', {
            products,
            user: req?.session?.user,
            selectedCategory: category,
            selectedSearch: search,
            categories});
    }

    async showDetails(req, res, next) {
        const product = await Product.findById(req.params.id).catch(err => console.error(err));
        res.render('products/detail', {product, user: req?.session?.user});
    }

    showAdd(req, res, next) {
        res.render('products/new', {user: req?.session?.user});
    }

    async showEdit(req, res, next) {
        const product = await Product.findById(req.params.id).catch(err => console.error(err));
        res.render('products/edit', {product, user: req?.session?.user});
    }

    async handleAdd(req, res, next) {
        const {title, description, price, image, category} = req.body;
        const product = new Product({
            title,
            description,
            price,
            image,
            category,
            rating: {
                rate: 0,
                count: 0
            }
        });
        await product.save().catch(err => console.error(err));
        res.redirect('/products');
    }

    async handleEdit(req, res, next) {
        console.log(req.body);
        await Product.findByIdAndUpdate(req.params.id, req.body).catch(err => console.error(err));
        res.redirect(`/products/${req.params.id}`);
    }

    async handleDelete(req, res, next) {
        await Product.findByIdAndDelete(req.params.id).catch(err => console.error(err));
        res.redirect('/products');
    }
}

module.exports = new ProductsController();