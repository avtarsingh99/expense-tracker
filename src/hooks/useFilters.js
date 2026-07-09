import React, { useMemo, useState } from 'react'

const useFilters = (data) => {

    const [filters, setFilters] = useState({
        category: 'all',
        dateFrom: '',
        dateTo: '',
        minAmount: '',
        maxAmount: '',
        searchTerm: ''
    })

    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const clearFilters = () => {
        setFilters({
            category: 'all',
            dateFrom: '',
            dateTo: '',
            minAmount: '',
            maxAmount: '',
            searchTerm: ''
        })
    }

    const filteredExpenses = useMemo(() => {

        return data.filter(item => {

            console.log('item.date:', item.date, '| dateFrom:', filters.dateFrom, '| comparison:', item.date < filters.dateFrom);

            //filtering categories
            if(filters.category !== 'all' && item.category !== filters.category){
                return false;
            }

            // filter date range
            if(filters.dateFrom && item.date < filters.dateFrom){
                return false;
            }
            if(filters.dateTo && item.date > filters.dateTo){
                return false;
            }

            // filter amount
            if(filters.minAmount && item.amount < parseInt(filters.minAmount)){
                return false;
            }
            if(filters.maxAmount && item.amount > parseInt(filters.maxAmount)){
                return false;
            }

            // filter search term
            if(filters.searchTerm && !item.description.toLowerCase().includes(filters.searchTerm.toLowerCase())){
                return false;
            }

            return true;
        });
    }, [data, filters])

    const getFilterSummary = () => {
        const activeFiltersArray = Object.entries(filters).filter(([key, value]) => {
            if(key === 'category') return value !== 'all';
            return value !== '';
        })

        return{
            activeFiltersCount: activeFiltersArray.length,
            totalResult: filteredExpenses.length,
            hasActiveFilters: activeFiltersArray.length > 0
        }
    }


    return {filters, updateFilter, clearFilters, filteredExpenses, getFilterSummary}
}

export default useFilters
