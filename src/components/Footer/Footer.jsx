import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { paths } from '../../routes';
import logo from '../../assets/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faThreads, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

function Footer() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        let decoded;
        if (access_token) decoded = jwtDecode(access_token);

        if (decoded?.isAdmin) {
            setIsAdmin(true);
        }
    }, []);

    return (
        <footer className={cx('footer')}>
            <div className={cx('footer-section')}>
                <div className={cx('footer-section-container')}>
                    <Link className={cx('footer-logo')} to={paths.home}>
                        <img src={logo} alt="logo" />
                    </Link>
                    <div className={cx('footer-info')}>
                        <p>Địa chỉ: 1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh.</p>
                        <p>Email: nvthanhnam121@gmail.com</p>
                        <p>+(092) 425-5384</p>
                    </div>
                </div>
            </div>
            {!isAdmin && (
                <div className={cx('footer-quicklinks')}>
                    <h4 className={cx('footer-title')}>Liên kết</h4>
                    <div className={cx('footer-links')}>
                        <Link className={cx('footer-link')} to={paths.home}>
                            Home page
                        </Link>
                        <Link className={cx('footer-link')} to={paths.menu}>
                            Menu
                        </Link>
                        <Link className={cx('footer-link')} to={paths.about}>
                            Về chúng tôi
                        </Link>
                        <Link className={cx('footer-link')} to={paths.contact}>
                            Liên hệ với chúng tôi
                        </Link>
                    </div>
                </div>
            )}
            <div className={cx('footer-time')}>
                <h4 className={cx('footer-title')}>Thời gian mở cửa</h4>
                <p className={cx('footer-timestamp')}>Thứ hai - thứ sáu: 8am - 18pm</p>
                <p className={cx('footer-timestamp')}>Thứ bảy & chủ nhật: 8am - 22pm</p>
                <div className={cx('footer-media')}>
                    <a
                        className={cx('footer-media-item')}
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.facebook.com/nam.nguyens.359"
                    >
                        <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a
                        className={cx('footer-media-item')}
                        target="_blank"
                        rel="noreferrer"
                        href="https://l.facebook.com/l.php?u=https%3A%2F%2Finstagram.com%2Faz_mylove_hein%3Figshid%3DMXcyaWQzbTh6bmNmcw%253D%253D%26fbclid%3DIwAR17M2bcmQAGw5HbsOr8HLIljCjgcZlozj6OnOIer3XKXZ8Lyac62mtG45U&h=AT0k1jr60R-IJujLjWEOe6gW3cXryFLqEBza_YUiJQSpGBHY5V5GcuN2-2CE4_I_cL69LR5RNKSITk8Xgqt5H0UnkUOviQHdiRoYaNo9ydTaDdjxhLZvkdpzaFOno78KX1EZKiaTXmHStHpgALqG_g"
                    >
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a
                        className={cx('footer-media-item')}
                        target="_blank"
                        rel="noreferrer"
                        href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.threads.net%2F%40az_mylove_hein%3Ffbclid%3DIwAR2ANu-aIuS8p995FiptWYoVins254u7SdVVOcZQ1Js9HnZfNFEt5fyH5nE&h=AT0k1jr60R-IJujLjWEOe6gW3cXryFLqEBza_YUiJQSpGBHY5V5GcuN2-2CE4_I_cL69LR5RNKSITk8Xgqt5H0UnkUOviQHdiRoYaNo9ydTaDdjxhLZvkdpzaFOno78KX1EZKiaTXmHStHpgALqG_g"
                    >
                        <FontAwesomeIcon icon={faThreads} />
                    </a>
                    <a
                        className={cx('footer-media-item')}
                        target="_blank"
                        rel="noreferrer"
                        href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.tiktok.com%2F%40hein140921%3F_t%3D8hDrbVOfkHJ%26_r%3D1%26fbclid%3DIwAR3ThwWaU0WN4QPzBk0Yq9XLJaz9SSBUDCxEC_1FKG5cocxzCGVm0i9Mhsk&h=AT0k1jr60R-IJujLjWEOe6gW3cXryFLqEBza_YUiJQSpGBHY5V5GcuN2-2CE4_I_cL69LR5RNKSITk8Xgqt5H0UnkUOviQHdiRoYaNo9ydTaDdjxhLZvkdpzaFOno78KX1EZKiaTXmHStHpgALqG_g"
                    >
                        <FontAwesomeIcon icon={faTiktok} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
