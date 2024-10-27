import axios from 'axios';

export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Origin': window.location.origin
  }
});