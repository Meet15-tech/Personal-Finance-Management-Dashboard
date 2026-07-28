import api from "./api";

export const getFinancialSummary = async () => {
    const response = await api.get("/analytics/summary");
    return response.data;
};

export const getCategoryBreakdown = async (type = "expense", startDate, endDate) => {
    const response = await api.get("/analytics/category-breakdown", {
        params: { type, startDate, endDate },
    });
    return response.data;
};

export const getMonthlyTrend = async (year) => {
    const response = await api.get("/analytics/monthly-trend", {
        params: { year },
    });
    return response.data;
};

export const getPaymentMethodBreakdown = async () => {
    const response = await api.get("/analytics/payment-methods");
    return response.data;
};
