import React, { useState } from 'react'
import './App.css'
import useExpenses from './hooks/useExpenses';
import useFilters from './hooks/useFilters';

function App() {

  const {
    expenses,
    setExpenses,
    addExpense,
    removeExpense,
    getTotalAmount,
    clearExpenses } = useExpenses();

  const {
    filters,
    filteredExpenses,
    updateFilter,
    clearFilters,
    getFilterSummary } = useFilters(expenses);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [editingCardId, setEditingCardId] = useState(null);
  const [editingCardData, setEditingCardData] = useState({
    description: '',
    category: '',
    amount: ''
  });

  const categories = ['all', 'food', 'travel', 'shopping', 'bill', 'entertainment', 'other']

  const filterSummary = getFilterSummary();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCardId !== null) {
      return; 
    }

    if (description.length > 25) {
      alert("Expense title can't be more than 25 characters !!!");
      setDescription('')
      return
    } else if (amount > 9999) {
      alert("Expense amount can't be more than ₹9999")
      setAmount('')
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

  const startEditing = (expense) => {
    setEditingCardId(expense.id);

    setEditingCardData({
      description: expense.description,
      category: expense.category,
      amount: expense.amount
    });
  }

  const saveEditData = () => {

    if (!editingCardData.description.trim()) {
      alert("Title can't be empty!!!");
      return;
    }

    if (editingCardData.description.length > 25) {
      alert("Title can't be more than 25 characters !!!");
      return;
    }

    const amountNum = Number(editingCardData.amount);

    if (editingCardData.amount === '' || isNaN(amountNum) || amountNum <= 0) {
      alert("Amount must be more than zero !!!");
      return;
    }

    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === editingCardId ?
          {
            ...expense,
            ...editingCardData,
            amount: parseInt(editingCardData.amount, 10)
          } : expense
      )
    );

    setEditingCardId(null)
  }

  const cancelEditData = () => {
    setEditingCardId(null)
    setEditingCardData({
      description: '',
      category: '',
      amount: ''
    })
  }

  return (
    <div className='app'>
      <header>
        <h1>Personal Expenses Tracker</h1>
        <p>Track all your expenses right here!</p>
      </header>

      <main>
        <div className='main'>

          <div className='sidebar'>
            <form className='add-form' onSubmit={handleSubmit}>
              <div className='top-group'>
                <div className='input-group'>
                  <label htmlFor='desc'>Title: </label>
                  <input
                    key={editingCardData !== null ? editingCardId : 'new'}
                    type='text'
                    id='desc'
                    autoFocus
                    value={editingCardId !== null ? editingCardData.description : description}
                    placeholder='Expense title'
                    onChange={editingCardId !== null ? (e) => setEditingCardData(prev => ({ ...prev, description: e.target.value })) : (e) => setDescription(e.target.value)}
                  />
                  {editingCardId !== null ?
                    <small style={editingCardData.description.length > 25 ? { color: 'crimson' } : {}}>{editingCardData.description.length}/25</small>
                    : <small style={description.length > 25 ? { color: 'crimson' } : {}}>{description.length}/25</small>
                  }
                </div>
                <div className='input-group'>
                  <label htmlFor='amount'>Amount: </label>
                  <input
                    type='number'
                    id='amount'
                    value={editingCardId !== null ? editingCardData.amount : amount}
                    placeholder='₹ 0'
                    onChange={editingCardId !== null ? (e) => setEditingCardData(prev => ({ ...prev, amount: e.target.value })) : (e) => setAmount(e.target.value)}
                  />
                </div>
                <div className='input-group'>
                  <label htmlFor='category'>Category: </label>
                  <select
                    id='category'
                    value={editingCardId !== null ? editingCardData.category : category}
                    onChange={editingCardId !== null ? (e) => setEditingCardData(prev => ({ ...prev, category: e.target.value })) : (e) => setCategory(e.target.value)}
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              {editingCardId !== null ?
                <div className='btn-group'>
                  <button type='button' className='save-btn' onClick={saveEditData}>Save</button>
                  <button type='button' className='delete-btn' onClick={cancelEditData}>Cancel</button>
                </div>
                : <div className='bottom-group'>
                  <button type='submit' className='add-btn' disabled={!description.trim() || !amount}>Add Expense</button>
                </div>
              }
            </form>
            {expenses.length > 0 ? (
              <>
                <div className='line'></div>

                <div className='footer'>
                  <button onClick={clearExpenses} className='clear-storage'>Remove All Local Storage</button>
                </div>
              </>
            ) :
              ''}
          </div>

          <div className='content'>
            <div className='filters-section'>
              <div style={{ width: '100%' }}>
                <div className='search-group'>
                  <div className='input-group'>
                    <label>Search with Title: </label>
                    <input
                      type='text'
                      placeholder='Search title here'
                      value={filters.searchTerm}
                      onChange={(e) => updateFilter("searchTerm", e.target.value)}
                    />
                  </div>
                  {filterSummary.hasActiveFilters && (
                    <div className='bottom-group'>
                      <button onClick={clearFilters} className='clear-btn'>Clear Filters ({filterSummary.activeFiltersCount})</button>
                    </div>
                  )}
                </div>
                <div className='filters-group'>
                  <div className='input-group'>
                    <label>Categories: </label>
                    <select
                      value={filters.category}
                      onChange={(e) => updateFilter("category", e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className='input-group'>
                    <label>Min Amount:</label>
                    <input
                      type='number'
                      value={filters.minAmount}
                      placeholder='₹ 0'
                      onChange={(e) => updateFilter("minAmount", e.target.value)}
                    />
                  </div>
                  <div className='input-group'>
                    <label>Max Amount:</label>
                    <input
                      type='number'
                      value={filters.maxAmount}
                      placeholder='₹ 0'
                      onChange={(e) => updateFilter("maxAmount", e.target.value)}
                    />
                  </div>
                  <div className='input-group'>
                    <label>From Date:</label>
                    <input
                      type='date'
                      value={filters.dateFrom}
                      onChange={(e) => updateFilter("dateFrom", e.target.value)}
                    />
                  </div>
                  <div className='input-group'>
                    <label>To Date:</label>
                    <input
                      type='date'
                      value={filters.dateTo}
                      onChange={(e) => updateFilter("dateTo", e.target.value)}
                    />
                  </div>
                </div>
                {filterSummary.hasActiveFilters && (
                  <p style={{ marginTop: '12px' }}>Showing {filteredExpenses.length} {filteredExpenses.length > 1 ? 'expenses' : 'expense'} out of {expenses.length} expenses </p>
                )}
              </div>
              <div className='summary'>
                <p>Expenses Grand Total</p>
                <div className='total-amount'>₹ {getTotalAmount}</div>
              </div>
            </div>

            <div className='line'></div>

            <div className='expenses-grid'>
              {filteredExpenses.length === 0 ? (
                <div className='empty-state'>
                  <p>Add expenses to see list here</p>
                </div>
              ) : (
                filteredExpenses.map(expense => (

                  <div key={expense.id} className={`${expense.category} expense-card`}>
                    <div className='expense-left-part'>
                      <div className='desc'>{expense.description}</div>
                      <div className={`${expense.category} category`}>{expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</div>
                      <div className='date'>{expense.date}</div>
                    </div>
                    <div className='expense-right-part'>
                      <div className='amount'>₹ {expense.amount}</div>
                      <div className='btn-group'>
                        <button onClick={(e) => startEditing(expense)} className='edit-btn' disabled={editingCardId !== null} >Edit</button>
                        <button onClick={(e) => removeExpense(expense.id)} className='delete-btn' disabled={editingCardId !== null} >Delete</button>
                      </div>
                    </div>
                  </div>

                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default App
