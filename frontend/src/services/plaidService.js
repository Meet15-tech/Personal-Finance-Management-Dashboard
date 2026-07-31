import api from "./api";

export const createPlaidLinkToken = async () => {
    const response = await api.post(
        "/plaid/create-link-token"
    );

    return response.data;
};

export const exchangePlaidPublicToken = async (
    publicToken,
    metadata
) => {
    const response = await api.post(
        "/plaid/exchange-public-token",
        {
            publicToken,
            institutionId:
                metadata?.institution?.institution_id || "",
            institutionName:
                metadata?.institution?.name || "",
        }
    );

    return response.data;
};

export const getConnectedAccounts = async () => {
    const response = await api.get(
        "/plaid/accounts"
    );

    return response.data;
};

export const syncPlaidTransactions = async () => {
    const response = await api.post(
        "/plaid/sync-transactions"
    );

    return response.data;
};