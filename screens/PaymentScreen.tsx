import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext';

export default function PaymentScreen() {
  const { state: routeState } = useLocation();
  const navigate = useNavigate();
  const { customers, settings, addCustomer, processPayment, t } = useShop();

  const [selectedCustomerId, setSelectedCustomerId] = useState(routeState?.customerId || '');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustDeposit, setNewCustDeposit] = useState('0');
  const [newCustCredit, setNewCustCredit] = useState('0');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleConfirm = () => {
    if (!selectedCustomerId || !amount) return;
    processPayment(selectedCustomerId, parseFloat(amount), notes);
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

  return (
    <div className="p-6 space-y-6 max-w-lg mx-auto">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        <h1 className="text-2xl font-bold text-slate-900">{t.newPay}</h1>
      </header>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-400 uppercase">{t.choosePerson}</label>
          <button type="button" onClick={() => setShowAddCustomer(true)} className="text-indigo-600 text-xs font-semibold flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            {t.addPerson}
          </button>
        </div>
        <select value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none bg-white">
          <option value="">-- {t.choosePerson} --</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
        </select>
      </div>

      {selectedCustomer && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex justify-between items-center shadow-sm">
          <div><div className="text-[10px] font-bold text-emerald-600 uppercase">Credit</div><div className="text-xl font-bold text-emerald-800">{settings.currencySymbol} {selectedCustomer.credit.toLocaleString()}</div></div>
          <div className="text-right"><div className="text-[10px] font-bold text-emerald-600 uppercase">Deposit</div><div className="text-xl font-bold text-emerald-800">{settings.currencySymbol} {selectedCustomer.deposit.toLocaleString()}</div></div>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-400 uppercase">{t.money}</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold">{settings.currencySymbol}</span>
          <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-2xl font-bold shadow-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-400 uppercase">{t.notes}</label>
        <textarea placeholder={t.notes} value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" rows={3} />
      </div>

      <button onClick={handleConfirm} disabled={!selectedCustomerId || !amount} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 mt-4 text-lg">{t.confirm}</button>

      {showAddCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-4">{t.addPerson}</h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">{t.name}</label><input type="text" placeholder={t.name} value={newCustName} onChange={e => setNewCustName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required /></div>
              <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">{t.phone}</label><input type="tel" placeholder={t.phone} value={newCustPhone} onChange={e => setNewCustPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required /></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block">Deposit</label><input type="number" value={newCustDeposit} onChange={e => setNewCustDeposit(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200" /></div><div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block">Credit</label><input type="number" value={newCustCredit} onChange={e => setNewCustCredit(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200" /></div></div>
              <div className="flex gap-3 pt-2"><button type="button" onClick={() => setShowAddCustomer(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold">{t.cancel}</button><button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold">{t.save}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
