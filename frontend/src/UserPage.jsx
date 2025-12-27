import { useState, useEffect } from 'react';
import { Coffee, ShoppingBag } from 'lucide-react';

const UserPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('https://coffee-1-koav.onrender.comproducts')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    return (
        <div>
            <div className="hero-text">
                <h1>Premium Coffee Experience</h1>
                <p style={{color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem'}}>
                    Hand-crafted blends for the perfect moment.
                </p>
            </div>

            <div className="grid">
                {products.map(product => (
                    <div key={product.id} className="glass-card" style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{height: '200px', overflow: 'hidden', borderRadius: '0.5rem', marginBottom: '1rem'}}>
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s'}}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            />
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                            <h3 style={{margin: 0, fontSize: '1.25rem'}}>{product.name}</h3>
                            <span style={{color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem'}}>${product.price.toFixed(2)}</span>
                        </div>
                        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1}}>{product.description}</p>
                        <button className="btn btn-primary" style={{width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}>
                            <ShoppingBag size={18} /> Order Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserPage;
