import { AuthProvider } from "./context/AuthProvider";
import Layout from "./layout";

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;
