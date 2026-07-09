import React, { useState } from 'react'

const useLocalStorage = (key, initialValue) => {

    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = JSON.parse(localStorage.getItem(key));
            return item ? item : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}": `,error);
            return initialValue;
        }
    })

    const setValue = (value) => {
        try{

            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error){
            console.error(`Error setting localStorage key "${key}": `, error)
        }
    }

    const removeAllLocalStorage = () => {
        console.log('removeAllLocalStorage called, key:', key);
        try{
            localStorage.removeItem(key)
            setStoredValue(initialValue)
            console.log('after removal:', localStorage.getItem(key));
        } catch (error){
            console.error(`Error removing the localStorage: `, error)
        }
    }

    return [storedValue, setValue, removeAllLocalStorage];
}

export default useLocalStorage
