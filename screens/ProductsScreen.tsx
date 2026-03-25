import React, { useState } from 'react';
import { useShop } from '../contexts/ShopContext';

export default function ProductsScreen() {
  const { products, settings, addProduct, updateProduct, t, formatCurrency } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && price) {
      if (editingId) updateProduct(editingId, { name, unitPrice: parseFloat(price) }); else addProduct(name, parseFloat(price));
      setIsAdding(false); setEditingId(null); setName(''); setPrice('');
    }
  };
  const startEdit = (p: { id: string; name: string; unitPrice: number }) => { setEditingId(p.id); setName(p.name); setPrice(p.unitPrice.toString()); setIsAdding(true); };

  return (
    <div className="min-h-screen p-6 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              {t.items}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {products.length} products in catalog
            </p>
          </div>
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setName(''); setPrice(''); }} 
            className="btn-primary px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            {t.addProduct}
          </button>
        </header>
        
        <div className="grid grid-cols-1 gap-3">
          {products.map((p, index) => (
            <div 
              key={p.id} 
              className="card-elevated rounded-2xl p-5 flex justify-between items-center group transition-all hover:shadow-lg"
              style={{ 
                animation: 'fadeInUp 0.4s ease forwards',
                animationDelay: `${index * 50}ms`,
                opacity: 0
              }}
            >
              <div>
                <div className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>{p.name}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {settings.currencySymbol} {p.unitPrice.toLocaleString()} / {t.qty}
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  {t.sold}: {p.totalSold}
                </div>
              </div>
              <button 
                onClick={() => startEdit(p)} 
                className="p-3 rounded-xl transition-all hover:brightness-95"
                style={{ background: 'var(--color-bg-subtle)', color: 'var(--color-text-secondary)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-16 card-elevated rounded-2xl">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-bg-subtle)' }}>
                <svg className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }}>{t.empty}</p>
              <button 
                onClick={() => { setIsAdding(true); setEditingId(null); setName(''); setPrice(''); }}
                className="mt-4 btn-primary px-6 py-2.5 rounded-xl font-medium"
              >
                {t.addProduct}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {isAdding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsAdding(false)}
        >
          <div
            className="card-elevated w-full max-w-sm rounded-3xl p-6 animate-scale-in"
            style={{ background: 'var(--color-surface)' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              {editingId ? t.save : t.addProduct}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>{t.name}</label>
                <input 
                  type="text" 
                  id="product-name" 
                  name="product-name"
                  placeholder={t.name} 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="input-field w-full px-4 py-3.5 rounded-xl" 
                  required 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>{t.price}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center" style={{ color: 'var(--color-text-muted)' }}>
                    {settings.currencySymbol}
                  </span>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    id="product-price" 
                    name="product-price"
                    placeholder={t.price} 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    className="input-field w-full pl-12 pr-4 py-3.5 rounded-xl" 
                    required 
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)} 
                  className="flex-1 py-3.5 rounded-xl font-medium transition-all hover:brightness-95"
                  style={{ 
                    background: 'var(--color-bg-subtle)', 
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit" 
                  className="flex-1 btn-primary py-3.5 rounded-xl font-medium"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
