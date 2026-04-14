import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, Fingerprint, FileLock2, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { issuerService } from "../services/issuerService"

type Toast = {
  id: number
  message: string
  type: "success" | "error"
}

export function IssuerPage() {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Form States
  const [issueForm, setIssueForm] = useState({ userId: "", role: "", level: "" })
  const [revokeForm, setRevokeForm] = useState({ credentialId: "" })
  const [policyForm, setPolicyForm] = useState({ resourceId: "", requiredRole: "", requiredLevel: "" })

  // Loading States
  const [isIssuing, setIsIssuing] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)
  const [isCreatingPolicy, setIsCreatingPolicy] = useState(false)

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const handleIssueCredential = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsIssuing(true)
    try {
      await issuerService.issueCredential(issueForm)
      addToast(`Credential successfully issued to ${issueForm.userId}`, "success")
      setIssueForm({ userId: "", role: "", level: "" })
    } catch (error: any) {
      addToast(error.response?.data?.message || "Failed to issue credential.", "error")
    } finally {
      setIsIssuing(false)
    }
  }

  const handleRevokeCredential = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRevoking(true)
    
    if (revokeForm.credentialId.trim().length < 8) {
      addToast("Invalid Credential ID format.", "error")
      setIsRevoking(false)
      return
    }

    try {
      await issuerService.revokeCredential(revokeForm)
      addToast(`Credential ${revokeForm.credentialId} has been revoked.`, "success")
      setRevokeForm({ credentialId: "" })
    } catch (error: any) {
      addToast(error.response?.data?.message || "Failed to revoke credential.", "error")
    } finally {
      setIsRevoking(false)
    }
  }

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingPolicy(true)
    try {
      await issuerService.createPolicy(policyForm)
      addToast(`Policy created for resource ${policyForm.resourceId}`, "success")
      setPolicyForm({ resourceId: "", requiredRole: "", requiredLevel: "" })
    } catch (error: any) {
      addToast(error.response?.data?.message || "Failed to create access policy.", "error")
    } finally {
      setIsCreatingPolicy(false)
    }
  }

  return (
    <div className="space-y-8 pb-10 relative">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Issuer Administration</h1>
        <p className="text-gray-400">Manage credentials, orchestrate revocations, and define quantum-safe access policies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Issue Credential Form */}
        <Card glow="primary" className="border-border/50 lg:col-span-2 xl:col-span-1">
          <CardHeader className="border-b border-border/50 bg-primary/5 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-primary" /> 
              Issue New Credential
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleIssueCredential} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">User ID / Entity URI</label>
                <Input 
                  placeholder="did:pqc:entity-1234..." 
                  value={issueForm.userId}
                  onChange={(e) => setIssueForm({...issueForm, userId: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Role assigned</label>
                  <Input 
                    placeholder="e.g., Administrator" 
                    value={issueForm.role}
                    onChange={(e) => setIssueForm({...issueForm, role: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Security Level</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-gray-100 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors appearance-none"
                    value={issueForm.level}
                    onChange={(e) => setIssueForm({...issueForm, level: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select Level...</option>
                    <option value="Tier 1">Tier 1 (High)</option>
                    <option value="Tier 2">Tier 2 (Medium)</option>
                    <option value="Tier 3">Tier 3 (Standard)</option>
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit" className="w-full gap-2" disabled={isIssuing}>
                  {isIssuing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
                  {isIssuing ? "Processing Issuance..." : "Issue Verification Credential"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2 xl:col-span-1">
          {/* Create Policy Form */}
          <Card glow="none" className="border-border/50">
            <CardHeader className="border-b border-border/50 bg-surface/30 pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileLock2 className="h-5 w-5 text-gray-400" /> 
                Create Access Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreatePolicy} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Target Resource ID</label>
                  <Input 
                    placeholder="resource://quantum-server-01" 
                    value={policyForm.resourceId}
                    onChange={(e) => setPolicyForm({...policyForm, resourceId: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Required Role</label>
                    <Input 
                      placeholder="e.g., Auditor" 
                      value={policyForm.requiredRole}
                      onChange={(e) => setPolicyForm({...policyForm, requiredRole: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Minimum Level</label>
                    <Input 
                      placeholder="e.g., Tier 2" 
                      value={policyForm.requiredLevel}
                      onChange={(e) => setPolicyForm({...policyForm, requiredLevel: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <Button type="submit" variant="outline" className="w-full gap-2 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800" disabled={isCreatingPolicy}>
                    {isCreatingPolicy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileLock2 className="h-4 w-4" />}
                    {isCreatingPolicy ? "Publishing..." : "Publish Global Policy"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Revoke Credential Form */}
          <Card glow="secondary" className="border-red-900/30 bg-red-950/10">
            <CardHeader className="border-b border-red-900/30 bg-red-900/10 pb-4">
              <CardTitle className="flex items-center gap-2 text-red-400">
                <ShieldAlert className="h-5 w-5" /> 
                Revoke Credential
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleRevokeCredential} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-red-200/70">Target Credential ID</label>
                  <Input 
                    placeholder="cred-xxxx-xxxx-xxxx" 
                    className="border-red-900/50 focus-visible:ring-red-500/50"
                    value={revokeForm.credentialId}
                    onChange={(e) => setRevokeForm({...revokeForm, credentialId: e.target.value})}
                    required
                  />
                  <p className="text-xs text-red-400/60 pt-1">Danger: This action cannot be undone and propagates to the network immediately.</p>
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full gap-2 bg-red-900/80 hover:bg-red-800 text-white border border-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]" disabled={isRevoking}>
                    {isRevoking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                    {isRevoking ? "Broadcasting Revocation..." : "Revoke Permanently"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center justify-between gap-3 min-w-[300px] p-4 rounded-lg shadow-lg border backdrop-blur-md ${
                toast.type === "success" 
                  ? "bg-green-950/80 border-green-500/50 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                  : "bg-red-950/80 border-red-500/50 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts(toasts.filter(t => t.id !== toast.id))}
                className="p-1 rounded-md hover:bg-white/10 transition-colors focus:outline-none"
              >
                <X className="h-4 w-4 opacity-70" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  )
}
