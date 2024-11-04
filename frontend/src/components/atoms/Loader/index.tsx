import style from './index.module.scss';

interface LoaderProps {
  bg?: string;
  className?: string;
}

const Loader = (props: LoaderProps) => {
  const styles = props.bg ? { background: props.bg } : undefined;
  return (
    <span className={`${style.loader} ${props?.className ? props?.className : ''}`}>
      <span className={style.dot} style={styles}></span>
      <span className={style.dot} style={styles}></span>
      <span className={style.dot} style={styles}></span>
    </span>
  );
};

export default Loader;
