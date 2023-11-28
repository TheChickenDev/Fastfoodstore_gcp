import { Fragment, useEffect, useRef, useState } from 'react';
import styles from './ProductManagement.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import * as api from '../../services/productServices';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Loading';
import defaultImage from '../../assets/images/logo.png';

const cx = classNames.bind(styles);

const schema = yup
    .object({
        name: yup.string().required('Trường này không được bỏ trống'),
        desc: yup.string().required('Trường này không được bỏ trống'),
        type: yup.string().required('Trường này không được bỏ trống'),
        price: yup.string().required('Trường này không được bỏ trống'),
        image: yup.mixed(),
    })
    .required();

function ProductManagement({ isShow }) {
    const [list, setList] = useState();
    const [selectedProduct, setSelectedProduct] = useState();

    const formRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');

    const [isAdding, setIsAdding] = useState(false);

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
        formData.append('desc', data.desc);
        formData.append('type', data.type);
        formData.append('price', data.price);
        formData.append('image', data.image[0]);

        if (selectedProduct?._id && !isAdding) {
            handleUpdateProductDetails(selectedProduct._id, formData);
        } else if (isAdding) {
            handleCreateProduct(formData);
        }
    };

    const handleUpdateProductDetails = async (id, formData) => {
        const res = await api.productUpdate(id, formData);
        setIsLoading(false);
        getProducts();
        alert(res.message);
        setShowUpdate(false);
    };

    const handleCreateProduct = async (formData) => {
        const res = await api.productCreate(formData);
        setIsLoading(false);
        getProducts();
        alert(res.message);
        setShowUpdate(false);
    };

    useEffect(() => {
        if (isShow) document.getElementsByClassName(cx('wrapper'))[0].classList.add(cx('active'));
        else document.getElementsByClassName(cx('wrapper'))[0].classList.remove(cx('active'));
    }, [isShow]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        const res = await api.productGetAll();
        if (res) setList(res);
    };

    const onNameChange = (e) => {
        setName(e.target.value);
    };

    const onDescChange = (e) => {
        setDesc(e.target.value);
    };

    const onTypeChange = (e) => {
        setType(e.target.value);
    };

    const onPriceChange = (e) => {
        setPrice(e.target.value);
    };

    const onFileSelected = (event) => {
        var selectedFile = event.target.files[0];
        var reader = new FileReader();

        var imgtag = document.getElementById(cx('product-image'));
        imgtag.title = selectedFile.name;

        reader.onload = (event) => {
            imgtag.src = event.target.result;
        };

        reader.readAsDataURL(selectedFile);
    };

    const handleShowUpdate = async (productId) => {
        if (productId === -1) {
            setIsAdding(true);
            setShowUpdate(true);
        } else {
            setIsLoading(true);
            const res = await api.productGetDetails(productId);
            await setSelectedProduct(res);
            setShowUpdate(true);
        }
    };

    const handleHideUpdate = () => {
        setShowUpdate(false);
    };

    const handleDeleteProduct = async (id) => {
        setIsLoading(true);
        await api
            .productDelete(id)
            .then((res) => {
                alert(res.message);
                getProducts();
                setIsLoading(false);
            })
            .catch((error) => {
                alert(error.message);
                getProducts();
                setIsLoading(false);
            });
    };

    useEffect(() => {
        formRef.current.reset();
        setName('');
        setDesc('');
        setType('');
        setPrice('');
        if (showUpdate) {
            document.getElementsByClassName(cx('update'))[0].classList.add(cx('active'));
            setIsLoading(false);
        } else {
            document.getElementsByClassName(cx('update'))[0].classList.remove(cx('active'));
            setIsAdding(false);
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
                                <th>Tên</th>
                                <th>Mô tả</th>
                                <th>Loại</th>
                                <th>Giá</th>
                                <th>Hình ảnh</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list &&
                                list.map(
                                    (product, index) =>
                                        !product.isAdmin && (
                                            <tr key={index}>
                                                <td>{product.name}</td>
                                                <td>{product.desc}</td>
                                                <td>{product.type}</td>
                                                <td>{product.price}</td>
                                                <td className={cx('product-image')}>
                                                    <img src={product.img} alt="product" />
                                                </td>
                                                <td className={cx('method')}>
                                                    <button
                                                        className={cx('method-btn')}
                                                        onClick={() => handleShowUpdate(product._id)}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        className={cx('method-btn')}
                                                        onClick={() => handleDeleteProduct(product._id)}
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
                <button className={cx('add-btn')} onClick={() => handleShowUpdate(-1)}>
                    Thêm món ăn
                </button>
                <div className={cx('update')}>
                    <form onSubmit={handleSubmit(onSubmit)} className={cx('form')} ref={formRef}>
                        <button className={cx('update-close')} onClick={handleHideUpdate}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <div className={cx('form-section')}>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>Tên: </label>
                                <input
                                    className={cx('form-input')}
                                    placeholder={selectedProduct?.name}
                                    name="name"
                                    {...register('name')}
                                    autoComplete="off"
                                    value={name}
                                    onChange={onNameChange}
                                />
                                <p className={cx('form-validate-error')}>{errors.name?.message}</p>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>Mô tả: </label>
                                <input
                                    className={cx('form-input')}
                                    placeholder={selectedProduct?.desc}
                                    name="desc"
                                    {...register('desc')}
                                    autoComplete="off"
                                    value={desc}
                                    onChange={onDescChange}
                                />
                                <p className={cx('form-validate-error')}>{errors.desc?.message}</p>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>Loại: </label>
                                <input
                                    className={cx('form-input')}
                                    placeholder={selectedProduct?.type}
                                    name="type"
                                    {...register('type')}
                                    autoComplete="off"
                                    value={type}
                                    onChange={onTypeChange}
                                />
                                <p className={cx('form-validate-error')}>{errors.type?.message}</p>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>Giá: </label>
                                <input
                                    className={cx('form-input')}
                                    placeholder={selectedProduct?.price}
                                    name="price"
                                    {...register('price')}
                                    autoComplete="off"
                                    value={price}
                                    onChange={onPriceChange}
                                />
                                <p className={cx('form-validate-error')}>{errors.price?.message}</p>
                            </div>
                            <input type="submit" value="Lưu" className={cx('form-submit')} />
                        </div>
                        <div className={cx('form-section')}>
                            <img
                                src={selectedProduct?.img ? selectedProduct.img : defaultImage}
                                alt="product"
                                id={cx('product-image')}
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
                                <p className={cx('form-validate-error')}>{errors.image?.message}</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Loading isLoading={isLoading} />
        </Fragment>
    );
}

export default ProductManagement;
