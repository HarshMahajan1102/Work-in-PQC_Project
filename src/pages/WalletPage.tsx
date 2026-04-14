import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Plus, Key, CheckCircle2, Shield } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Modal } from "../components/ui/Modal"

// Mock Data
type Credential = {
  credentialId: string
  role: string
  level: string
  issuedAt: string
}

const initialCredentials: Credential[] = [
  {
    credentialId: "cred-84xj-992p-11m",
    role: "Admin",
    level: "Tier 1",
    issuedAt: "2026-04-12T10:00:00Z",
  },
  {
    credentialId: "cred-27ab-449q-88k",
    role: "Auditor",
    level: "Tier 2",
    issuedAt: "2026-04-13T14:30:00Z",
  },
]

export function WalletPage() {
  const [credentials, setCredentials] = useState<Credential[]>(initialCredentials)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [generatedProof, setGeneratedProof] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  // Request Form State
  const [reqUserId, setReqUserId] = useState("")
  const [reqRole, setReqRole] = useState("")
  const [reqLevel, setReqLevel] = useState("")

  const handleRequestCredential = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock creating new credential
    const newCred: Credential = {
      credentialId: `cred-${Math.random().toString(36).substring(2, 6)}-new`,
      role: reqRole,
      level: reqLevel,
      issuedAt: new Date().toISOString(),
    }
    setCredentials([...credentials, newCred])
    setIsRequestModalOpen(false)
    setReqUserId("")
    setReqRole("")
    setReqLevel("")
  }

  const handleGenerateProof = (credId: string) => {
    // Mock generating a proof based on the credential
    const proofDoc = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [credId],
      proof: {
        type: "QuantumSafeSignature2026",
        created: new Date().toISOString(),
        proofPurpose: "authentication",
        verificationMethod: "did:pqc:example#key-1",
        jws: "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..mock_signature_data_abc123"
      }
    }
    setGeneratedProof(JSON.stringify(proofDoc, null, 2))
    setIsCopied(false)
  }

  const handleCopyProof = () => {
    if (generatedProof) {
      navigator.clipboard.writeText(generatedProof)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Digital Wallet</h1>
          <p className="text-gray-400">Manage your credentials and generate quantum-safe zero-knowledge proofs.</p>
        </div>
        <Button onClick={() => setIsRequestModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Request Credential
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credentials List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-secondary" /> My Credentials
          </h2>
          
          <div className="flex flex-col gap-4">
            {credentials.map((cred, index) => (
              <motion.div
                key={cred.credentialId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card glow="primary" className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-primary font-mono text-sm">{cred.credentialId}</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs border border-primary/20">
                        {cred.level}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                      <div className="text-gray-400">Role</div>
                      <div className="text-white font-medium">{cred.role}</div>
                      <div className="text-gray-400">Issued At</div>
                      <div className="text-white font-mono text-xs">{new Date(cred.issuedAt).toLocaleDateString()}</div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 text-primary border-primary/50 hover:bg-primary/20 hover:border-primary"
                      onClick={() => handleGenerateProof(cred.credentialId)}
                    >
                      <Shield className="h-4 w-4" /> Create Proof
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {credentials.length === 0 && (
              <div className="p-8 text-center border border-dashed border-border rounded-xl text-gray-500">
                No credentials found. Request one to get started.
              </div>
            )}
          </div>
        </div>

        {/* Proof Display Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-secondary" /> Generated Proof
          </h2>
          
          <Card className="h-[calc(100%-2rem)] flex flex-col bg-black/40 border-border/50 relative overflow-hidden">
            {generatedProof ? (
              <>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-surface/30 pb-4">
                  <CardTitle className="text-sm font-mono text-gray-300">Presentation payload</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopyProof}
                    className="h-8 gap-2 hover:bg-white/5 border border-transparent hover:border-white/10"
                  >
                    {isCopied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    {isCopied ? "Copied" : "Copy JSON"}
                  </Button>
                </CardHeader>
                <div className="flex-1 p-0 overflow-auto relative">
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/20 z-10" />
                  <pre className="p-4 text-xs font-mono text-primary/80 whitespace-pre-wrap word-break">
                    {generatedProof}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-50">
                <Shield className="h-12 w-12 text-gray-500 mb-4" />
                <p className="text-gray-400">Select "Create Proof" on a credential to generate a Verifiable Presentation.</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Request Credential Modal */}
      <Modal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)}
        title="Request New Credential"
      >
        <form onSubmit={handleRequestCredential} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">User ID</label>
            <Input 
              placeholder="e.g., user@enterprise.org" 
              value={reqUserId}
              onChange={(e) => setReqUserId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Requested Role</label>
            <Input 
              placeholder="e.g., Analyst, Auditor, Admin" 
              value={reqRole}
              onChange={(e) => setReqRole(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Access Level</label>
            <select 
              className="flex h-10 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-gray-100 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors appearance-none"
              value={reqLevel}
              onChange={(e) => setReqLevel(e.target.value)}
              required
            >
              <option value="" disabled>Select Level...</option>
              <option value="Tier 1">Tier 1 (High)</option>
              <option value="Tier 2">Tier 2 (Medium)</option>
              <option value="Tier 3">Tier 3 (Standard)</option>
            </select>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
