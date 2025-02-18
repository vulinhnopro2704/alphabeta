import '@/App.css';
import Header from './components/header';
import LoginScreen from './features/auth/login/login-screen';
function App() {
    return (
        <>
            <Header />
            <LoginScreen />
        </>
    );
}

export default App;
