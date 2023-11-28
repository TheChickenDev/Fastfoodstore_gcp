import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import * as api from '../../services/userServices';
import Loading from '../../components/Loading';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';
import { Link } from 'react-router-dom';
import { paths } from '../../routes';

const cx = classNames.bind(styles);

const passwordRegExp = /^[a-zA-Z0-9]*$/;

const schema = yup
    .object({
        email: yup.string().required('Trường này không được bỏ trống').email('Email không hợp lệ'),
        password: yup
            .string()
            .required('Trường này không được bỏ trống')
            .matches(passwordRegExp, 'Mật khẩu không được chứa ký tự đặc biệt'),
    })
    .required();

function Login() {
    const navigate = useNavigate();

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        setIsLoading(true);
        api.userLogin(data.email, data.password)
            .then((res) => {
                if (res.message === 'LOGIN SUCCESS') {
                    navigate('/');
                    localStorage.setItem('access_token', JSON.stringify(res?.access_token));
                    if (res?.access_token) {
                        const decoded = jwtDecode(res?.access_token);
                        if (decoded?.id) {
                            handleGetUserDetails(decoded.id, res.access_token);
                        }
                    }
                } else alert(res.message);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                alert(error.message);
            });
    };

    const handleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    const handleGetUserDetails = async (id, access_token) => {
        const res = await api.userGetDetails(id, access_token);
        if (res) dispatch(updateUser({ ...res, access_token }));
    };

    return (
        <Fragment>
            <div className={cx('wrapper')}>
                <form onSubmit={handleSubmit(onSubmit)} className={cx('form-login')}>
                    <h1 className={cx('form-heading')}>ĐĂNG NHẬP</h1>
                    <div className={cx('form-group')}>
                        <input
                            className={cx('form-input')}
                            placeholder="Email"
                            {...register('email')}
                            autoComplete="off"
                        />
                        <p className={cx('form-validate-error')}>{errors.email?.message}</p>
                    </div>
                    <div className={cx('form-group')}>
                        <input
                            type={!isShowPassword ? 'password' : 'text'}
                            className={cx('form-input')}
                            placeholder="Mật khẩu"
                            {...register('password')}
                            autoComplete="off"
                        />
                        <div id={cx('eye')} onClick={handleShowPassword}>
                            <FontAwesomeIcon icon={faEye} />
                        </div>
                        <p className={cx('form-validate-error')}>{errors.password?.message}</p>
                    </div>
                    <input type="submit" value="Đăng nhập" className={cx('form-submit')} />
                    <Link className={cx('form-redirect')} to={paths.register}>
                        Chưa có tài khoản?
                    </Link>
                </form>
            </div>
            <Loading isLoading={isLoading} />
        </Fragment>
    );
}

export default Login;
