import styles from './MyOrders.module.scss';
import classNames from 'classnames/bind';
import { Fragment, useEffect, useState } from 'react';
import * as api from '../../services/orderServices';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes';

const cx = classNames.bind(styles);

function MyOrders() {
    const [renderList, setRenderList] = useState();

    const navigate = useNavigate();

    const getMyOrders = async (id) => {
        const res = await api.orderGetAll();
        if (res) {
            setRenderList(res.filter((order) => order.customerId === id));
        }
    };

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            navigate(paths.login);
            return;
        }
        const decoded = jwtDecode(access_token);
        if (decoded?.id) getMyOrders(decoded.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const convertDate = (date) => {
        const dateObj = new Date(date.toString());
        const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
        const formattedTime = `${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <Fragment>
            <div className={cx('wrapper')}>
                <div className={cx('table-container')}>
                    {renderList && renderList.length > 0 ? (
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>Số thứ tự</th>
                                    <th>Thời gian</th>
                                    <th>Món ăn đã đặt</th>
                                    <th>Tổng thanh toán</th>
                                    <th>Phương thức thanh toán</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderList.map(
                                    (order, index) =>
                                        !order.isAdmin && (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
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
                                            </tr>
                                        ),
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <h4 className={cx('message')}>Bạn không có đơn hàng nào!!! :|</h4>
                    )}
                </div>
            </div>
        </Fragment>
    );
}

export default MyOrders;
