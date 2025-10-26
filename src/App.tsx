import { AuthProviderWithRouter } from './contexts/AuthProviderWithRouter';
import Router from './router';

// App is primarily responsible for providing global contexts
function App() {
  return (
    <AuthProviderWithRouter>
      <Router />
    </AuthProviderWithRouter>
  );
}

export default App;