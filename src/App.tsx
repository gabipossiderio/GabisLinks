import { Toaster } from "react-hot-toast";
import LoginProvider from "./contexts/login";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";


export function App() {
  return (
    <LoginProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </LoginProvider>
  );
}
