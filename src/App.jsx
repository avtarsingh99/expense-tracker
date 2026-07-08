import React, { useState } from 'react'
import './App.css'
import useExpenses from './hooks/useExpenses';

function App() {

  const { expenses, addExpense, removeExpense } = useExpenses();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');

  const categories = ['food', 'travel', 'shopping', 'bill', 'other']

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim() || !amount) {
      alert("Description & Amount are compulsory!!!")
      return
    }

    addExpense({
      description: description,
      amount: parseInt(amount, 10),
      category: category
    })

    setDescription('')
    setAmount('')
    setCategory('food')
  }

  return (
    <div className='app'>
      <header>
        <h1>Personal Expenses Tracker</h1>
        <p>Track all your expenses right here!</p>
      </header>
      <div className='line'></div>
      <main>
        <form className='add-form' onSubmit={handleSubmit}>
          <div className='top-group'>
            <div className='input-group'>
              <label htmlFor='desc'>Description: </label>
              <input
                type='text'
                id='desc'
                value={description}
                placeholder='Expense description...'
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className='input-group'>
              <label htmlFor='amount'>Amount: </label>
              <input
                type='number'
                id='amount'
                value={amount}
                placeholder='₹ 0'
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className='input-group'>
              <label htmlFor='category'>Category: </label>
              <select
                id='category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='bottom-group'>
            <button className='add-btn'>Add Expense</button>
          </div>
        </form>
        <div className='line'></div>
        <div className='expenses-grid'>
          {expenses.length === 0 ? (
            <p>Add expenses to see list here</p>
          ) : (
            expenses.map(expense => (
              <div key={expense.description} className='expense-card'>
                <div className='expense-left-part'>
                  <div className='desc'>{expense.description}</div>
                  <div className='category'>{expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</div>
                  <div className='date'>{expense.date}</div>
                </div>
                <div className='expense-right-part'>
                  <div className='amount'>₹ {expense.amount}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default App
