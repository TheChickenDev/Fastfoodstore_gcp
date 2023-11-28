import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import DefaultLayout from './components/DefaultLayout';
import { Fragment, useEffect } from 'react';
import { isJSONStr } from './utils/checkJSONStr';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from './redux/slices/userSlice';
import * as api from './services/userServices';
import * as request from './utils/userRequests';

function App() {
    const dispatch = useDispatch();

    request.axiosJWT.interceptors.request.use(
        async (config) => {
            const currentTime = new Date();
            const { decoded } = handleDecoded();
            if (decoded?.exp < currentTime.getTime() / 1000) {
                const data = await api.refreshToken();
                config.headers['token'] = `Bearer ${data?.access_token}`;
            }
            return config;
        },
        function (error) {
            return Promise.reject(error);
        },
    );

    const handleDecoded = () => {
        let localAccessToken = localStorage.getItem('access_token');
        let decoded = {};
        if (localAccessToken && isJSONStr(localAccessToken)) {
            localAccessToken = JSON.parse(localAccessToken);
            decoded = jwtDecode(localAccessToken);
        }
        return { decoded, localAccessToken };
    };

    const handleGetUserDetails = async (id, access_token) => {
        const res = await api.userGetDetails(id, access_token);
        if (res) {
            dispatch(updateUser({ ...res, access_token }));
        }
    };

    useEffect(() => {
        const { decoded, localAccessToken } = handleDecoded();
        if (decoded?.id) {
            handleGetUserDetails(decoded.id, localAccessToken);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {routes.map((item, index) => {
                        const Page = item.component;
                        const isDefault = item.isDefault;
                        const Layout = isDefault ? DefaultLayout : Fragment;

                        return (
                            <Route
                                key={index}
                                path={item.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
