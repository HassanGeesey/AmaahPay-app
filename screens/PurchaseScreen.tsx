import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext';
import { TransactionItem } from '../types';

interface CartItem extends TransactionItem {
  isCashOut?: boolean;
}

export default function PurchaseScreen() {
  const { state: routeState } = useLocation();
  const navigate = useNavigate();
  const { customers, products, settings, addCustomer, addProduct, processPurchase, t } = useShop();

  const [selectedCustomerId, setSelectedCustomerId] = useState(routeState?.customerId || '');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [productSearchFocused, setProductSearchFocused] = useState(false);
  const [notes, setNotes] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustDeposit, setNewCustDeposit] = useState('0');
  const [newCustCredit, setNewCustCredit] = useState('0');
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const total = cart.reduce((acc, item) => acc + item.total, 0);

  const addProductToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId && !i.isCashOut);
      if (existing) {
        const newQty = existing.quantity + 1;
        return prev.map(i => i.productId === productId ? { ...i, quantity: newQty, total: newQty * i.unitPrice } : i);
      }
      return [...prev, { productId: product.id, productName: product.name, quantity: 1, unitPrice: product.unitPrice, total: product.unitPrice, isCashOut: false }];
    });
    setSearchProduct('');
  };

  const addCashOutToCart = () => {
    const cashOutItem: CartItem = {
      productId: 'cash_out',
      productName: 'Cash Out',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      isCashOut: true
    };
    setCart(prev => {
      const existing = prev.find(i => i.isCashOut);
      if (existing) return prev;
      return [...prev, cashOutItem];
    });
  };

  const removeItemFromCart = (productId: string) => setCart(prev => prev.filter(i => i.productId !== productId));
  
  const updateQuantity = (productId: string, q: number) => {
    if (q <= 0) return removeItemFromCart(productId);
    setCart(prev => prev.map(i => {
      if (i.productId === productId) {
        return { ...i, quantity: q, total: q * i.unitPrice };
      }
      return i;
    }));
  };

  const updateUnitPrice = (productId: string, priceStr: string) => {
    const p = parseFloat(priceStr) || 0;
    setCart(prev => prev.map(i => {
      if (i.productId === productId) {
        return { ...i, unitPrice: p, total: i.quantity * p };
      }
      return i;
    }));
  };

  const handleConfirm = () => {
    if (!selectedCustomerId || cart.length === 0) return;
    processPurchase(selectedCustomerId, cart, notes);
    navigate(`/customer/${selectedCustomerId}`);
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustName && newCustPhone) {
      const c = addCustomer(newCustName, newCustPhone, parseFloat(newCustDeposit) || 0, parseFloat(newCustCredit) || 0);
      setSelectedCustomerId(c.id);
      setShowAddCustomer(false);
      setNewCustName(''); setNewCustPhone(''); setNewCustDeposit('0'); setNewCustCredit('0');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProdName && newProdPrice) {
      const p = addProduct(newProdName, parseFloat(newProdPrice));
      if (p) { addProductToCart(p.id); setSearchProduct(''); }
      setShowAddProduct(false);
      setNewProdName(''); setNewProdPrice('');
    }
  };

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase()))
    .slice(0, 8);
  const showProductDropdown = (productSearchFocused || searchProduct) && products.length > 0;
  const cashOutItem = cart.find(i => i.isCashOut);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="p-6 max-w-lg mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:text-stone-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">{t.newBuy}</h1>
        </header>

        <select
          id="purchase-customer"
          name="purchase-customer"
          value={selectedCustomerId}
          onChange={e => setSelectedCustomerId(e.target.value)}
          className="w-full p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 mb-4"
        >
          <option value="">-- {t.choosePerson} --</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
        </select>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setShowAddCustomer(true)}
            className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t.addPerson}
          </button>
          <button
            onClick={addCashOutToCart}
            disabled={!!cashOutItem}
            className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cash Out
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            id="product-search"
            name="product-search"
            placeholder={t.typeItem}
            value={searchProduct}
            onChange={e => setSearchProduct(e.target.value)}
            onFocus={() => setProductSearchFocused(true)}
            onBlur={() => setTimeout(() => setProductSearchFocused(false), 200)}
            className="w-full p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50"
          />
          {showProductDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-sm z-20 mt-1 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden max-h-56 overflow-y-auto">
              {filteredProducts.map(p => (
                <div key={p.id} onClick={() => addProductToCart(p.id)} className="p-3 hover:bg-stone-50 dark:hover:bg-stone-800 dark:bg-stone-950 cursor-pointer flex justify-between items-center">
                  <span className="font-medium text-stone-700 dark:text-stone-300">{p.name}</span>
                  <span className="text-stone-900 dark:text-stone-50 font-semibold text-sm">{settings.currencySymbol} {p.unitPrice}</span>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="p-4 text-stone-400 dark:text-stone-500 italic text-center text-xs">{searchProduct ? t.noMatch : t.empty}</div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3 mb-4">
          {cart.map(item => (
            <div key={item.productId} className="bg-white dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  <span className="font-semibold text-stone-900 dark:text-stone-50">{item.productName}</span>
                </div>
                <button onClick={() => removeItemFromCart(item.productId)} className="text-stone-300 hover:text-stone-600 dark:text-stone-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {item.isCashOut ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-stone-500 dark:text-stone-400 dark:text-stone-500">Numbers</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-stone-200 dark:border-stone-800 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 dark:text-stone-400 dark:text-stone-500">Amount per number</label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={e => updateUnitPrice(item.productId, e.target.value)}
                      className="w-full p-2 border border-stone-200 dark:border-stone-800 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-stone-500 dark:text-stone-400 dark:text-stone-500">Total</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-50">{settings.currencySymbol} {item.total.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-3 py-1 bg-stone-50 dark:bg-stone-950 text-stone-600 dark:text-stone-400">-</button>
                    <span className="px-4 py-1 text-sm font-semibold min-w-[32px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1 bg-stone-50 dark:bg-stone-950 text-stone-600 dark:text-stone-400">+</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={e => updateUnitPrice(item.productId, e.target.value)}
                      className="w-20 p-1 border border-stone-200 dark:border-stone-800 rounded text-sm text-right"
                    />
                    <span className="font-semibold text-stone-900 dark:text-stone-50">{settings.currencySymbol} {item.total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {cart.length === 0 && (
            <div className="py-8 text-center text-stone-400 dark:text-stone-500 italic border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-lg text-sm">
              {t.empty}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="space-y-4">
            <textarea
              id="purchase-notes"
              name="purchase-notes"
              placeholder={t.notes}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900"
              rows={2}
            />
            <div className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 p-5 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-400 dark:text-stone-500">{t.total}</span>
                <span className="text-2xl font-bold">{settings.currencySymbol} {total.toLocaleString()}</span>
              </div>
              {selectedCustomer && (
                <div className="pt-3 space-y-1 text-xs border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-stone-400 dark:text-stone-500">{t.name}:</span>
                    <span>{selectedCustomer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 dark:text-stone-500">{t.deposit}:</span>
                    <span>{settings.currencySymbol} {selectedCustomer.deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 dark:text-stone-500">{t.credit}:</span>
                    <span>{settings.currencySymbol} {selectedCustomer.credit.toLocaleString()}</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleConfirm}
                disabled={!selectedCustomerId}
                className="w-full py-3 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 disabled:bg-stone-700 disabled:opacity-40 font-semibold rounded-lg"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        )}

        {showAddCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-lg p-5">
              <h2 className="text-lg font-semibold mb-4">{t.addPerson}</h2>
              <form onSubmit={handleAddCustomer} className="space-y-3">
                <input type="text" id="new-customer-name" name="new-customer-name" placeholder={t.name} value={newCustName} onChange={e => setNewCustName(e.target.value)} className="w-full p-3 rounded-lg border border-stone-200 dark:border-stone-800" required />
                <input type="tel" id="new-customer-phone" name="new-customer-phone" placeholder={t.phone} value={newCustPhone} onChange={e => setNewCustPhone(e.target.value)} className="w-full p-3 rounded-lg border border-stone-200 dark:border-stone-800" required />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-stone-500 dark:text-stone-400 dark:text-stone-500 block mb-1">{t.deposit}</label>
                    <input type="number" id="new-customer-deposit" name="new-customer-deposit" value={newCustDeposit} onChange={e => setNewCustDeposit(e.target.value)} className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-800" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 dark:text-stone-400 dark:text-stone-500 block mb-1">{t.credit}</label>
                    <input type="number" id="new-customer-credit" name="new-customer-credit" value={newCustCredit} onChange={e => setNewCustCredit(e.target.value)} className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-800" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddCustomer(false)} className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-medium">{t.cancel}</button>
                  <button type="submit" className="p-3 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium">{t.save}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
