import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, LogOut, Save, X } from 'lucide-react';

const AdminPage = () => {
    const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [products, setProducts] = useState([]);
    
    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ name: '', price: '', description: '', image: '' });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (token) fetchProducts();
    }, [token]);

    const handleLogin = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setToken(data.token);
                localStorage.setItem('adminToken', data.token);
            } else {
                alert('Invalid Credentials');
            }
        });
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('adminToken');
    };

    const fetchProducts = () => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(`http://localhost:5000/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            }).then(() => fetchProducts());
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `http://localhost:5000/products/${currentProduct.id}` : 'http://localhost:5000/products';

        fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify(currentProduct)
        })
        .then(res => res.json())
        .then(() => {
            setShowModal(false);
            fetchProducts();
            setCurrentProduct({ name: '', price: '', description: '', image: '' });
        });
    };

    const openAdd = () => {
        setIsEditing(false);
        setCurrentProduct({ name: '', price: '', description: '', image: '' });
        setShowModal(true);
    };

    const openEdit = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
        setShowModal(true);
    };

    if (!token) {
        return (
            <div style={{maxWidth: '400px', margin: '100px auto'}} className="glass-card">
                <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input 
                        className="input-field" 
                        type="text" 
                        placeholder="Username (admin)" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                    />
                    <input 
                        className="input-field" 
                        type="password" 
                        placeholder="Password (Admin123)" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                    />
                    <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Login</button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <h1>Dashboard</h1>
                <div style={{display: 'flex', gap: '1rem'}}>
                    <button className="btn btn-primary" onClick={openAdd} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <Plus size={18} /> Add Product
                    </button>
                    <button className="btn btn-danger" onClick={handleLogout} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <div className="grid">
                {products.map(p => (
                    <div key={p.id} className="glass-card" style={{position: 'relative'}}>
                        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                            <img src={p.image} alt={p.name} style={{width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'cover'}} />
                            <div>
                                <h3 style={{margin: '0 0 0.5rem 0'}}>{p.name}</h3>
                                <p style={{margin: 0, color: 'var(--primary)', fontWeight: 'bold'}}>${p.price}</p>
                            </div>
                        </div>
                        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem'}}>{p.description}</p>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                            <button className="btn" style={{background: 'rgba(255,255,255,0.1)', color: 'white', flex: 1}} onClick={() => openEdit(p)}>
                                <Edit2 size={16} /> Edit
                            </button>
                            <button className="btn btn-danger" style={{flex: 1}} onClick={() => handleDelete(p.id)}>
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="glass-card" style={{width: '90%', maxWidth: '500px', background: '#1e293b'}} onClick={e => e.stopPropagation()}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                            <h2 style={{margin: 0}}>{isEditing ? 'Edit Product' : 'Add Product'}</h2>
                            <button className="btn" onClick={() => setShowModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleSave}>
                            <input className="input-field" placeholder="Product Name" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} required />
                            <input className="input-field" type="number" step="0.01" placeholder="Price" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} required />
                            <textarea className="input-field" rows="3" placeholder="Description" value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} required />
                            <input className="input-field" placeholder="Image URL" value={currentProduct.image} onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} />
                            <button type="submit" className="btn btn-primary" style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}>
                                <Save size={18} /> Save Product
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
