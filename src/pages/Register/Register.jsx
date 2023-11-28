import styles from './Register.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import * as yup from 'yup';
import * as api from '../../services/userServices';
import { Link } from 'react-router-dom';
import { paths } from '../../routes';

const cx = classNames.bind(styles);

const phoneRegExp = /^[0-9]{10}/;
const passwordRegExp = /^[a-zA-Z0-9]*$/;

const schema = yup
    .object({
        name: yup.string().required('Trường này không được bỏ trống'),
        phone: yup
            .string()
            .required('Trường này không được bỏ trống')
            .matches(phoneRegExp, 'Số điện thoại bao gồm 10 đến 11 ký tự số')
            .max(11, 'Số điện thoại bao gồm 10 đến 11 ký tự số'),
        address: yup.string().required('Trường này không được bỏ trống'),
        email: yup.string().required('Trường này không được bỏ trống').email('Email không hợp lệ'),
        password: yup
            .string()
            .required('Trường này không được bỏ trống')
            .matches(passwordRegExp, 'Mật khẩu không được chứa ký tự đặc biệt')
            .min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự'),
        rePassword: yup
            .string()
            .required('Trường này không được bỏ trống')
            .matches(passwordRegExp, 'Mật khẩu không được chứa ký tự đặc biệt')
            .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp'),
        image: yup.mixed(),
    })
    .required();

function Register() {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowRePassword, setIsShowRePassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    function onSubmit(data) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('address', data.address);
        formData.append('phone', data.phone);
        formData.append('image', data.image[0]);
        api.userRegister(formData)
            .then((res) => {
                setIsLoading(false);
                alert(res.message);
                if (res.message === 'CREATE SUCCESS') navigate('/sign-in');
            })
            .catch((error) => {
                setIsLoading(false);
                alert(error.message);
            });
    }

    function handleShowPassword() {
        setIsShowPassword(!isShowPassword);
    }

    function handleShowRePassword() {
        setIsShowRePassword(!isShowRePassword);
    }

    return (
        <Fragment>
            <div className={cx('wrapper')}>
                <form onSubmit={handleSubmit(onSubmit)} className={cx('form-login')}>
                    <h1 className={cx('form-heading')}>ĐĂNG KÝ</h1>
                    <div className={cx('form-group')}>
                        <input
                            className={cx('form-input')}
                            placeholder="Họ & tên"
                            name="name"
                            {...register('name')}
                            autoComplete="off"
                        />
                        <p className={cx('form-validate-error')}>{errors.name?.message}</p>
                    </div>
                    <div className={cx('form-group')}>
                        <input
                            className={cx('form-input')}
                            placeholder="Số điện thoại"
                            name="phone"
                            {...register('phone')}
                            autoComplete="off"
                        />
                        <p className={cx('form-validate-error')}>{errors.phone?.message}</p>
                    </div>
                    <div className={cx('form-group')}>
                        <input
                            className={cx('form-input')}
                            placeholder="Địa chỉ"
                            name="address"
                            {...register('address')}
                            autoComplete="off"
                        />
                        <p className={cx('form-validate-error')}>{errors.address?.message}</p>
                    </div>
                    <div className={cx('form-group')}>
                        <input
                            className={cx('form-input')}
                            placeholder="Email"
                            name="email"
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
                            name="password"
                            {...register('password')}
                            autoComplete="off"
                        />
                        <div id={cx('eye')} onClick={handleShowPassword}>
                            <FontAwesomeIcon icon={faEye} />
                        </div>
                        <p className={cx('form-validate-error')}>{errors.password?.message}</p>
                    </div>
                    <div className={cx('form-group')}>
                        <input
                            type={!isShowRePassword ? 'password' : 'text'}
                            className={cx('form-input')}
                            placeholder="Nhập lại mật khẩu"
                            {...register('rePassword')}
                            autoComplete="off"
                        />
                        <div id={cx('eye')} onClick={handleShowRePassword}>
                            <FontAwesomeIcon icon={faEye} />
                        </div>
                        <p className={cx('form-validate-error')}>{errors.rePassword?.message}</p>
                    </div>
                    <div className={cx('form-group')}>
                        <input
                            type="file"
                            accept="image/png, image/jpg"
                            className={cx('form-input')}
                            name="image"
                            {...register('image')}
                        />
                    </div>
                    <input type="submit" value="Đăng ký" className={cx('form-submit')} />
                    <Link className={cx('form-redirect')} to={paths.login}>
                        Đã có tài khoản?
                    </Link>
                </form>
            </div>
            <Loading isLoading={isLoading} />
        </Fragment>
    );
}

export default Register;
