import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Counter } from './features/counter/Counter.tsx';
import AuthLayout from './features/auth/auth-layoyt.tsx';
import LoginScreen from './features/auth/login/login-screen.tsx';
import SignUpScreen from './features/auth/signup/sign-up-screen.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Counter />} />
                    <Route path="counter" element={<Counter />} />
                    <Route path="auth" element={<AuthLayout />}>
                        <Route index element={<LoginScreen />} />
                        <Route path="sign-up" element={<SignUpScreen />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
);
