import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import { homeImg } from '../../assets/images/home';
import { Fragment, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { paths } from '../../routes';
import { jwtDecode } from 'jwt-decode';
import UserManagement from '../../components/UserManagement';
import ProductManagement from '../../components/ProductManagement';
import Statistics from '../../components/Statistics';

const cx = classNames.bind(styles);

function Home() {
    const pcBannersRef = useRef();
    const mobileBannersRef = useRef();

    const bannerIndexRef = useRef(1);
    const [bannerIndex, setBannerIndex] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleChangeBanner = (e, isLeftBtn) => {
        e?.preventDefault();
        setBannerIndex(isLeftBtn ? 0 : 2);
    };

    const handleTransitionedEnd = () => {
        if (bannerIndexRef.current === 0) {
            pcBannersRef.current.prepend(pcBannersRef.current.lastElementChild);
            mobileBannersRef.current.prepend(mobileBannersRef.current.lastElementChild);
        } else {
            pcBannersRef.current.appendChild(pcBannersRef.current.firstElementChild);
            mobileBannersRef.current.appendChild(mobileBannersRef.current.firstElementChild);
        }
        pcBannersRef.current.style.transition = 'none';
        pcBannersRef.current.style.transform = 'translateX(0)';
        mobileBannersRef.current.style.transition = 'none';
        mobileBannersRef.current.style.transform = 'translateX(0)';
        setTimeout(() => {
            pcBannersRef.current.style.transition = 'transform linear 0.3s';
            mobileBannersRef.current.style.transition = 'transform linear 0.3s';
            setBannerIndex(1);
        });
    };

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        let decoded;
        if (access_token) decoded = jwtDecode(access_token);
        if (decoded?.isAdmin) {
            setIsAdmin(decoded.isAdmin);
        } else {
            pcBannersRef.current.addEventListener('transitionend', handleTransitionedEnd);
            mobileBannersRef.current.addEventListener('transitionend', handleTransitionedEnd);

            let isDragging = false;
            let changeToLeft = false;
            let startPos;
            mobileBannersRef.current.addEventListener('touchstart', (e) => {
                e.preventDefault();
                isDragging = true;
                startPos = e.touches[0].clientX;
            });
            mobileBannersRef.current.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const pos = e.touches[0].clientX;
                if (pos > startPos + 20) {
                    mobileBannersRef.current.style.transform = `translateX(${(pos - startPos) / 10}%)`;
                    changeToLeft = true;
                } else if (pos < startPos - 20) {
                    mobileBannersRef.current.style.transform = `translateX(${-(startPos - pos) / 10}%)`;
                    changeToLeft = false;
                }
            });
            mobileBannersRef.current.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (isDragging) {
                    handleChangeBanner(null, changeToLeft);
                }
                isDragging = false;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isAdmin) {
            if (bannerIndex !== 1) {
                bannerIndexRef.current = bannerIndex;
                const temp = bannerIndex === 0 ? 1 : -1;
                pcBannersRef.current.style.transform = `translateX(${temp * 33.33333}%)`;
                mobileBannersRef.current.style.transform = `translateX(${temp * 33.33333}%)`;
            }

            const timeOut = setTimeout(() => {
                setBannerIndex(2);
            }, 5000);
            return () => clearTimeout(timeOut);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bannerIndex]);

    // handle admin
    const [tabIndex, setTabIndex] = useState(0);

    const handleChangeTabClick = (e, tabIndex) => {
        e.preventDefault();
        setTabIndex(tabIndex);
    };

    useEffect(() => {
        document.getElementsByClassName(cx('tab-btn', 'active'))[0]?.classList.remove(cx('active'));
        document.getElementsByClassName(cx('tab-btn'))[tabIndex]?.classList.add(cx('active'));
    }, [tabIndex]);

    return (
        <div className={cx('wrapper')}>
            {!isAdmin ? (
                <Fragment>
                    <div className={cx('banner')}>
                        <div className={cx('banner-pc')} ref={pcBannersRef}>
                            <Link
                                to={localStorage.getItem('access_token') ? paths.menu : paths.login}
                                className={cx('banner-item-pc')}
                            >
                                <img src={homeImg.banner1} alt="banner" />
                            </Link>
                            <Link
                                to={localStorage.getItem('access_token') ? paths.menu : paths.login}
                                className={cx('banner-item-pc')}
                            >
                                <img src={homeImg.banner2} alt="banner" />
                            </Link>
                            <Link
                                to={localStorage.getItem('access_token') ? paths.menu : paths.login}
                                className={cx('banner-item-pc')}
                            >
                                <img src={homeImg.banner3} alt="banner" />
                            </Link>
                        </div>
                        <div className={cx('banner-mobile')} ref={mobileBannersRef}>
                            <Link
                                to={localStorage.getItem('access_token') ? paths.menu : paths.login}
                                className={cx('banner-item-mobile')}
                            >
                                <img src={homeImg.bannerMobile1} alt="banner" />
                            </Link>
                            <Link
                                to={localStorage.getItem('access_token') ? paths.menu : paths.login}
                                className={cx('banner-item-mobile')}
                            >
                                <img src={homeImg.bannerMobile2} alt="banner" />
                            </Link>
                            <Link
                                to={localStorage.getItem('access_token') ? paths.menu : paths.login}
                                className={cx('banner-item-mobile')}
                            >
                                <img src={homeImg.bannerMobile3} alt="banner" />
                            </Link>
                        </div>
                        <button className={cx('banner-left-btn')} onClick={(e) => handleChangeBanner(e, true)}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button className={cx('banner-right-btn')} onClick={(e) => handleChangeBanner(e, false)}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                    <div className={cx('buttons')}>
                        <Link
                            className={cx('button')}
                            to={localStorage.getItem('access_token') ? paths.menu : paths.login}
                        >
                            Đặt hàng ngay
                        </Link>
                    </div>
                </Fragment>
            ) : (
                <Fragment>
                    <div className={cx('admin-page')}>
                        <section className={cx('tab')}>
                            <button className={cx('tab-btn', 'active')} onClick={(e) => handleChangeTabClick(e, 0)}>
                                Khách hàng
                            </button>
                            <button className={cx('tab-btn')} onClick={(e) => handleChangeTabClick(e, 1)}>
                                Thực đơn
                            </button>
                            <button className={cx('tab-btn')} onClick={(e) => handleChangeTabClick(e, 2)}>
                                Đơn hàng
                            </button>
                        </section>
                        <section className={cx('content')}>
                            <UserManagement isShow={tabIndex === 0 && true} />
                            <ProductManagement isShow={tabIndex === 1 && true} />
                            <Statistics isShow={tabIndex === 2 && true} />
                        </section>
                    </div>
                </Fragment>
            )}
        </div>
    );
}

export default Home;
