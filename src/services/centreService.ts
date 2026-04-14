import axios from "axios"

const BASE_URL = "http://localhost:3003"

export type LogEntry = {
  id: string
  batchId: string
  verifierId: string
  result: "SUCCESS" | "FAILURE" | "ANOMALY"
  timestamp: string
}

export const centreService = {
  getLogs: async (): Promise<LogEntry[]> => {
    const response = await axios.get(`${BASE_URL}/logs`)
    return response.data
  }
}
