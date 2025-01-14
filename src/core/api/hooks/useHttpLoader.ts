import { useState } from 'react';
import { AxiosError } from 'axios';

const useHttpLoader = (defaultState = false) => {
    const [loading, setLoading] = useState(defaultState);

    const wait = async <T>(
        requestMethodPromise: Promise<T>,
        onLoad?: (v: T) => unknown,
        onError?: (err: AxiosError) => unknown
    ): Promise<T> => {
        setLoading(true);

        try {
            const r = await requestMethodPromise;
            let resp = null;

            if (onLoad) {
                resp = onLoad(r);
            }
            setLoading(false);
            return resp;
        } catch (err_1) {
            let resp_1 = null;

            if (onError) {
                resp_1 = onError(err_1);
            }
            setLoading(false);
            return resp_1;
        }
    };

    return { loading, wait };
};

export default useHttpLoader;
