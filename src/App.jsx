import { Toaster } from "sonner"
import Navbar from "./pages/navbar/Navbar"
import AppRoute from "./route/AppRoute"

function App() {

  return (
    <>
      <Navbar />
      <AppRoute />
      <Toaster />
    </>
  )
}

export default App
