const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory data store
let products = [
    { id: 1, name: 'Espresso', price: 3.50, description: 'Strong and bold coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=2670&auto=format&fit=crop' },
    { id: 2, name: 'Cappuccino', price: 4.50, description: 'Espresso with steamed milk and foam', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=2735&auto=format&fit=crop' },
    { id: 3, name: 'Latte', price: 4.00, description: 'Creamy espresso drink', image: 'https://vaya.in/recipes/wp-content/uploads/2018/05/Coffee.jpg' }
];

// Auth middleware
const verifyAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === 'admin-token') {
        next();
    } else {
        res.status(403).json({ message: 'Unauthorized' });
    }
};

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'Admin123') {
        res.json({ success: true, token: 'admin-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// User & Admin: Get Products
app.get('/products', (req, res) => {
    res.json(products);
});

// Admin: Add Product
app.post('/products', verifyAdmin, (req, res) => {
    const { name, price, description, image } = req.body;
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price: parseFloat(price),
        description,
        image: image || 'https://via.placeholder.com/150'
    };
    products.push(newProduct);
    res.json({ success: true, product: newProduct });
});

// Admin: Edit Product
app.put('/products/:id', verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { name, price, description, image } = req.body;
    const index = products.findIndex(p => p.id == id);
    if (index !== -1) {
        products[index] = { ...products[index], name, price: parseFloat(price), description, image };
        res.json({ success: true, product: products[index] });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Admin: Delete Product
app.delete('/products/:id', verifyAdmin, (req, res) => {
    const { id } = req.params;
    products = products.filter(p => p.id != id);
    res.json({ success: true, message: 'Deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
