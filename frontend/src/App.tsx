import { Toaster } from "sonner";
import AppRoutes from "./Routes/AppRoute";

function App() {
  return (
    <div>
      <Toaster position="top-right" richColors closeButton />
      <AppRoutes />
    </div>
  );
}

export default App;