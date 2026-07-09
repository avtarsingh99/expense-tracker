import React, { useMemo, useState } from 'react'
import useLocalStorage from './useLocalStorage';

const useExpenses = () => {

    const [expenses, setExpenses, clearExpenses] = useLocalStorage('expenses', []);

    const addExpense = (expenseData) => {
        const newExpense = {
            id: Date.now(),
            ...expenseData,
            date: new Date().toISOString().split('T')[0],
        }

        setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    }

    const removeExpense = (id) => {
        setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id))
    }

    const getTotalAmount = useMemo(()=> {
        return expenses.reduce((sum, expense)=> sum + expense.amount, 0);
    }, [expenses])

    return { 
        expenses,
        addExpense,
        removeExpense,
        getTotalAmount,
        clearExpenses
    }
}

export default useExpenses
