import styles from './UpdateProfile.module.scss';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Fragment, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';
import Loading from '../Loading';
import * as api from '../../services/userServices';
import defaultAvatar from '../../assets/images/avatar.png';

const cx = classNames.bind(styles);

const phoneRegExp = /^[0-9]{10}/;

const schema = yup
    .object({
        name: yup.string().required('Trường này không được bỏ trống'),
        phone: yup
            .string()
            .required('Trường này không được bỏ trống')
            .matches(phoneRegExp, 'Số điện thoại bao gồm 10 đến 11 ký tự số')
            .max(11, 'Số điện thoại bao gồm 10 đến 11 ký tự số'),
        address: yup.string().required('Trường này không được bỏ trống'),
        email: yup.string(),
        image: yup.mixed(),
    })
    .required();

function UpdateProfile() {
    const userInfo = useSelector((state) => state.user);
    const formRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

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
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', userInfo.email);
        formData.append('address', data.address);
        formData.append('phone', data.phone);
        formData.append('image', data.image[0]);

        const access_token = localStorage.getItem('access_token');

        const decoded = jwtDecode(access_token);

        if (decoded?.id) {
            handleUpdateUserDetails(decoded.id, formData);
        }
    };

    const handleUpdateUserDetails = async (id, formData) => {
        const res = await api.userUpdate(id, formData);
        if (res) dispatch(updateUser({ ...res.data }));
        setIsLoading(false);
        alert(res.message);
    };

    const onFileSelected = (event) => {
        var selectedFile = event.target.files[0];
        var reader = new FileReader();

        var imgtag = document.getElementById(cx('avatar'));
        imgtag.title = selectedFile.name;

        reader.onload = (event) => {
            imgtag.src = event.target.result;
        };

        reader.readAsDataURL(selectedFile);
    };

    const onNameChange = (e) => {
        setName(e.target.value);
    };

    const onAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const onPhoneChange = (e) => {
        setPhone(e.target.value);
    };

    return (
        <Fragment>
            <div className={cx('container')}>
                <h2 className={cx('title')}>Hồ sơ của tôi</h2>
                <hr />
                <form onSubmit={handleSubmit(onSubmit)} className={cx('form')} ref={formRef}>
                    <div className={cx('form-section')}>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Họ và tên: </label>
                            <input
                                className={cx('form-input')}
                                placeholder={userInfo?.name}
                                name="name"
                                {...register('name')}
                                autoComplete="off"
                                value={name}
                                onChange={onNameChange}
                            />
                            <p className={cx('form-validate-error')}>{errors.name?.message}</p>
                        </div>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Địa chỉ: </label>
                            <input
                                className={cx('form-input')}
                                placeholder={userInfo?.address}
                                name="address"
                                {...register('address')}
                                autoComplete="off"
                                value={address}
                                onChange={onAddressChange}
                            />
                            <p className={cx('form-validate-error')}>{errors.address?.message}</p>
                        </div>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Số điện thoại: </label>
                            <input
                                className={cx('form-input')}
                                placeholder={userInfo?.phone}
                                name="phone"
                                {...register('phone')}
                                autoComplete="off"
                                value={phone}
                                onChange={onPhoneChange}
                            />
                            <p className={cx('form-validate-error')}>{errors.phone?.message}</p>
                        </div>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Email: </label>
                            <input
                                className={cx('form-input')}
                                placeholder="Email"
                                name="email"
                                {...register('email')}
                                value={userInfo?.email}
                                readOnly
                            />
                        </div>
                        <input type="submit" value="Lưu" className={cx('form-submit')} />
                    </div>
                    <div className={cx('form-section')}>
                        <img src={userInfo?.avatar ? userInfo.avatar : defaultAvatar} alt="avatar" id={cx('avatar')} />
                        <div className={cx('form-group')}>
                            <input
                                type="file"
                                accept="image/png, image/jpg"
                                className={cx('form-input')}
                                name="image"
                                {...register('image')}
                                onChange={(e) => onFileSelected(e)}
                            />
                            <p className={cx('form-validate-error')}>{errors.avatar?.message}</p>
                        </div>
                    </div>
                </form>
            </div>
            <Loading isLoading={isLoading} />
        </Fragment>
    );
}

export default UpdateProfile;
