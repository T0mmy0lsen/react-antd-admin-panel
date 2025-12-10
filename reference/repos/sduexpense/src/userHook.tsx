// userHook.js

import { useMsal, useAccount } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { loginRequest } from './auth';

const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};

const useUserData = () => {

    const { instance } = useMsal();
    const account = useAccount();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (account) {
                try {
                    const response = await instance.acquireTokenSilent({
                        ...loginRequest,
                        account: account
                    });

                    const accessToken = response.accessToken;
                    const userResponse = await axios.get(graphConfig.graphMeEndpoint, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });

                    setUserData(userResponse.data);
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, [account, instance]);

    return { userData, loading };
};

export default useUserData;
