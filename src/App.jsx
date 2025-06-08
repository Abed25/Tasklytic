import { AuthProvider } from "./context/AuthProvider";
import Layout from "./layout";
import PWAUpdater from "./component/PWAUpdater";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-center"
        newestOnTop
        limit={1}
        toastClassName="text-center"
        style={{ width: "auto" }}
        theme="light"
        progressStyle={{ background: "rgba(128, 222, 234, 0.8)" }}
      />
      <PWAUpdater />
      <Layout />
    </AuthProvider>
  );
}

export default App;
