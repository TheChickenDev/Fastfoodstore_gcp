import styles from './Loading.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useRef } from 'react';

const cx = classNames.bind(styles);

function Loading({ children = 'Loading', isLoading }) {
    const spinRef = useRef(null);

    useEffect(() => {
        if (isLoading) spinRef.current.classList.add(cx('active'));
        else spinRef.current.classList.remove(cx('active'));
    }, [isLoading]);

    return (
        <div className={cx('spin')} ref={spinRef}>
            <div className={cx('loader')}>
                <div className={cx('--dot')}></div>
                <div className={cx('--dot')}></div>
                <div className={cx('--dot')}></div>
                <div className={cx('--dot')}></div>
                <div className={cx('--dot')}></div>
                <div className={cx('--dot')}></div>
            </div>
            <h2 className={cx('text')}>{children}</h2>
        </div>
    );
}

export default Loading;
