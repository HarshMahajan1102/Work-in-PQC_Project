import axios from "axios"

const BASE_URL = "http://localhost:3002"

export const verifierService = {
  verifyProof: async (proofJson: any) => {
    const response = await axios.post(`${BASE_URL}/verify`, proofJson)
    return response.data
  }
}
