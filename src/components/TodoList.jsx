import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Trash2, ListTodo } from 'lucide-react';

export default function TodoList() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('academy_todos_v2');
    if (saved) return JSON.parse(saved);
    return [];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('academy_todos_v2', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setTodos([{ id: Date.now(), text: inputValue, completed: false }, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <ListTodo size={20} color="var(--primary)" />
        <h2 className="heading-2" style={{ margin: 0 }}>প্রতিদিনের কাজ</h2>
        <span style={{ 
          marginLeft: 'auto', 
          background: 'rgba(255,255,255,0.1)', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '1rem',
          fontSize: '0.875rem'
        }}>
          {todos.filter(t => t.completed).length} / {todos.length} সম্পন্ন
        </span>
      </div>

      <form onSubmit={addTodo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="নতুন কাজ যোগ করুন..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="btn btn-icon"><Plus size={20} /></button>
      </form>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem',
        paddingRight: '0.5rem'
      }}>
        {todos.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', marginTop: '2rem' }}>আজকের জন্য কোনো কাজ নেই। উপভোগ করুন!</p>
        ) : (
          todos.map(todo => (
            <div 
              key={todo.id} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                background: todo.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-md)',
                transition: 'var(--transition)'
              }}
            >
              <button 
                onClick={() => toggleTodo(todo.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: todo.completed ? 'var(--success)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                {todo.completed ? <CheckSquare size={20} /> : <Square size={20} />}
              </button>
              
              <span style={{ 
                flex: 1, 
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'var(--text-muted)' : 'white'
              }}>
                {todo.text}
              </span>
              
              <button 
                onClick={() => deleteTodo(todo.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  opacity: 0.7,
                  display: 'flex'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
