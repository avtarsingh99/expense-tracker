import React, { useState } from 'react'
// import useLocalStorage from './useLocalStorage'

const useExpenses = () => {

    const [expenses, setExpenses] = useState([]);

    const addExpense = (expenseData) => {
        const newExpense = {
            id: Date.now(),
            ...expenseData,
            date: new Date().toDateString(),
        }

        setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    }

    const removeExpense = (id) => {
        setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id))
    }

    return { 
        expenses,
        addExpense,
        removeExpense
    }
}

export default useExpenses
