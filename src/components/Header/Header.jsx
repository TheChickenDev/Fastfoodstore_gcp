import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { paths } from '../../routes';
import { Fragment, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCartShopping, faMoneyCheckDollar, faUserAlt, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import logo from '../../assets/images/logo.png';
import * as api from '../../services/userServices';
import { resetUser } from '../../redux/slices/userSlice';
import { updateUser } from '../../redux/slices/userSlice';
import Loading from '../Loading';
import defaultAvatar from '../../assets/images/avatar.png';
import CartProductDetails from '../CartProductDetails';

const cx = classNames.bind(styles);

function Header() {
    const headerSectionRef = useRef();

    const userInfo = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState();

    const navigate = useNavigate();

    const handleOpenMenuClick = (e) => {
        e.preventDefault();
        headerSectionRef.current.classList.add(cx('active'));
        document.getElementsByClassName(cx('header-layer'))[0].classList.add(cx('active'));
    };

    const handleCloseMenuClick = (e) => {
        e.stopPropagation();
        headerSectionRef.current.classList.remove(cx('active'));
        document.getElementsByClassName(cx('header-layer'))[0].classList.remove(cx('active'));
        document.getElementsByClassName(cx('cart'))[0]?.classList.remove(cx('active'));
    };

    const handleAccountClick = (e) => {
        e.preventDefault();
        navigate(paths.profile);
    };

    const handleCartClick = (e) => {
        e.preventDefault();
        navigate(paths.payment);
    };

    const handleShowProductDetails = (e, productId) => {
        e.preventDefault();
        setSelectedProduct(productId);
        setShowProductDetails(false);
        setTimeout(() => {
            setShowProductDetails(true);
        });
    };

    const handleRemoveItemFromCart = async (e, productId) => {
        e.stopPropagation();
        setIsLoading(true);
        const access_token = localStorage.getItem('access_token');
        const decoded = jwtDecode(access_token);

        if (decoded?.id) {
            const data = {
                productId,
            };
            await api
                .userRemoveFromCart(decoded.id, data)
                .then(async (res) => {
                    if (res) dispatch(updateUser({ ...res.data }));
                    setIsLoading(false);
                    alert(res.message);
                })
                .catch((error) => {
                    alert(error.message);
                    setIsLoading(false);
                });
        }
    };

    const handleOpenCartClick = (e) => {
        e.preventDefault();
        document.getElementsByClassName(cx('cart'))[0].classList.toggle(cx('active'));
    };

    const handleCloseCartClick = (e) => {
        e.stopPropagation();
        document.getElementsByClassName(cx('cart'))[0].classList.remove(cx('active'));
    };

    const handleLogoutClick = (e) => {
        e.preventDefault();
        setIsLoading(true);
        api.userLogout()
            .then((res) => {
                setIsLoading(false);
                alert(res.message);
            })
            .catch((error) => {
                setIsLoading(false);
                alert(error.message);
            });
        dispatch(resetUser());
        localStorage.removeItem('access_token');
        navigate(paths.login);
    };

    const handleMyOrderClick = (e) => {
        e.preventDefault();
        navigate(paths.myOrders);
    };

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        let decoded;
        if (access_token) decoded = jwtDecode(access_token);

        if (decoded?.isAdmin) {
            setIsAdmin(true);
        }
    }, []);

    return (
        <Fragment>
            <header className={cx('header')}>
                <div className={cx('header-layer')}></div>
                <Link className={cx('header-logo')} to={paths.home}>
                    <img src={logo} alt="logo" />
                </Link>
                <button className={cx('header-button')} onClick={handleOpenMenuClick}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className={cx('header-section')} ref={headerSectionRef}>
                    {!isAdmin && (
                        <ul className={cx('header-items')}>
                            <li className={cx('header-item')}>
                                <Link
                                    to={localStorage.getItem('access_token') ? paths.menu : paths.login}
                                    onClick={handleCloseMenuClick}
                                >
                                    <p>Thực đơn</p>
                                </Link>
                            </li>
                            <li className={cx('header-item')}>
                                <Link to={paths.about} onClick={handleCloseMenuClick}>
                                    <p>Giới thiệu</p>
                                </Link>
                            </li>
                            <li className={cx('header-item')}>
                                <Link
                                    to={localStorage.getItem('access_token') ? paths.contact : paths.login}
                                    onClick={handleCloseMenuClick}
                                >
                                    <p>Liên hệ</p>
                                </Link>
                            </li>
                        </ul>
                    )}
                    {userInfo?.name ? (
                        <div className={cx('header-user')}>
                            <Link className={cx('header-user-avatar')} to={paths.profile}>
                                <img src={userInfo.avatar ? userInfo.avatar : defaultAvatar} alt="avatar" />
                                <div className={cx('header-popup')}>
                                    <p className={cx('header-user-name')}>{userInfo.name}</p>
                                    <hr />
                                    <div className={cx('header-popup-btns')}>
                                        <div className={cx('header-popup-btn')} onClick={handleAccountClick}>
                                            Tài khoản
                                        </div>
                                        {!isAdmin && (
                                            <div className={cx('header-popup-btn')} onClick={handleMyOrderClick}>
                                                Đơn hàng của tôi
                                            </div>
                                        )}
                                        <div className={cx('header-popup-btn')} onClick={handleLogoutClick}>
                                            Đăng xuất
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('header-btn-mobile')} onClick={handleLogoutClick}>
                                    Đăng xuất
                                </div>
                            </Link>
                            {!isAdmin && (
                                <div className={cx('header-user-cart')} onClick={handleOpenCartClick}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                    <span className={cx('header-user-cart-counter')}>{userInfo.cart?.length}</span>
                                    <div className={cx('cart')}>
                                        {userInfo.cart?.length > 0 ? (
                                            <Fragment>
                                                <button className={cx('cart-exit')} onClick={handleCloseCartClick}>
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                                <h4 className={cx('cart-label')}>Giỏ hàng</h4>
                                                <hr />
                                                <div className={cx('cart-container')}>
                                                    {userInfo.cart.map((item) => (
                                                        <button
                                                            className={cx('cart-item')}
                                                            onClick={(e) => handleShowProductDetails(e, item.productId)}
                                                        >
                                                            <div className={cx('cart-item-img')}>
                                                                <img src={item.img} alt="cart-item" />
                                                            </div>
                                                            <div className={cx('cart-item-text')}>
                                                                <div className={cx('cart-item-container')}>
                                                                    <h4 className={cx('cart-item-name')}>
                                                                        {item.name}
                                                                    </h4>
                                                                    <button
                                                                        className={cx('cart-item-btn')}
                                                                        onClick={(e) =>
                                                                            handleRemoveItemFromCart(e, item.productId)
                                                                        }
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                                <div className={cx('cart-item-container')}>
                                                                    <h4 className={cx('cart-item-quantity')}>
                                                                        SL: {item.quantity}
                                                                    </h4>
                                                                    <h4 className={cx('cart-item-price')}>
                                                                        {item.price.toLocaleString()} VND
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                                <button className={cx('cart-btn')} onClick={handleCartClick}>
                                                    Thanh toán &nbsp;
                                                    <FontAwesomeIcon icon={faMoneyCheckDollar} />
                                                </button>
                                            </Fragment>
                                        ) : (
                                            <h4 className={cx('cart-info')}>{'Mua hàng điii :<'}</h4>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={cx('header-login')}>
                            <div className={cx('header-login-icon')}>
                                <FontAwesomeIcon icon={faUserAlt} />
                            </div>
                            <div className={cx('header-login-btns')}>
                                <Link className={cx('header-login-btn')} to={paths.register}>
                                    Đăng ký
                                </Link>
                                <Link className={cx('header-login-btn')} to={paths.login}>
                                    Đăng nhập
                                </Link>
                            </div>
                        </div>
                    )}
                    <div className={cx('header-section-button')}>
                        <button onClick={handleCloseMenuClick}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                </div>
            </header>
            <Loading isLoading={isLoading} />
            <CartProductDetails isShow={showProductDetails} productId={selectedProduct} />
        </Fragment>
    );
}

export default Header;
