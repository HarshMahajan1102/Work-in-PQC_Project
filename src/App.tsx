import { Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { Dashboard } from "./pages/Dashboard"
import { WalletPage } from "./pages/WalletPage"
import { IssuerPage } from "./pages/IssuerPage"

// Dummy pages to avoid errors
const VerifierPage = () => <div className="p-6"><h1 className="text-2xl font-bold text-white">Verifier</h1></div>
const CentrePage = () => <div className="p-6"><h1 className="text-2xl font-bold text-white">Centre</h1></div>

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="issuer" element={<IssuerPage />} />
        <Route path="verifier" element={<VerifierPage />} />
        <Route path="centre" element={<CentrePage />} />
      </Route>
    </Routes>
  )
}

export default App
