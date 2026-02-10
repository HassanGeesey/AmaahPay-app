import React from 'react';
import { useShop } from '../contexts/ShopContext';
import { useNavigate } from 'react-router-dom';

export default function StatisticsScreen() {
  const { customers, products, settings, t } = useShop();
  const navigate = useNavigate();
  const totalCredit = customers.reduce((a, c) => a + c.credit, 0);
  const totalDeposit = customers.reduce((a, c) => a + c.deposit, 0);
  const totalItemsSold = products.reduce((a, p) => a + p.totalSold, 0);

  return (
    <div className="p-6 space-y-8 max-w-lg mx-auto">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.stats}</h1>
          <p className="text-slate-500 text-sm">{settings.language === 'en' ? 'Shop Numbers' : 'Tirooyinka Bakhaarka'}</p>
        </div>
        <button 
          onClick={() => navigate('/backup')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <span>{settings.language === 'en' ? 'Backup' : 'Aqbasho'}</span>
        </button>
      </header>
      <div className="space-y-4">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-end border-b border-slate-50 pb-4">
            <div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.receivable}</div><div className="text-2xl font-black text-red-600">{settings.currencySymbol} {totalCredit.toLocaleString()}</div></div>
            <div className="text-right"><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.sold}</div><div className="text-2xl font-black text-indigo-600">{totalItemsSold}</div></div>
          </div>
          <div className="flex justify-between items-end">
            <div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.active}</div><div className="text-2xl font-black text-slate-900">{customers.length}</div></div>
            <div className="text-right"><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.payable}</div><div className="text-2xl font-black text-emerald-600">{settings.currencySymbol} {totalDeposit.toLocaleString()}</div></div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-bold">{settings.language === 'en' ? 'Best Sellers' : 'Alaabta ugu Iibka Badan'}</h3>
        {products.sort((a, b) => b.totalSold - a.totalSold).slice(0, 5).map((p, idx) => (
          <div key={p.id} className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">#{idx + 1}</div>
            <div className="flex-1"><div className="font-bold text-slate-900">{p.name}</div><div className="text-[10px] text-slate-400">{p.totalSold} {t.sold}</div></div>
            <div className="text-right"><div className="text-sm font-bold text-indigo-600">{settings.currencySymbol} {(p.totalSold * p.unitPrice).toLocaleString()}</div></div>
          </div>
        ))}
        {products.length === 0 && <div className="text-center py-12 text-slate-400 italic text-sm">{t.empty}</div>}
      </div>
    </div>
  );
}
