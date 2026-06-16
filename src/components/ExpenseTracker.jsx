import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2 } from 'lucide-react';

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('academy_expenses_v2');
    if (saved) return JSON.parse(saved);
    return [];
  });
  
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('academy_expenses_v2', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (e) => {
    e.preventDefault();
    if (!text.trim() || !amount) return;
    setExpenses([{ id: Date.now(), text, amount: Number(amount) }, ...expenses]);
    setText('');
    setAmount('');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Wallet size={20} color="var(--primary)" />
        <h2 className="heading-2" style={{ margin: 0 }}>খরচ ট্র্যাকার</h2>
        <span style={{ 
          marginLeft: 'auto', 
          background: 'rgba(239, 68, 68, 0.2)', 
          color: 'var(--danger)',
          padding: '0.25rem 0.75rem', 
          borderRadius: '1rem',
          fontWeight: 600
        }}>
          ৳{total}
        </span>
      </div>

      <form onSubmit={addExpense} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="খরচের বিবরণ..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 2 }}
        />
        <input 
          type="number" 
          className="input-field" 
          placeholder="৳"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-icon"><Plus size={20} /></button>
      </form>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.5rem' }}>
        {expenses.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', marginTop: '1rem' }}>কোনো খরচ নেই।</p>
        ) : (
          expenses.map(exp => (
            <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <span>{exp.text}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>৳{exp.amount}</span>
                <button 
                  onClick={() => deleteExpense(exp.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
