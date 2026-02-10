import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext';

export default function CustomersScreen() {
  const { customers, settings, addCustomer, t } = useShop();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('0');
  const [initialCredit, setInitialCredit] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await addCustomer(newName, newPhone, parseFloat(initialDeposit), parseFloat(initialCredit));
      setIsAdding(false);
      setNewName('');
      setNewPhone('');
      setInitialDeposit('0');
      setInitialCredit('0');
      } catch (err) {
        setError(t.addFailed || 'Failed to add customer. Please try again.');
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto lg:max-w-none px-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50 lg:text-2xl">{t.people}</h1>
        <button onClick={() => setIsAdding(true)} className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-4 py-2 rounded-lg text-sm font-medium lg:px-6">{t.addPerson}</button>
      </header>
      
      <div className="relative mb-4 lg:mb-6">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 dark:text-stone-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          type="text" 
          id="customer-search"
          name="customer-search"
          placeholder={t.search} 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 lg:py-4" 
        />
      </div>
      
      <div className="space-y-3 lg:space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {filtered.map(c => (
          <div 
            key={c.id} 
            onClick={() => navigate(`/customer/${c.id}`)} 
            className="bg-white dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800 flex justify-between items-center cursor-pointer hover:border-stone-300 lg:p-6"
          >
            <div>
              <div className="font-semibold text-stone-900 dark:text-stone-50">{c.name}</div>
              <div className="text-sm text-stone-500 dark:text-stone-400 dark:text-stone-500">{c.phone}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-400 dark:text-stone-500 uppercase font-medium mb-1 lg:text-xs">{t.money}</div>
              <span className="text-stone-900 dark:text-stone-50 font-semibold text-[10px] lg:text-sm">D: {settings.currencySymbol} {c.deposit}</span>
              <span className="text-stone-900 dark:text-stone-50 font-semibold text-[10px] ml-2 lg:text-sm">C: {settings.currencySymbol} {c.credit}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm lg:col-span-2">{t.empty}</div>}
      </div>
      
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-lg p-6 lg:max-w-md">
              <h2 className="text-lg font-semibold mb-4">{t.addPerson}</h2>
              {error && (
                <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-700 px-3 py-2 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-stone-500 dark:text-stone-400 dark:text-stone-500 mb-1 block">{t.name}</label>
                  <input 
                    type="text" 
                    id="customer-name"
                    name="customer-name"
                    placeholder={t.name} 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-50" 
                    required 
                    disabled={loading} 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-500 dark:text-stone-400 dark:text-stone-500 mb-1 block">{t.phone}</label>
                  <input 
                    type="tel" 
                    id="customer-phone"
                    name="customer-phone"
                    placeholder={t.phone} 
                    value={newPhone} 
                    onChange={e => setNewPhone(e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-50" 
                    required 
                    disabled={loading} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-500 dark:text-stone-400 dark:text-stone-500 mb-1 block">{t.deposit}</label>
                    <input 
                      type="number" 
                      id="customer-deposit"
                      name="customer-deposit"
                      value={initialDeposit} 
                      onChange={e => setInitialDeposit(e.target.value)} 
                      className="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800" 
                      disabled={loading} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-500 dark:text-stone-400 dark:text-stone-500 mb-1 block">{t.credit}</label>
                    <input 
                      type="number" 
                      id="customer-credit"
                      name="customer-credit"
                      value={initialCredit} 
                      onChange={e => setInitialCredit(e.target.value)} 
                      className="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800" 
                      disabled={loading} 
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => { setIsAdding(false); setError(null); }} 
                    className="flex-1 px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 font-medium disabled:opacity-40" 
                    disabled={loading}
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-4 py-3 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium disabled:opacity-40" 
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : t.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}
