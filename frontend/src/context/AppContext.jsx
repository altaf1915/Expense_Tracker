import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_URL });

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("expense_user")) || null;
  } catch {
    return null;
  }
};

const AppContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("expense_token") || "");
  const [user, setUser] = useState(getStoredUser);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const persistSession = (payload) => {
    localStorage.setItem("expense_token", payload.token);
    localStorage.setItem("expense_user", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem("expense_token");
    localStorage.removeItem("expense_user");
    setToken("");
    setUser(null);
    setIncomeData([]);
    setExpenseData([]);
    toast.info("Logged out successfully");
  };

  const request = async (callback, fallbackMessage) => {
    try {
      return await callback();
    } catch (error) {
      const message = error.response?.data?.message || fallbackMessage;
      toast.error(message);
      throw error;
    }
  };

  const register = async (form) =>
    request(async () => {
      const { data } = await api.post("/user/register", form);
      persistSession(data);
      toast.success(data.message);
      return data;
    }, "Registration failed");

  const login = async (form) =>
    request(async () => {
      const { data } = await api.post("/user/login", form);
      persistSession(data);
      toast.success(data.message);
      return data;
    }, "Login failed");

  const fetchIncome = useCallback(
    async (filters = {}) => {
      if (!token) return [];
      const { data } = await api.get("/user/get-income", { params: filters });
      setIncomeData(data.data || []);
      return data.data || [];
    },
    [token]
  );

  const fetchExpenses = useCallback(
    async (filters = {}) => {
      if (!token) return [];
      const { data } = await api.get("/user/get-expense", { params: filters });
      setExpenseData(data.data || []);
      return data.data || [];
    },
    [token]
  );

  const refreshTransactions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      await Promise.all([fetchIncome(), fetchExpenses()]);
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses, fetchIncome, token]);

  useEffect(() => {
    const loadTransactions = async () => {
      await refreshTransactions();
    };

    loadTransactions();
  }, [refreshTransactions]);

  const createTransaction = async (type, form) =>
    request(async () => {
      const endpoint = type === "income" ? "/user/add-income" : "/user/add-expense";
      const { data } = await api.post(endpoint, form);
      toast.success(data.message);
      await refreshTransactions();
      return data;
    }, "Unable to save transaction");

  const updateTransaction = async (type, id, form) =>
    request(async () => {
      const endpoint = type === "income" ? `/user/update-income/${id}` : `/user/update-expense/${id}`;
      const { data } = await api.put(endpoint, form);
      toast.success(data.message);
      await refreshTransactions();
      return data;
    }, "Unable to update transaction");

  const deleteTransaction = async (type, id) =>
    request(async () => {
      const endpoint = type === "income" ? `/user/delete-income/${id}` : `/user/delete-expense/${id}`;
      const { data } = await api.delete(endpoint);
      toast.success(data.message);
      await refreshTransactions();
      return data;
    }, "Unable to delete transaction");

  const value = {
    api,
    apiUrl: API_URL,
    token,
    user,
    isAuthenticated: Boolean(token),
    incomeData,
    expenseData,
    loading,
    login,
    logout,
    register,
    fetchIncome,
    fetchExpenses,
    refreshTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
