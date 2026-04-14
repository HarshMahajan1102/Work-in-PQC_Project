import { useState, useEffect } from "react"
import { BarChart3, Activity, Eye, ShieldAlert, Fingerprint, Search, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { centreService, type LogEntry } from "../services/centreService"

export function CentrePage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedBatch, setSelectedBatch] = useState<LogEntry | null>(null)
  const [isDeanonymized, setIsDeanonymized] = useState(false)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await centreService.getLogs()
        setLogs(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch center analytics logs.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const handleDeanonymize = () => {
    // In a real app, this would involve a cryptographic trapdoor mechanism
    setIsDeanonymized(true)
  }

  const closeModal = () => {
    setSelectedBatch(null)
    setIsDeanonymized(false)
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Network Centre</h1>
          <p className="text-gray-400">Global analytics, anomaly detection, and cryptographic oversight.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-primary/50 text-primary">
            <Activity className="h-4 w-4" /> Live Status
          </Button>
        </div>
      </div>

      {/* Analytics Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glow="primary" className="border-border/50 bg-black/40">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2 h-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
            <Activity className="h-8 w-8 text-primary mb-1 relative z-10" />
            <div className="text-2xl font-bold text-white relative z-10">14,203</div>
            <div className="text-xs text-gray-400 font-mono relative z-10">PROOFS_VERIFIED_24H</div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-black/40">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2 h-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent"></div>
            <ShieldAlert className="h-8 w-8 text-red-400 mb-1 relative z-10" />
            <div className="text-2xl font-bold text-red-400 relative z-10">12</div>
            <div className="text-xs text-gray-400 font-mono relative z-10">ANOMALIES_DETECTED</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-black/40">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2 h-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-secondary/15 to-transparent"></div>
            <BarChart3 className="h-8 w-8 text-secondary mb-1 relative z-10" />
            <div className="text-2xl font-bold text-secondary relative z-10">99.98%</div>
            <div className="text-xs text-gray-400 font-mono relative z-10">NETWORK_CONSENSUS</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Logs Table */}
      <Card className="border-border/50 bg-surface/30">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Global Verification Logs</CardTitle>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search batch Id..." 
                className="pl-9 pr-4 py-1.5 bg-black/50 border border-border rounded-md text-sm text-gray-300 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Batch ID</th>
                  <th className="px-6 py-4 font-medium">Verifier ID</th>
                  <th className="px-6 py-4 font-medium">Result</th>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                      Loading network logs from central server...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-red-400">
                      Error: {error}
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No verification logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-border/20 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-primary/80">{log.batchId}</td>
                      <td className="px-6 py-4 font-mono text-xs">{log.verifierId}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          log.result === "SUCCESS" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                          log.result === "FAILURE" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }`}>
                          {log.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedBatch(log)} className="h-8 gap-2 hover:text-primary">
                          <Eye className="h-4 w-4" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Batch Details Modal */}
      <Modal isOpen={!!selectedBatch} onClose={closeModal} title="Batch Overview Details">
        {selectedBatch && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-gray-500 uppercase text-xs">Batch ID</span>
                <div className="font-mono text-primary">{selectedBatch.batchId}</div>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 uppercase text-xs">Verifier Node</span>
                <div className="font-mono text-gray-300">{selectedBatch.verifierId}</div>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 uppercase text-xs">Status</span>
                <div className={`${selectedBatch.result === "SUCCESS" ? "text-green-400" : selectedBatch.result === "FAILURE" ? "text-red-400" : "text-yellow-400"}`}>
                  {selectedBatch.result}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 uppercase text-xs">Time</span>
                <div className="text-gray-300">{new Date(selectedBatch.timestamp).toUTCString()}</div>
              </div>
            </div>

            <div className="border border-border/50 rounded-md p-4 bg-black/40 space-y-3">
              <div className="flex items-center gap-2 text-secondary mb-2">
                <Fingerprint className="h-4 w-4" />
                <span className="font-semibold text-sm">Origin Entity Trace</span>
              </div>
              {isDeanonymized ? (
                <div className="bg-secondary/10 border border-secondary/30 rounded p-3 text-sm flex flex-col gap-1">
                  <span className="text-gray-400">Deanonymization successful using trusted auditor key.</span>
                  <span className="font-mono text-white mt-1">Real Identity: <span className="text-secondary font-bold tracking-wider">user_ax391@quantum-corp.gov</span></span>
                </div>
              ) : (
                <div className="text-sm text-gray-400">
                  Entity is shielded by Zero-Knowledge architecture. Origin is currently anonymous.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={closeModal}>Close</Button>
              <Button 
                variant="outline" 
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 disabled:opacity-50"
                onClick={handleDeanonymize}
                disabled={isDeanonymized}
              >
                <ShieldAlert className="h-4 w-4 mr-2" />
                {isDeanonymized ? "Identity Exposed" : "Deanonymize Data"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  )
}
