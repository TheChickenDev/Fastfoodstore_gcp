import styles from './About.module.scss';
import classNames from 'classnames/bind';
import { aboutImgs } from '../../assets/images/about';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faHandPointUp } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef } from 'react';

const cx = classNames.bind(styles);

function About() {
    const formListRef = useRef();
    const toTopBtnRef = useRef();

    useEffect(() => {
        const widthItem = document.getElementsByClassName(cx('item'))[0].offsetWidth;
        document.getElementById(cx('next')).addEventListener('click', () => {
            formListRef.current.scrollLeft += widthItem;
        });
        document.getElementById(cx('prev')).addEventListener('click', () => {
            formListRef.current.scrollLeft -= widthItem;
        });

        toTopBtnRef.current.addEventListener('click', () => {
            window.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div id={cx('content')}>
                <div className={cx('introduce')}>
                    <div className={cx('pad100')}>
                        <div className={cx('row')}>
                            <div className={cx('col', 'col-half', 'introduce-text')}>
                                <h2 className={cx('introduce-text__header')}>Về chúng tôi</h2>
                                <p className={cx('introduce-text__item')}>
                                    Nhận thấy xã hội ngày càng phát triển, vấn đề tiết kiệm thời gian được chú trọng.
                                    Trong đó, ăn uống được coi là việc làm mất thời gian đối với nhiều nhóm người. Hệ
                                    thống của chúng tôi được được phát triển để đáp ứng vấn đề này.
                                </p>
                                <p className={cx('introduce-text__item')}>
                                    Hệ thống được phát triển gần gũi và dễ sử dụng với người dùng . Chúng tôi đưa ra
                                    những chính sách ưu đãi hợp lý, quy trình thực hiện nhanh gọn để đáp ứng nhu cầu và
                                    giữ chân khách hàng.
                                </p>
                            </div>

                            <div className={cx('col', 'col-half', 'introduce-img')}>
                                <img src={aboutImgs.aboutUs} alt="" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('service')}>
                    <div className={cx('pad100')}>
                        <div className={cx('row')}>
                            <div className={cx('col', 'col-third', 'service-card')}>
                                <div className={cx('service-card__img')}>
                                    <img src={aboutImgs.service1} alt="" />
                                </div>
                                <div className={cx('service-card__text')}>
                                    <h2 className={cx('service-card__text-header')}>Quy trình chế biến</h2>
                                    <p className={cx('service-card__text-item')}>
                                        Món ăn được chế biến bởi đội ngũ nhiều kinh nghiệm. Là sự kết hợp của nhiều loại
                                        nguyên liệu tươi sạch đã trải qua nhiều bước sơ chế để mang lại món ăn đạt chất
                                        lượng.
                                    </p>
                                </div>
                            </div>

                            <div className={cx('col', 'col-third', 'service-card')}>
                                <div className={cx('service-card__img')}>
                                    <img src={aboutImgs.service2} alt="" />
                                </div>
                                <div className={cx('service-card__text')}>
                                    <h2 className={cx('service-card__text-header')}>Làm hài lòng khách hàng</h2>
                                    <p className={cx('service-card__text-item')}>
                                        Đem lại trải nghiệm tốt cho khách hàng. Phục vụ khách hàng một cách tận tình
                                        nhất, để giữ chân khách hàng là việc làm rất khó nên phải chú trọng từ những
                                        điều nhỏ nhặt.
                                    </p>
                                </div>
                            </div>

                            <div className={cx('col', 'col-third', 'service-card')}>
                                <div className={cx('service-card__img')}>
                                    <img src={aboutImgs.service3} alt="" />
                                </div>
                                <div className={cx('service-card__text')}>
                                    <h2 className={cx('service-card__text-header')}>Thức ăn theo hương vị</h2>
                                    <p className={cx('service-card__text-item')}>
                                        Trải qua quá trình khảo sát thị trường và thử nghiệm. Các món ăn mang hương vị
                                        đặc trưng riêng của nhà hàng và được chế biến theo khẩu vị của từng khu vực.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('slogan')}>
                    <div className={cx('slogan-item')}>
                        <h1>FIT</h1>
                        <p>Nghĩ theo cách của bạn, làm theo cách của chúng tôi!</p>
                    </div>
                </div>
                <div className={cx('ourChef')}>
                    <div className={cx('ourChef-text')}>
                        <div className={cx('pad100')}>
                            <div className={cx('ourChef-text__item')}>
                                <h1>Đầu bếp của chúng tôi</h1>
                                <p>
                                    Là những người dày dặn kinh nghiệm, hiểu biết về nhiều loại hương liệu trên thế giới
                                </p>
                            </div>

                            <div className={cx('row', 'ourChef-card')}>
                                <div className={cx('col', 'col-four')}>
                                    <div className={cx('ourChef-img')}>
                                        <img src={aboutImgs.bep1} alt="" />
                                    </div>
                                    <div className={cx('ourChef-card__text')}>
                                        <h3>Gordon Ramsay</h3>
                                        <p>Bếp trưởng</p>
                                    </div>
                                </div>
                                <div className={cx('col', 'col-four')}>
                                    <div className={cx('ourChef-img')}>
                                        <img src={aboutImgs.bep2} alt="" />
                                    </div>
                                    <div className={cx('ourChef-card__text')}>
                                        <h3>Anthony Bourdain</h3>
                                        <p>Đầu bếp</p>
                                    </div>
                                </div>
                                <div className={cx('col', 'col-four')}>
                                    <div className={cx('ourChef-img')}>
                                        <img src={aboutImgs.bep3} alt="" />
                                    </div>
                                    <div className={cx('ourChef-card__text')}>
                                        <h3>Marco Pierre White</h3>
                                        <p>Đầu bếp</p>
                                    </div>
                                </div>
                                <div className={cx('col', 'col-four')}>
                                    <div className={cx('ourChef-img')}>
                                        <img src={aboutImgs.bep4} alt="" />
                                    </div>
                                    <div className={cx('ourChef-card__text')}>
                                        <h3>Jamie Oliver</h3>
                                        <p>Phụ bếp</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('comment')}>
                    <div className={cx('comment-header')}>
                        <h1 className={cx('comment-header__text')}>Đánh giá từ khách hàng</h1>
                    </div>
                    <div id={cx('formList')} ref={formListRef}>
                        <div id={cx('list')}>
                            <div className={cx('item')}>
                                <img src={aboutImgs.khach1} className={cx('avatar')} alt="" />
                                <div className={cx('content')}>
                                    <h2>Thanh Tùng</h2>
                                    <p>Tuyệt vời, tôi đồ ăn được giao trong vòng chưa đầy 30'.</p>
                                </div>
                            </div>
                            <div className={cx('item')}>
                                <img src={aboutImgs.khach2} className={cx('avatar')} alt="" />
                                <div className={cx('content')}>
                                    <h2>Nguyễn Phương Ly</h2>
                                    <p>Đồ ăn ở đây thực sự rất ngon, tôi sẽ tiếp tục ủng hộ các bạn.</p>
                                </div>
                            </div>
                            <div className={cx('item')}>
                                <img src={aboutImgs.khach3} className={cx('avatar')} alt="" />
                                <div className={cx('content')}>
                                    <h2>David Dell</h2>
                                    <p>Trang web thật dễ sử dụng và thật nhiều món để lựa chọn.</p>
                                </div>
                            </div>
                            <div className={cx('item')}>
                                <img src={aboutImgs.khach4} className={cx('avatar')} alt="" />
                                <div className={cx('content')}>
                                    <h2>Michale John</h2>
                                    <p>Tôi nghĩ mọi người nên đặt theo nhóm, sẽ nhiều ưu đãi hơn đấy.</p>
                                </div>
                            </div>
                            <div className={cx('item')}>
                                <img src={aboutImgs.khach5} className={cx('avatar')} alt="" />
                                <div className={cx('content')}>
                                    <h2>Julia Xiang</h2>
                                    <p>Đồ ăn nhiều và rẻ đồ uống ở đây cũng thực sự rất ngon.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('direction')}>
                        <button id={cx('prev')}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button id={cx('next')}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>

                <div className={cx('service')}>
                    <div className={cx('pad100')}>
                        <div className={cx('cvn')}>
                            <div className={cx('col', 'cvn-card')}>
                                <div className={cx('cvn-card__img')}>
                                    <img src={aboutImgs.cvn1} alt="" />
                                </div>
                                <div className={cx('service-card__text')}>
                                    <h2 className={cx('service-card__text-header')}>Đồ uống</h2>
                                    <p className={cx('service-card__text-item')}>
                                        Giảm giá đồ uống khi đặt theo combo.
                                    </p>
                                </div>
                            </div>

                            <div className={cx('col', 'cvn-card')}>
                                <div className={cx('cvn-card__img')}>
                                    <img src={aboutImgs.cvn2} alt="" />
                                </div>
                                <div className={cx('service-card__text')}>
                                    <h2 className={cx('service-card__text-header')}>Đồ ăn</h2>
                                    <p className={cx('service-card__text-item')}>Đa dạng về loại và kích thước.</p>
                                </div>
                            </div>
                            <div className={cx('col', 'cvn-card')}>
                                <div className={cx('cvn-card__img')}>
                                    <img src={aboutImgs.cvn3} alt="" />
                                </div>
                                <div className={cx('service-card__text')}>
                                    <h2 className={cx('service-card__text-header')}>Thời gian</h2>
                                    <p className={cx('service-card__text-item')}>Chuẩn bị nhanh chóng chưa đày 30'.</p>
                                </div>
                            </div>
                            <div className={cx('col', 'cvn-card')}>
                                <div className={cx('cvn-card__img')}>
                                    <img src={aboutImgs.cvn4} alt="" />
                                </div>
                                <div className={cx('service-card__text')}>
                                    <h2 className={cx('service-card__text-header')}>Giao hàng</h2>
                                    <p className={cx('service-card__text-item')}>
                                        Miền phí giao hàng cho đơn hàng từ 150k.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('totop')} ref={toTopBtnRef}>
                <FontAwesomeIcon icon={faHandPointUp} />
            </div>
        </div>
    );
}

export default About;
