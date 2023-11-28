import { Fragment, useEffect, useRef, useState } from 'react';
import styles from './UserManagement.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import * as api from '../../services/userServices';
import defaultAvatar from '../../assets/images/avatar.png';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Loading';

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

function UserManagement({ isShow }) {
    const [list, setList] = useState();
    const [selectedUser, setSelectedUser] = useState();

    const formRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

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
        formData.append('email', selectedUser.email);
        formData.append('address', data.address);
        formData.append('phone', data.phone);
        formData.append('image', data.image[0]);

        if (selectedUser?._id) {
            handleUpdateUserDetails(selectedUser._id, formData);
        }
    };

    const handleUpdateUserDetails = async (id, formData) => {
        const res = await api.userUpdate(id, formData);
        setIsLoading(false);
        getUser();
        alert(res.message);
        setShowUpdate(false);
    };

    useEffect(() => {
        if (isShow) document.getElementsByClassName(cx('wrapper'))[0].classList.add(cx('active'));
        else document.getElementsByClassName(cx('wrapper'))[0].classList.remove(cx('active'));
    }, [isShow]);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        const res = await api.userGetAll();
        if (res) setList(res);
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

    const handleShowUpdate = async (userId) => {
        setIsLoading(true);
        let access_token = localStorage.getItem('access_token');
        access_token = JSON.parse(access_token);
        const res = await api.userGetDetails(userId, access_token);
        await setSelectedUser(res);
        setShowUpdate(true);
    };

    const handleHideUpdate = () => {
        setShowUpdate(false);
    };

    const handleDeleteUser = async (id) => {
        setIsLoading(true);
        await api
            .userDelete(id)
            .then((res) => {
                alert(res.message);
                getUser();
                setIsLoading(false);
            })
            .catch((error) => {
                alert(error.message);
                getUser();
                setIsLoading(false);
            });
    };

    useEffect(() => {
        formRef.current.reset();
        setName('');
        setPhone('');
        setAddress('');
        if (showUpdate) {
            document.getElementsByClassName(cx('update'))[0].classList.add(cx('active'));
            setIsLoading(false);
        } else {
            document.getElementsByClassName(cx('update'))[0].classList.remove(cx('active'));
            setIsLoading(false);
        }
    }, [showUpdate]);

    return (
        <Fragment>
            <div className={cx('wrapper')}>
                <div className={cx('table-container')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Tên</th>
                                <th>Địa chỉ</th>
                                <th>Số điện thoại</th>
                                <th>Avatar</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list &&
                                list.map(
                                    (user, index) =>
                                        !user.isAdmin && (
                                            <tr key={index}>
                                                <td>{user.email}</td>
                                                <td>{user.name}</td>
                                                <td>{user.address}</td>
                                                <td>{user.phone}</td>
                                                <td className={cx('avatar')}>
                                                    <img src={user.avatar ? user.avatar : defaultAvatar} alt="avatar" />
                                                </td>
                                                <td className={cx('method')}>
                                                    <button
                                                        className={cx('method-btn')}
                                                        onClick={() => handleShowUpdate(user._id)}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        className={cx('method-btn')}
                                                        onClick={() => handleDeleteUser(user._id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ),
                                )}
                        </tbody>
                    </table>
                </div>
                <div className={cx('update')}>
                    <form onSubmit={handleSubmit(onSubmit)} className={cx('form')} ref={formRef}>
                        <button className={cx('update-close')} onClick={handleHideUpdate}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <div className={cx('form-section')}>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>Họ và tên: </label>
                                <input
                                    className={cx('form-input')}
                                    placeholder={selectedUser?.name}
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
                                    placeholder={selectedUser?.address}
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
                                    placeholder={selectedUser?.phone}
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
                                    placeholder={selectedUser?.email}
                                    name="email"
                                    {...register('email')}
                                    readOnly
                                />
                            </div>
                            <input type="submit" value="Lưu" className={cx('form-submit')} />
                        </div>
                        <div className={cx('form-section')}>
                            <img
                                src={selectedUser?.avatar ? selectedUser.avatar : defaultAvatar}
                                alt="avatar"
                                id={cx('avatar')}
                            />
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
            </div>
            <Loading isLoading={isLoading} />
        </Fragment>
    );
}

export default UserManagement;
