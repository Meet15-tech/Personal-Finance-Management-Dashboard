import api from "./api";

export const getReportSummary = async () => {
    const response = await api.get("/reports/summary");
    return response.data;
};

export const getReportCategoryBreakdown = async (
    type = "expense"
) => {
    const response = await api.get(
        "/reports/category-breakdown",
        {
            params: { type },
        }
    );

    return response.data;
};

export const getReportMonthlyTrend = async (year) => {
    const response = await api.get("/reports/monthly-trend", {
        params: { year },
    });

    return response.data;
};

export const getReportPaymentMethods = async () => {
    const response = await api.get("/reports/payment-methods");
    return response.data;
};