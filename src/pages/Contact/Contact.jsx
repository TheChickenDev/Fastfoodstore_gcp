import styles from './Contact.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes';

const cx = classNames.bind(styles);

const schema = yup
    .object({
        email: yup.string().required('Trường này không được bỏ trống').email('Email không hợp lệ'),
        name: yup.string().required('Trường này không được bỏ trống'),
        content: yup.string().required('Trường này không được bỏ trống').min(10, 'Vui lòng nhập ít nhất 10 ký tự'),
    })
    .required();

function Contact() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const form = useRef();

    const navigate = useNavigate();

    function onSubmit(data) {
        emailjs.sendForm('service_b93xz6h', 'template_zp6hnjv', form.current, 'Kr34vRZ3aczdIbbZS').then(
            (result) => {
                alert(result.text);
            },
            (error) => {
                alert(error.text);
            },
        );
        form.current.reset();
    }

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            navigate(paths.login);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Liên hệ</h2>
            <hr />
            <div className={cx('container')}>
                <div className={cx('section')}>
                    <h3 className={cx('subtitle')}>Thông tin liên hệ</h3>
                    <span className={cx('text-info')}>
                        <b>
                            <FontAwesomeIcon icon={faMap} />
                            &nbsp; Địa chỉ:
                        </b>
                        <p>Số 1 Võ Văn Ngân, Phường Linh Chiểu, TP.Thủ Đ, TP.Hồ Chí Minh</p>
                    </span>
                    <span className={cx('text-info')}>
                        <b>
                            <FontAwesomeIcon icon={faPhone} />
                            &nbsp; Điện thoại:
                        </b>
                        <p>+(092) 425 5384</p>
                    </span>
                    <span className={cx('text-info')}>
                        <b>
                            <FontAwesomeIcon icon={faEnvelope} />
                            &nbsp; Email:
                        </b>
                        <p>nvthanhnam121@gmail.com</p>
                    </span>
                </div>
                <div className={cx('section')}>
                    <h3 className={cx('subtitle')}>Gửi tin nhắn cho chúng tôi</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className={cx('form-login')} ref={form}>
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
                                className={cx('form-input')}
                                placeholder="Họ và tên"
                                {...register('name')}
                                autoComplete="off"
                            />
                            <p className={cx('form-validate-error')}>{errors.name?.message}</p>
                        </div>
                        <div className={cx('form-group')}>
                            <textarea
                                rows="10"
                                className={cx('form-input')}
                                placeholder="Nhập nội dung"
                                {...register('content')}
                                autoComplete="off"
                            ></textarea>
                            <p className={cx('form-validate-error')}>{errors.content?.message}</p>
                        </div>
                        <input type="submit" value="Gửi" className={cx('form-submit')} />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;
