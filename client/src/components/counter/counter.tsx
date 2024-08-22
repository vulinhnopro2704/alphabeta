'use client'
import { decrement, increment } from '@/lib/features/counter/counterSlice';
import { RootState } from '@/lib/store';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Counter: React.FC = () => {
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch();

    const handleIncrement = () => {
        dispatch(increment());
    };

    const handleDecrement = () => {
        dispatch(decrement());
    };

    return (
        <div className='flex flex-col items-center gap-5'>
            <h1>Counter: {count}</h1>
            <div className='flex gap-2 text-black'>
                <button className='p-2 bg-white rounded' onClick={handleIncrement}>Increment</button>
                <button className='p-2 bg-white rounded' onClick={handleDecrement}>Decrement</button>
            </div>
        </div>
    );
};

export default Counter;