import { Fragment, useEffect, useState } from 'react';
import styles from './Statistics.module.scss';
import classNames from 'classnames/bind';
import * as orderAPI from '../../services/orderServices';
import * as userAPI from '../../services/userServices';
import Loading from '../Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Statistics({ isShow }) {
    const [list, setList] = useState();
    const [renderList, setRenderList] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [filterYearList, setFilterYearList] = useState();

    const [filterYear, setFilterYear] = useState();
    const [filterMonth, setFilterMonth] = useState();
    const [totalAmount, setTotalAmount] = useState(0);

    const [selectedUser, setSelectedUser] = useState();
    const [selectedOrder, setSelectedOrder] = useState();
    const [showDetails, setShowDetails] = useState(false);

    const getOrders = async () => {
        const res = await orderAPI.orderGetAll();
        if (res) {
            setRenderList(res);
            setList(res);
        }
    };

    const handleConfirmClick = async (orderId) => {
        setIsLoading(true);
        await orderAPI
            .orderConfirm(orderId)
            .then((res) => {
                alert(res.message);
                setIsLoading(false);
            })
            .catch((error) => {
                alert(error.message);
                setIsLoading(false);
            });
        getOrders();
    };

    const handleShowDetailsClick = async (userId, orderId) => {
        setIsLoading(true);
        let access_token = localStorage.getItem('access_token');
        console.log(access_token);
        if (access_token) {
            access_token = JSON.parse(access_token);
            await userAPI
                .userGetDetails(userId, access_token)
                .then((res) => {
                    setSelectedOrder(list.find((order) => order._id === orderId));
                    setIsLoading(false);
                    setSelectedUser(res);
                    setShowDetails(true);
                })
                .catch((error) => {
                    alert(error.message);
                    setIsLoading(false);
                });
        }
    };

    const handleCloseDetailsClick = (e) => {
        e.preventDefault();
        setShowDetails(false);
    };

    const handleChangeYear = () => {
        setFilterYear(document.getElementsByName('year')[0].value);
    };

    const handleChangeMonth = () => {
        setFilterMonth(document.getElementsByName('month')[0].value);
    };

    const convertDate = (date) => {
        const dateObj = new Date(date.toString());
        const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
        const formattedTime = `${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;
        return `${formattedDate} ${formattedTime}`;
    };

    useEffect(() => {
        if (showDetails) {
            document.getElementsByClassName(cx('details'))[0]?.classList.add(cx('active'));
        } else {
            document.getElementsByClassName(cx('details'))[0]?.classList.remove(cx('active'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showDetails]);

    useEffect(() => {
        if (isShow) document.getElementsByClassName(cx('wrapper'))[0].classList.add(cx('active'));
        else document.getElementsByClassName(cx('wrapper'))[0].classList.remove(cx('active'));
    }, [isShow]);

    useEffect(() => {
        let temp = [];
        if (filterYear !== 'all') {
            temp = list?.filter((order) => {
                const dateObj = new Date(order.date.toString());
                const year = dateObj.getFullYear();
                return year.toString() === filterYear;
            });
        } else {
            temp = list;
        }
        if (filterMonth !== 'all') {
            temp = temp?.filter((order) => {
                const dateObj = new Date(order.date.toString());
                const month = dateObj.getMonth() + 1;
                return month.toString() === filterMonth;
            });
        }
        setRenderList(temp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterMonth, filterYear]);

    useEffect(() => {
        setTotalAmount(
            renderList?.reduce((prev, curr) => {
                if (curr.isCompleted) return prev + curr.totalAmount;
                return prev;
            }, 0),
        );
    }, [renderList]);

    useEffect(() => {
        getOrders();
        const currentYear = new Date().getFullYear();
        let temp = [];
        for (let i = 0; i <= 10; i++) temp.push(currentYear - i);
        setFilterYearList(temp);
        setFilterYear('all');
        setFilterMonth('all');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Fragment>
            <div className={cx('wrapper')}>
                <div className={cx('statistics')}>
                    <label for="year">Năm: </label>
                    <select id="year" name="year" onChange={handleChangeYear}>
                        <option value="all">All</option>
                        {filterYearList?.map((year) => (
                            <option value={year}>{year}</option>
                        ))}
                    </select>
                    &nbsp;&nbsp;&nbsp;
                    <label for="month">Tháng: </label>
                    <select id="month" name="month" onChange={handleChangeMonth}>
                        <option value="all">All</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                            <option value={month}>{month}</option>
                        ))}
                    </select>
                    &nbsp;&nbsp;&nbsp;
                    <p>Tổng doanh số: {totalAmount?.toLocaleString()} VND</p>
                </div>
                <div className={cx('table-container')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Mã khách hàng</th>
                                <th>Thời gian</th>
                                <th>Món ăn đã đặt</th>
                                <th>Tổng thanh toán</th>
                                <th>Phương thức thanh toán</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderList &&
                                renderList.map(
                                    (order, index) =>
                                        !order.isAdmin && (
                                            <tr key={index}>
                                                <td>{order.customerId}</td>
                                                <td>{convertDate(order.date)}</td>
                                                <td>
                                                    {order.products.reduce(
                                                        (prev, curr) => prev + curr.name + ' x ' + curr.quantity + ', ',
                                                        '',
                                                    )}
                                                </td>
                                                <td>{order.totalAmount.toLocaleString()} VND</td>
                                                <td>{order.paymentMethod}</td>
                                                <td>{order.isCompleted ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                                <td>
                                                    <div className={cx('method')}>
                                                        <button
                                                            className={
                                                                !order.isCompleted
                                                                    ? cx('method-btn', 'active')
                                                                    : cx('method-btn')
                                                            }
                                                            onClick={() => handleConfirmClick(order._id)}
                                                            disabled={order.isCompleted ? true : false}
                                                        >
                                                            Xác nhận
                                                        </button>
                                                        <button
                                                            className={cx('method-btn', 'active')}
                                                            onClick={() =>
                                                                handleShowDetailsClick(order.customerId, order._id)
                                                            }
                                                        >
                                                            Xem chi tiết
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                )}
                        </tbody>
                    </table>
                </div>
                <div className={cx('details')}>
                    <div className={cx('details-container')}>
                        <button className={cx('details-exit')} onClick={handleCloseDetailsClick}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <div className={cx('cart')}>
                            <h2 className={cx('subtitle')}>Giỏ hàng</h2>
                            <hr />
                            {selectedOrder?.products?.map((item) => (
                                <div className={cx('cart-item')}>
                                    <p className={cx('cart-item-name')}>{item.name}</p>
                                    <div className={cx('cart-item-container')}>
                                        <p className={cx('cart-item-quantity')}>SL: {item.quantity}</p>
                                        <p className={cx('cart-item-price')}>{item.price.toLocaleString()} VND</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={cx('info')}>
                            <h2 className={cx('subtitle')}>Thông tin thanh toán</h2>
                            <hr />
                            <p className={cx('info-name')}>
                                Khách hàng: <b>{selectedUser?.name}</b>
                            </p>
                            <p className={cx('info-phone')}>
                                Số điện thoại: <b>{selectedUser?.phone}</b>
                            </p>
                            <p className={cx('info-address')}>
                                Địa chỉ giao hàng: <b>{selectedUser?.address}</b>
                            </p>
                            <p className={cx('info-address')}>
                                Phương thức thanh toán: <b>{selectedOrder?.paymentMethod}</b>
                            </p>
                            <p className={cx('info-address')}>
                                Trạng thái: <b>{selectedOrder?.isCompleted ? 'Đã thanh toán' : 'Chưa thanh toán'}</b>
                            </p>
                            <p className={cx('info-address')}>
                                Lời nhắn của khách hàng: <b>{selectedOrder?.note || '...'}</b>
                            </p>
                            <p className={cx('info-address')}>
                                Tổng thanh toán:&nbsp;
                                <b>
                                    {selectedOrder?.products.reduce(
                                        (prev, curr) => prev + curr.price * curr.quantity,
                                        0,
                                    )}
                                </b>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Loading isLoading={isLoading} />
        </Fragment>
    );
}

export default Statistics;
