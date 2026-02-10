import React, { useState } from 'react';
import { useShop } from '../contexts/ShopContext';

export default function ProductsScreen() {
  const { products, settings, addProduct, updateProduct, t } = useShop();
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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-6 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">{t.items}</h1>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setName(''); setPrice(''); }} className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            {t.addProduct}
          </button>
        </header>
        <div className="grid grid-cols-1 gap-3">
          {products.map(p => (
            <div key={p.id} className="bg-white dark:bg-stone-900 p-5 rounded-lg border border-stone-200 dark:border-stone-800 flex justify-between items-center group">
              <div><div className="font-medium text-stone-900 dark:text-stone-50 text-lg">{p.name}</div><div className="text-sm text-stone-500 dark:text-stone-400 dark:text-stone-500">{settings.currencySymbol} {p.unitPrice.toLocaleString()} / {t.qty}</div><div className="mt-2 text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-wide">{t.sold}: {p.totalSold}</div></div>
              <button onClick={() => startEdit(p)} className="p-3 text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
            </div>
          ))}
          {products.length === 0 && <div className="text-center py-24 text-stone-400 dark:text-stone-500 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">{t.empty}</div>}
        </div>
      </div>
      {isAdding && (
        <div
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setIsAdding(false)}
        >
          <div
            className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-lg p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-medium mb-4">{editingId ? t.save : t.addProduct}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-xs font-medium text-stone-500 dark:text-stone-400 dark:text-stone-500 uppercase mb-1 block tracking-wide">{t.name}</label><input type="text" id="product-name" name="product-name" placeholder={t.name} value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-stone-400 outline-none" required /></div>
              <div><label className="text-xs font-medium text-stone-500 dark:text-stone-400 dark:text-stone-500 uppercase mb-1 block tracking-wide">{t.price}</label><div className="relative"><span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400 dark:text-stone-500">{settings.currencySymbol}</span><input type="number" min="0" step="0.01" id="product-price" name="product-price" placeholder={t.price} value={price} onChange={e => setPrice(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-stone-400 outline-none" required /></div></div>
              <div className="flex gap-3 pt-2"><button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 font-medium">{t.cancel}</button><button type="submit" className="flex-1 px-4 py-3 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium">{t.save}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
