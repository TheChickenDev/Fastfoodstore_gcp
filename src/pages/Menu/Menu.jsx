import styles from './Menu.module.scss';
import classNames from 'classnames/bind';
import * as api from '../../services/productServices';
import { Fragment, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBlender,
    faBowlFood,
    faBowlRice,
    faBurger,
    faCake,
    faCartShopping,
    faCookieBite,
    faDrumstickBite,
    faList,
    faMagnifyingGlass,
    faMartiniGlassCitrus,
    faPizzaSlice,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes';
import ProductDetails from '../../components/ProductDetails';
import Loading from '../../components/Loading';

const cx = classNames.bind(styles);

function Menu() {
    const [filteredProducts, setFilteredProducts] = useState();
    const [products, setProducts] = useState();
    const [input, setInput] = useState('');
    const searchInputRef = useRef(null);
    const [typeIndex, setTypeIndex] = useState(0);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const getdata = async () => {
        setIsLoading(true);
        const res = await api.productGetAll();
        setProducts(res);
        setFilteredProducts(res);
        setIsLoading(false);
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        searchInputRef.current?.classList.toggle(cx('active'));
        searchInputRef.current?.focus();
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleFilterProducts = () => {
        const typeTags = document.getElementsByClassName(cx('type'));
        const typeStr = typeTags[typeIndex].querySelector('p').innerText;
        if (typeIndex !== 0)
            setFilteredProducts(
                products?.filter(
                    (product) => product.name.toLowerCase().includes(input.toLowerCase()) && product.type === typeStr,
                ),
            );
        else {
            setFilteredProducts(
                products?.filter((product) => product.name.toLowerCase().includes(input.toLowerCase())),
            );
        }
    };

    const handleShowProductDetails = (e, productId) => {
        e.preventDefault();
        setSelectedProduct(productId);
        setShowProductDetails(false);
        setTimeout(() => {
            setShowProductDetails(true);
        });
    };

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            navigate(paths.login);
            return;
        }
        getdata();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const typeActiveTag = document.getElementsByClassName(cx('type', 'active'));
        typeActiveTag[0]?.classList.remove(cx('active'));
        const typeTags = document.getElementsByClassName(cx('type'));
        typeTags[typeIndex]?.classList.add(cx('active'));
        handleFilterProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeIndex]);

    useEffect(() => {
        handleFilterProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

    return (
        <Fragment>
            <div className={cx('wrapper')}>
                <section className={cx('types')}>
                    <div className={cx('types-header')}>
                        <h4 className={cx('types-label')}>Thực đơn</h4>
                        <div className={cx('search')}>
                            <input
                                type="text"
                                className={cx('search-input')}
                                ref={searchInputRef}
                                value={input}
                                onChange={handleInputChange}
                            />
                            <button className={cx('search-btn')} onClick={handleSearchClick}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div className={cx('types-list')}>
                        <button className={cx('type')} onClick={() => setTypeIndex(0)}>
                            <FontAwesomeIcon icon={faList} />
                            <p className={cx('type-name')}>Tất cả</p>
                        </button>
                        <button className={cx('type')} onClick={() => setTypeIndex(1)}>
                            <FontAwesomeIcon icon={faPizzaSlice} />
                            <p className={cx('type-name')}>Pizza</p>
                        </button>
                        <button className={cx('type')} onClick={() => setTypeIndex(2)}>
                            <FontAwesomeIcon icon={faBurger} />
                            <p className={cx('type-name')}>Burger</p>
                        </button>
                        <button className={cx('type')} onClick={() => setTypeIndex(3)}>
                            <FontAwesomeIcon icon={faDrumstickBite} />
                            <p className={cx('type-name')}>Gà</p>
                        </button>
                        <button className={cx('type')} onClick={() => setTypeIndex(4)}>
                            <FontAwesomeIcon icon={faBowlRice} />
                            <p className={cx('type-name')}>Cơm</p>
                        </button>
                        <button className={cx('type')} onClick={() => setTypeIndex(5)}>
                            <FontAwesomeIcon icon={faBowlFood} />
                            <p className={cx('type-name')}>Mỳ Ý</p>
                        </button>
                        <button className={cx('type')} onClick={() => setTypeIndex(6)}>
                            <FontAwesomeIcon icon={faCake} />
                            <p className={cx('type-name')}>Bánh</p>
                        </button>
                        <button className={cx('type')} onClick={() => setTypeIndex(7)}>
                            <FontAwesomeIcon icon={faCookieBite} />
                            <p className={cx('type-name')}>Món Ăn Kèm</p>
                        </button>
                        <button className={cx('type')} onClick={() => setTypeIndex(8)}>
                            <FontAwesomeIcon icon={faMartiniGlassCitrus} />
                            <p className={cx('type-name')}>Thức Uống</p>
                        </button>
                        <button className={cx('type')} onClick={() => setTypeIndex(9)}>
                            <FontAwesomeIcon icon={faBlender} />
                            <p className={cx('type-name')}>Combo</p>
                        </button>
                    </div>
                </section>
                <section className={cx('products')}>
                    {filteredProducts?.map((product) => (
                        <div className={cx('product')}>
                            <img
                                src={product.img}
                                alt="product"
                                className={cx('product-img')}
                                onClick={(e) => handleShowProductDetails(e, product?._id)}
                            />
                            <p className={cx('product-name')}>{product.name}</p>
                            <p className={cx('product-desc')}>{product.desc}</p>
                            <p className={cx('product-price')}>{product.price.toLocaleString()} VND</p>
                            <button
                                className={cx('product-btn')}
                                onClick={(e) => handleShowProductDetails(e, product._id)}
                            >
                                <FontAwesomeIcon icon={faCartShopping} />
                            </button>
                        </div>
                    ))}
                </section>
            </div>
            <ProductDetails isShow={showProductDetails} productId={selectedProduct} />
            <Loading isLoading={isLoading} />
        </Fragment>
    );
}

export default Menu;
