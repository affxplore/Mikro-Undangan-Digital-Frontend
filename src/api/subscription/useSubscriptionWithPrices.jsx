// src/api/subscription/useSubscriptionWithPrices.jsx

import { useCallback } from "react";
import { toast } from "react-toastify";
import apiService from "../apiService";
import { fromBackend, toBackend } from "./SubscriptionModel";

const API_URL = "/subscriptions";

export default function useSubscriptionWithPrices() {
  const createWithPrices = useCallback(async (data) => {
    try {
      console.log('Creating subscription with prices:', data);
      const payload = toBackend(data);
      
      // Additional validation before sending to backend
      if (!payload.prices || !Array.isArray(payload.prices) || payload.prices.length === 0) {
        throw new Error('Minimal satu harga harus ditambahkan');
      }

      // Validate price amounts
      for (const price of payload.prices) {
        if (!price.amount || isNaN(price.amount) || price.amount <= 0) {
          throw new Error('Semua harga harus berupa angka positif');
        }
        if (!['month', 'year'].includes(price.interval)) {
          throw new Error('Interval harga harus "month" atau "year"');
        }
      }

      const res = await apiService.post(`${API_URL}`, payload);
      return fromBackend(res.data.data);
    } catch (err) {
      console.error('Error creating subscription with prices:', err.response?.data);
      
      // Handle specific error types
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Check for error field first (new backend format)
        if (errorData.error) {
          throw new Error(errorData.error);
        }
        
        // Check for meta message
        if (errorData.meta?.message) {
          throw new Error(errorData.meta.message);
        }
        
        // Check for direct message
        if (errorData.message) {
          throw new Error(errorData.message);
        }
      }
      
      // If it's a validation error from frontend
      if (err.message && !err.response) {
        throw err;
      }
      
      throw new Error('Gagal membuat paket subscription. Silakan coba lagi.');
    }
  }, []);

  const updateWithPrices = useCallback(async (id, data) => {
    try {
      console.log('Updating subscription with prices:', id, data);
      
      if (!id) {
        throw new Error('ID subscription diperlukan untuk update');
      }
      
      const payload = toBackend(data);
      
      // Validate prices if provided
      if (payload.prices && Array.isArray(payload.prices)) {
        for (const price of payload.prices) {
          if (!price.amount || isNaN(price.amount) || price.amount <= 0) {
            throw new Error('Semua harga harus berupa angka positif');
          }
          if (!['month', 'year'].includes(price.interval)) {
            throw new Error('Interval harga harus "month" atau "year"');
          }
        }
      }

      const res = await apiService.put(`${API_URL}/${id}`, payload);
      return fromBackend(res.data.data);
    } catch (err) {
      console.error('Error updating subscription with prices:', err.response?.data);
      
      // Handle specific error types
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Check for error field first (new backend format)
        if (errorData.error) {
          throw new Error(errorData.error);
        }
        
        // Check for meta message
        if (errorData.meta?.message) {
          throw new Error(errorData.meta.message);
        }
        
        // Check for direct message
        if (errorData.message) {
          throw new Error(errorData.message);
        }
      }
      
      // If it's a validation error from frontend
      if (err.message && !err.response) {
        throw err;
      }
      
      throw new Error('Gagal mengupdate paket subscription. Silakan coba lagi.');
    }
  }, []);

  return {
    createWithPrices,
    updateWithPrices
  };
}