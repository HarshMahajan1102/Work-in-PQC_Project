import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, CheckCircle, XCircle, Terminal, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { verifierService } from "../services/verifierService"

type VerificationResult = {
  status: "GRANTED" | "DENIED" | null
  reason: string
  timestamp: string
}

export function VerifierPage() {
  const [proofJson, setProofJson] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult>({ status: null, reason: "", timestamp: "" })
  const resultEndRef = useRef<HTMLDivElement>(null)

  // Scroll terminal to bottom when result changes
  useEffect(() => {
    if (resultEndRef.current) {
      resultEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [result])

  const handleVerify = async () => {
    if (!proofJson.trim()) return

    setIsVerifying(true)
    setResult({ status: null, reason: "", timestamp: "" })

    // Backend Verification API Call
    let parsed: any = null
    try {
      parsed = JSON.parse(proofJson)
    } catch (e) {
      setResult({
        status: "DENIED",
        reason: "Proof verification failed: Invalid JSON format.",
        timestamp: new Date().toISOString(),
      })
      setIsVerifying(false)
      return
    }

    try {
      const res = await verifierService.verifyProof(parsed)
      setResult({
        status: res.status || (res.success ? "GRANTED" : "DENIED"),
        reason: res.reason || res.message || "Verification executed successfully against network ledger.",
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      setResult({
        status: "DENIED",
        reason: error.response?.data?.message || error.response?.data?.reason || "Backend entity validation failed or network unavailable.",
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusColor = () => {
    if (result.status === "GRANTED") return "text-green-400"
    if (result.status === "DENIED") return "text-red-500"
    return "text-gray-500"
  }

  const getBgGlow = () => {
    if (result.status === "GRANTED") return "shadow-[0_0_20px_rgba(34,197,94,0.15)] border-green-500/30"
    if (result.status === "DENIED") return "shadow-[0_0_20px_rgba(239,68,68,0.15)] border-red-500/30"
    return "border-border/50"
  }

  return (
    <div className="space-y-8 pb-10 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Entity Verifier</h1>
        <p className="text-gray-400">Validate presented Zero-Knowledge proofs against the post-quantum network layer.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* Input Pane */}
        <div className="flex flex-col space-y-4">
          <Card glow="none" className="flex-1 flex flex-col border-border/50 bg-black/20">
            <CardHeader className="border-b border-border/50 pb-4 bg-surface/20">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Code className="h-5 w-5" /> 
                Presentation Payload
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col gap-4">
              <p className="text-sm text-gray-400 font-medium">Paste the JSON Verifiable Presentation payload here:</p>
              <textarea
                className="flex-1 w-full bg-black/50 border border-primary/20 rounded-md p-4 text-xs font-mono text-gray-300 focus-visible:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-glow-primary transition-all resize-none"
                placeholder={`{\n  "@context": [...],\n  "type": ["VerifiablePresentation"],\n  "proof": {\n    "type": "QuantumSafeSignature2026",\n    ...\n  }\n}`}
                value={proofJson}
                onChange={(e) => setProofJson(e.target.value)}
              />
              <Button onClick={handleVerify} disabled={isVerifying || !proofJson.trim()} className="w-full h-12 gap-2 text-lg">
                {isVerifying ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                {isVerifying ? "Verifying Matrix..." : "Verify Proof Payload"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output / Terminal Pane */}
        <div className="flex flex-col space-y-4">
          <Card className={`flex-1 flex flex-col bg-black overflow-hidden transition-all duration-500 ${getBgGlow()}`}>
            <CardHeader className="border-b border-border/30 bg-surface/40 py-3 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                <Terminal className="h-4 w-4" /> root@verifier-node:~
              </CardTitle>
              {/* Animated Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500 uppercase">Status</span>
                <div className="relative flex h-3 w-3">
                  <AnimatePresence mode="popLayout">
                    {isVerifying && (
                      <motion.span 
                        key="verifying"
                        className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"
                        initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} exit={{ opacity: 0 }}
                      />
                    )}
                    {result.status === "GRANTED" && (
                      <motion.span 
                        key="granted"
                        className="absolute inline-flex h-full w-full rounded-full bg-green-500"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      />
                    )}
                    {result.status === "DENIED" && (
                      <motion.span 
                        key="denied"
                        className="absolute inline-flex h-full w-full rounded-full bg-red-500"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      />
                    )}
                    {!isVerifying && !result.status && (
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-600" />
                    )}
                  </AnimatePresence>
                  {isVerifying && <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500" />}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 p-0 flex-1 relative font-mono text-sm overflow-hidden">
              <div className="absolute inset-0 p-6 overflow-y-auto w-full h-full text-gray-300">
                <div className="mb-4">
                  <span className="text-secondary">$</span> systemctl start pqc-verification-daemon
                </div>
                
                {isVerifying && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col gap-2 text-yellow-500/80"
                  >
                    <div><span className="text-secondary">$</span> run_verifier --input ./payload.json</div>
                    <div className="text-gray-500 animate-pulse">[i] Initializing quantum matrix evaluation...</div>
                    <div className="text-gray-500 animate-pulse">[i] Unpacking zero-knowledge constraints...</div>
                    <div className="text-gray-500 animate-pulse">[i] Validating cryptographic lattice signatures...</div>
                    <div ref={resultEndRef} />
                  </motion.div>
                )}

                {result.status && !isVerifying && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 mt-6 border border-border/30 bg-surface/30 p-4 rounded-md"
                  >
                    <div className="flex items-center gap-3 border-b border-border/30 pb-3">
                      {result.status === "GRANTED" ? (
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-500" />
                      )}
                      <div>
                        <div className={`text-xl font-bold tracking-widest ${getStatusColor()}`}>
                          ACCESS {result.status}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(result.timestamp).toUTCString()}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs uppercase mb-1">Reason</div>
                      <div className={`${result.status === "DENIED" ? "text-red-400/80" : "text-green-400/80"}`}>
                        &gt; {result.reason}
                      </div>
                    </div>
                    <div ref={resultEndRef} />
                  </motion.div>
                )}

                {!isVerifying && !result.status && (
                  <div className="mt-4 flex items-center gap-2 text-gray-600">
                    <span className="text-secondary">$</span> <span className="animate-pulse">_</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  )
}
