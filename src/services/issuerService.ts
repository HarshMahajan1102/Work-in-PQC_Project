import axios from "axios"

const BASE_URL = "http://localhost:3001"

export const issuerService = {
  issueCredential: async (data: { userId: string; role: string; level: string }) => {
    const response = await axios.post(`${BASE_URL}/issue`, data)
    return response.data
  },
  
  revokeCredential: async (data: { credentialId: string }) => {
    const response = await axios.post(`${BASE_URL}/revoke`, data)
    return response.data
  },
  
  createPolicy: async (data: { resourceId: string; requiredRole: string; requiredLevel: string }) => {
    const response = await axios.post(`${BASE_URL}/policy`, data)
    return response.data
  }
}
