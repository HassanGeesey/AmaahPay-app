import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext';

export default function CustomersScreen() {
  const { customers, settings, addCustomer, t, formatCurrency } = useShop();
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

  // Calculate total deposit and credit for all customers
  const totalDeposit = customers.reduce((sum, c) => sum + c.deposit, 0);
  const totalCredit = customers.reduce((sum, c) => sum + c.credit, 0);

  return (
    <div className="max-w-lg mx-auto lg:max-w-none px-4 pb-8">
      {/* Summary Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center py-3 rounded-xl" style={{ background: 'rgba(5,150,105,0.08)' }}>
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-success)' }}>Total Deposit</p>
          <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--color-success)' }}>
            {formatCurrency(totalDeposit)}
          </p>
        </div>
        <div className="text-center py-3 rounded-xl" style={{ background: 'rgba(217,119,6,0.08)' }}>
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-warning)' }}>Total Credit</p>
          <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--color-warning)' }}>
            {formatCurrency(totalCredit)}
          </p>
        </div>
        <div className="text-center py-3 rounded-xl" style={{ background: 'var(--color-bg-subtle)' }}>
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Customers</p>
          <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--color-text)' }}>
            {customers.length}
          </p>
        </div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          {t.people}
        </h1>
        <button 
          onClick={() => setIsAdding(true)} 
          className="btn-primary px-5 py-2.5 rounded-xl font-medium text-sm"
        >
          {t.addPerson}
        </button>
      </header>
      
      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center" style={{ color: 'var(--color-text-muted)' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          type="text" 
          id="customer-search"
          name="customer-search"
          placeholder={t.search} 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="input-field w-full pl-12 pr-4 py-3.5 rounded-xl lg:py-4"
        />
      </div>
      
      {/* Customer Grid */}
      <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
        {filtered.map((c, index) => {
          const netBalance = c.deposit - c.credit
          return (
            <div 
              key={c.id} 
              onClick={() => navigate(`/customer/${c.id}`)} 
              className="card-elevated rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ 
                animation: 'fadeInUp 0.4s ease forwards',
                animationDelay: `${index * 50}ms`,
                opacity: 0
              }}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-semibold text-lg shadow-md flex-shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                
                {/* Info & Balances */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold truncate" style={{ color: 'var(--color-text)' }}>{c.name}</div>
                      <div className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>{c.phone}</div>
                    </div>
                    {/* Net Balance Badge */}
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      netBalance >= 0 
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
                    }`}>
                      {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
                    </div>
                  </div>
                  
                  {/* Balance Bars */}
                  <div className="mt-3 space-y-2">
                    {/* Deposit */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-subtle)' }}>
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: c.deposit > 0 ? `${Math.min(100, (c.deposit / Math.max(totalDeposit, 1)) * 100)}%` : '0%',
                            background: 'var(--color-success)'
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: 'var(--color-success)' }}>
                        D: {formatCurrency(c.deposit)}
                      </span>
                    </div>
                    {/* Credit */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-subtle)' }}>
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: c.credit > 0 ? `${Math.min(100, (c.credit / Math.max(totalCredit, 1)) * 100)}%` : '0%',
                            background: 'var(--color-warning)'
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: 'var(--color-warning)' }}>
                        C: {formatCurrency(c.credit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        
        {filtered.length === 0 && (
          <div className="lg:col-span-2 text-center py-16">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-bg-subtle)' }}>
              <svg className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p style={{ color: 'var(--color-text-secondary)' }}>{t.empty}</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-4 btn-primary px-6 py-2.5 rounded-xl font-medium"
            >
              {t.addPerson}
            </button>
          </div>
        )}
      </div>
      
      {/* Add Customer Modal */}
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div 
            className="card-elevated w-full max-w-sm rounded-3xl p-6 animate-scale-in lg:max-w-md"
            style={{ background: 'var(--color-surface)' }}
          >
            <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              {t.addPerson}
            </h2>
            
            {error && (
              <div className="mb-4 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
                <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>{t.name}</label>
                <input 
                  type="text" 
                  id="customer-name"
                  name="customer-name"
                  placeholder={t.name} 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                  className="input-field w-full px-4 py-3.5 rounded-xl" 
                  required 
                  disabled={loading} 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>{t.phone}</label>
                <input 
                  type="tel" 
                  id="customer-phone"
                  name="customer-phone"
                  placeholder={t.phone} 
                  value={newPhone} 
                  onChange={e => setNewPhone(e.target.value)} 
                  className="input-field w-full px-4 py-3.5 rounded-xl" 
                  required 
                  disabled={loading} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2" style={{ color: 'var(--color-success)' }}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {t.deposit}
                  </label>
                  <input 
                    type="number" 
                    id="customer-deposit"
                    name="customer-deposit"
                    value={initialDeposit} 
                    onChange={e => setInitialDeposit(e.target.value)} 
                    className="input-field w-full px-4 py-3.5 rounded-xl" 
                    disabled={loading} 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2" style={{ color: 'var(--color-warning)' }}>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {t.credit}
                  </label>
                  <input 
                    type="number" 
                    id="customer-credit"
                    name="customer-credit"
                    value={initialCredit} 
                    onChange={e => setInitialCredit(e.target.value)} 
                    className="input-field w-full px-4 py-3.5 rounded-xl" 
                    disabled={loading} 
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setIsAdding(false); setError(null); }} 
                  className="flex-1 py-3.5 rounded-xl font-medium transition-all hover:brightness-95"
                  style={{ 
                    background: 'var(--color-bg-subtle)', 
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)'
                  }}
                  disabled={loading}
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit" 
                  className="flex-1 btn-primary py-3.5 rounded-xl font-medium"
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
