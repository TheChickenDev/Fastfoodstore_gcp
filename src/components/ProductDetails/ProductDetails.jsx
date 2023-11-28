import styles from './ProductDetails.module.scss';
import classNames from 'classnames/bind';
import * as productAPI from '../../services/productServices';
import * as userAPI from '../../services/userServices';
import { Fragment, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';
import Loading from '../../components/Loading';

const cx = classNames.bind(styles);

function PurchaseProduct({ isShow, productId }) {
    const [productDetails, setProductDetails] = useState();
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const getDetailsProduct = async () => {
        setIsLoading(true);
        const res = await productAPI.productGetDetails(productId);
        if (res) {
            await setProductDetails(res);
            setQuantity(1);
            setIsLoading(false);
            document.getElementsByClassName(cx('layer'))[0].style.display = 'flex';
        }
    };

    const handleChangeQuantity = (e) => {
        const value = e.target.value;
        if (value > 0 && value < 100) setQuantity(e.target.value);
    };

    const handleChangeQuantityClick = (isPlus) => {
        if (isPlus) setQuantity(quantity < 99 ? quantity + 1 : quantity);
        else setQuantity(quantity > 1 ? quantity - 1 : quantity);
    };

    const handleExitClick = () => {
        document.getElementsByClassName(cx('layer'))[0].style.display = 'none';
        setProductDetails({});
    };

    const handleAddToCartClick = async () => {
        setIsLoading(true);
        const access_token = localStorage.getItem('access_token');
        const decoded = jwtDecode(access_token);

        if (decoded?.id) {
            const data = {
                productId,
                name: productDetails.name,
                img: productDetails.img,
                quantity: parseInt(document.getElementsByClassName(cx('quantity-input'))[0].value),
                price: productDetails.price,
            };
            await userAPI
                .userAddToCart(decoded.id, data)
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

    useEffect(() => {
        if (productId) getDetailsProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isShow]);

    return (
        <Fragment>
            <div className={cx('layer')}>
                <div className={cx('wrapper')}>
                    <div className={cx('container')}>
                        <section className={cx('image')}>
                            <img src={productDetails?.img} alt="product" className={cx('details-img')} />
                        </section>
                        <section className={cx('details')}>
                            <div className={cx('details-text')}>
                                <h2 className={cx('details-name')}>{productDetails?.name}</h2>
                                <p className={cx('details-desc')}>{productDetails?.desc}</p>
                            </div>
                            <h4 className={cx('details-label')}>Số lượng phần ăn</h4>
                            <div className={cx('details-quantity')}>
                                <div className={cx('quantity-container')}>
                                    <button className={cx('minus')} onClick={() => handleChangeQuantityClick(false)}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    <input
                                        className={cx('quantity-input')}
                                        value={quantity}
                                        type="number"
                                        onChange={handleChangeQuantity}
                                    />
                                    <button className={cx('plus')} onClick={() => handleChangeQuantityClick(true)}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                                <h2 className={cx('quantity-price')}>
                                    {(productDetails?.price * quantity).toLocaleString()}
                                </h2>
                            </div>
                            <button className={cx('details-btn')} onClick={handleAddToCartClick}>
                                Thêm vào giỏ hàng
                            </button>
                        </section>
                    </div>
                    <button className={cx('exit')} onClick={handleExitClick}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
            </div>
            <Loading isLoading={isLoading} />
        </Fragment>
    );
}

export default PurchaseProduct;
