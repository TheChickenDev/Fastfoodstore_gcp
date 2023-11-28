import styles from './Payment.module.scss';
import classNames from 'classnames/bind';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';
import { jwtDecode } from 'jwt-decode';
import * as orderAPI from '../../services/orderServices';
import * as userAPI from '../../services/userServices';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes';

const cx = classNames.bind(styles);

function Payment() {
    const userInfo = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handlePaymentClick = async (e) => {
        e.preventDefault();
        if (userInfo.cart.length < 1) {
            alert('Vui lòng chọn món ăn trước khi thanh toán!');
            return;
        }
        setIsLoading(true);
        const currentTime = new Date();
        const radioBtns = document.getElementsByName('payment-method');
        let paymentMethod;
        for (let i = 0; i < radioBtns.length; i++) {
            if (radioBtns[i].checked) {
                paymentMethod = radioBtns[i].value;
                break;
            }
        }
        const access_token = localStorage.getItem('access_token');
        const decoded = jwtDecode(access_token);
        if (decoded?.id && paymentMethod) {
            const data = {
                customerId: decoded.id,
                date: currentTime,
                products: userInfo.cart,
                totalAmount: userInfo.cart.reduce((prev, curr) => prev + curr.price * curr.quantity, 0),
                note: document.getElementsByClassName(cx('info-note'))[0].value,
                paymentMethod,
                isCompleted: false,
            };
            await orderAPI
                .orderCreate(data)
                .then(async (res) => {
                    await userAPI
                        .userClearCart(decoded.id)
                        .then(async (res) => {
                            if (res) dispatch(updateUser({ ...res.data }));
                        })
                        .catch((error) => {});
                    setIsLoading(false);
                    alert(res.message);
                })
                .catch((error) => {
                    setIsLoading(false);
                    alert(error.message);
                });
        } else {
            alert('Vui lòng chọn phương thức thanh toán');
            setIsLoading(false);
        }
        document.getElementsByClassName(cx('info-note'))[0].value = '';
        for (let i = 0; i < radioBtns.length; i++) {
            if (radioBtns[i].checked) {
                radioBtns[i].checked = false;
                break;
            }
        }
    };

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
            <div className={cx('wrapper')}>
                <h2 className={cx('title')}>Thanh toán</h2>
                <hr />
                <section className={cx('container')}>
                    <div className={cx('cart')}>
                        <h2 className={cx('subtitle')}>Giỏ hàng</h2>
                        <hr />
                        {userInfo?.cart?.map((item) => (
                            <div className={cx('cart-item')}>
                                <div className={cx('cart-item-img')}>
                                    <img src={item.img} alt="cart-item" />
                                </div>
                                <div className={cx('cart-item-text')}>
                                    <h4 className={cx('cart-item-name')}>{item.name}</h4>
                                    <div className={cx('cart-item-container')}>
                                        <h4 className={cx('cart-item-quantity')}>SL: {item.quantity}</h4>
                                        <h4 className={cx('cart-item-price')}>{item.price.toLocaleString()} VND</h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={cx('info')}>
                        <h2 className={cx('subtitle')}>Thông tin thanh toán</h2>
                        <hr />
                        <p className={cx('info-name')}>Khách hàng: {userInfo?.name}</p>
                        <p className={cx('info-phone')}>Số điện thoại: {userInfo?.phone}</p>
                        <p className={cx('info-address')}>Địa chỉ giao hàng: {userInfo?.address}</p>
                        <h4 className={cx('info-label')}>Ghi chú</h4>
                        <textarea
                            className={cx('info-note')}
                            maxLength="150"
                            cols="50"
                            rows="3"
                            placeholder="Để lại lời nhắn cho shipper..."
                        ></textarea>
                        <h4 className={cx('info-label')}>Phương thức thanh toán</h4>
                        <div className={cx('payment-methods')}>
                            <input type="radio" id="cod" name="payment-method" value="COD" />
                            &nbsp;
                            <label for="cod">COD</label>
                            <br />
                            <input type="radio" id="momo" name="payment-method" value="Momo" />
                            &nbsp;
                            <label for="momo">Momo</label>
                            <br />
                            <input type="radio" id="bank" name="payment-method" value="Bank" />
                            &nbsp;
                            <label for="bank">Chuyển khoản qua ngân hàng</label>
                        </div>
                        <button className={cx('info-btn')} onClick={handlePaymentClick}>
                            Thanh toán
                        </button>
                    </div>
                </section>
            </div>
            <Loading isLoading={isLoading} />
        </Fragment>
    );
}

export default Payment;
