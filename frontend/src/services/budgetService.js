import api from "./api";

export const getBudgets = async (params = {}) => {
    const response = await api.get("/budgets", {
        params,
    });

    return response.data;
};

export const createBudget = async (budgetData) => {
    const response = await api.post(
        "/budgets",
        budgetData
    );

    return response.data;
};

export const updateBudget = async (
    budgetId,
    budgetData
) => {
    const response = await api.put(
        `/budgets/${budgetId}`,
        budgetData
    );

    return response.data;
};

export const deleteBudget = async (budgetId) => {
    const response = await api.delete(
        `/budgets/${budgetId}`
    );

    return response.data;
};