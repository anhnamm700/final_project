import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faImages } from '@fortawesome/free-solid-svg-icons'

import style from './style.module.scss';

interface Props {
    data?: any,
    onChange: (e: any) => void,
    onClick: (e: any) => void
}

const MultiFileComponent = (props: Props) => {
    const { data, onChange, onClick } = props;


    return (
            <div className={style.imagesWrapper}>
                {
                    data?.map((item: any, index: any) => {
                        return (
                            <div key={index} data-id={index} className={style.imageItem}>
                                <button id={index} data-id={item?.id ? item.id : item} onClick={onClick} className={style.deleteBtn} >
                                    <FontAwesomeIcon icon={faXmark} className={style.iconDelete}/>
                                </button>
                                <img src={item?.thumbs ? (item?.file.includes('https://') ? item?.file : item?.thumbs[0]) : URL.createObjectURL(item)} className={style.image} />
                            </div>
                        );
                    })
                }
                <label className={style.iconAddImage} onChange={onChange} htmlFor="file">
                    <input type="file" multiple id="file" className={style.fileButton} hidden />
                    <FontAwesomeIcon icon={faImages} className={style.iconAdd} />
                </label>
            </div>
    );
}

export default MultiFileComponent;