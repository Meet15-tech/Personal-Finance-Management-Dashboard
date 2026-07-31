import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

import {
    createPlaidLinkToken,
    exchangePlaidPublicToken,
} from "../services/plaidService";

function PlaidLinkButton({
    onAccountConnected,
}) {
    const [linkToken, setLinkToken] = useState(null);
    const [loadingToken, setLoadingToken] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchLinkToken = useCallback(async () => {
        try {
            setLoadingToken(true);
            setError("");
            setMessage("");

            const response =
                await createPlaidLinkToken();

            if (!response?.success || !response.linkToken) {
                throw new Error(
                    response?.message ||
                    "Unable to initialize Plaid Link."
                );
            }

            setLinkToken(response.linkToken);
        } catch (requestError) {
            console.error(
                "Plaid Link Token Error:",
                requestError
            );

            setError(
                requestError.response?.data?.message ||
                requestError.message ||
                "Unable to initialize bank connection."
            );
        } finally {
            setLoadingToken(false);
        }
    }, []);

    useEffect(() => {
        fetchLinkToken();
    }, [fetchLinkToken]);

    const onSuccess = useCallback(
        async (publicToken, metadata) => {
            try {
                setConnecting(true);
                setError("");
                setMessage("");

                const response =
                    await exchangePlaidPublicToken(
                        publicToken,
                        metadata
                    );

                if (!response?.success) {
                    throw new Error(
                        response?.message ||
                        "Unable to connect bank account."
                    );
                }

                setMessage(
                    "Bank account connected successfully."
                );

                if (
                    typeof onAccountConnected ===
                    "function"
                ) {
                    await onAccountConnected(
                        response.data
                    );
                }

                // A Link token is short-lived and intended for one Link
                // session, so prepare a fresh token for another connection.
                await fetchLinkToken();
            } catch (requestError) {
                console.error(
                    "Plaid connection error:",
                    requestError
                );

                setError(
                    requestError.response?.data?.message ||
                    requestError.message ||
                    "Unable to connect bank account."
                );
            } finally {
                setConnecting(false);
            }
        },
        [fetchLinkToken, onAccountConnected]
    );

    const onExit = useCallback((linkError) => {
        if (linkError) {
            console.error(
                "Plaid Link Exit Error:",
                linkError
            );

            setError(
                linkError.display_message ||
                "Bank connection was not completed."
            );
        }
    }, []);

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess,
        onExit,
    });

    const handleOpenPlaid = () => {
        setError("");
        setMessage("");
        open();
    };

    return (
        <div className="plaid-link-wrapper">
            <button
                type="button"
                className="plaid-connect-button"
                onClick={handleOpenPlaid}
                disabled={
                    !ready ||
                    !linkToken ||
                    loadingToken ||
                    connecting
                }
            >
                {loadingToken
                    ? "Preparing Bank Connection..."
                    : connecting
                        ? "Connecting Bank..."
                        : "Connect Bank Account"}
            </button>

            {message && (
                <p className="plaid-success-message">
                    {message}
                </p>
            )}

            {error && (
                <div className="plaid-error-message">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={fetchLinkToken}
                        disabled={loadingToken}
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
}

export default PlaidLinkButton;