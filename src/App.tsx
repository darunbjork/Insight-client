import { AuthProvider } from './contexts/AuthContext';
import Router from './router';

// App is primarily responsible for providing global contexts
function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;