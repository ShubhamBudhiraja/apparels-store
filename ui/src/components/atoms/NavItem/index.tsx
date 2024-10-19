import { ISingleNavItem } from 'src/lib/interface/layout';
import style from './index.module.scss';

const NavItem = (props: ISingleNavItem) => {
    const { title, link } = props;

    return (
        <div className={style.itemWrapper}>
            <a href={link} className={style.item}>
                {title}
            </a>
        </div>
    );
};

export default NavItem;
