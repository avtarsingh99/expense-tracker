import React, { useState } from 'react'
import './App.css'
import useExpenses from './hooks/useExpenses';
import useFilters from './hooks/useFilters';

function App() {

  const {
    expenses,
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

  const categories = ['all', 'food', 'travel', 'shopping', 'bill', 'entertainment', 'other']

  const filterSummary = getFilterSummary();

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
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='bottom-group'>
            <button className='add-btn' disabled={!description.trim() || !amount}>Add Expense</button>
          </div>
        </form>

        <div className='line'></div>

        <div className='filters-section'>
          <div className='top-group'>
            <div className='input-group'>
              <label>Filter By Categories: </label>
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
          </div>
          <div className='top-group'>
            <div className='input-group'>
              <label>Search with Desc: </label>
              <input
                type='text'
                placeholder='Search desc here...'
                value={filters.searchTerm}
                onChange={(e) => updateFilter("searchTerm", e.target.value)}
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
            <div className='bottom-group'>
              {console.log("Date: ", filters.dateFrom)}
              <button onClick={clearFilters} className='clear-btn'>Clear Filters ({filterSummary.activeFiltersCount})</button>
            </div>
          )}
        </div>

        <div className='line'></div>

        <div className='expenses-grid'>
          {filteredExpenses.length === 0 ? (
            <div className='empty-state'>
              <p>Add expenses to see list here</p>
            </div>
          ) : (
            filteredExpenses.map(expense => (
              <div key={expense.description} className='expense-card'>
                <div className='expense-left-part'>
                  <div className='desc'>{expense.description}</div>
                  <div className='category'>{expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</div>
                  <div className='date'>{expense.date}</div>
                </div>
                <div className='expense-right-part'>
                  <div className='amount'>₹ {expense.amount}</div>
                  <button onClick={(e) => removeExpense(expense.id)} className='delete-btn'>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className='line'></div>

        <div className='summary'>
          <p>Showing total of {filteredExpenses.length} expenses out of {expenses.length} expenses </p>
          <div className='total-amount'>₹ {getTotalAmount}</div>
        </div>

        {expenses.length > 0 ? (
          <>
            <div className='line'></div>

            <div className='footer'>
              <button onClick={clearExpenses} className='clear-storage'>Remove All Local Storage</button>
            </div>
          </>
        ) :
          ''}
      </main>
    </div>
  )
}

export default App
