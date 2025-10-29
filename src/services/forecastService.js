import api from "./api";

// Get demand forecast for a vehicle variant
// variantId: string (UUID), horizon: number (days)
export const getForecast = async (variantId, horizon = 14) => {
  const response = await api.get(`/forecast/${variantId}`, { params: { horizon } });
  return response.data;
};

// Retrain the forecast model for a vehicle variant
// variantId: string (UUID), horizon: number (days)
export const retrainForecast = async (variantId, horizon = 14) => {
  const response = await api.post(`/forecast/${variantId}/retrain`, null, { params: { horizon } });
  return response.data;
};
