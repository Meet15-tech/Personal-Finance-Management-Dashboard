import api from "./api";

export const getSavingsGoals = async () => {
    const response = await api.get("/savings");

    return response.data;
};

export const createSavingsGoal = async (
    goalData
) => {
    const response = await api.post(
        "/savings",
        goalData
    );

    return response.data;
};

export const updateSavingsGoal = async (
    goalId,
    goalData
) => {
    const response = await api.put(
        `/savings/${goalId}`,
        goalData
    );

    return response.data;
};

export const deleteSavingsGoal = async (
    goalId
) => {
    const response = await api.delete(
        `/savings/${goalId}`
    );

    return response.data;
};