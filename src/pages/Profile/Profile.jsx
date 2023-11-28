import { Fragment, useEffect } from 'react';
import UpdateProfile from '../../components/UpdateProfile';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes';

function Profile() {
    const navigate = useNavigate();

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            navigate(paths.login);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Fragment>
            <UpdateProfile />
        </Fragment>
    );
}

export default Profile;
