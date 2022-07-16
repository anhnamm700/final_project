import style from './style.module.scss';
import InfoComponent from 'modules/components/InfoComponent';
import { useState } from 'react';

import { useSelector } from 'react-redux';

interface Props {
    data: any
}

const Content = (props: Props) => {
    const { data } = props;
    const selectors = useSelector((state: any) => state.admin);
    // const [dataProduct, setDataProduct] = useState<any>(data);
    const [infoProduct, setInfoProduct] = useState({
        vendor: selectors?.vendors?.find((item: any) => (item?.id === data?.vendor_id))?.name,
        name: data?.name
    });

    console.log(data);
    

    // console.log(dataProduct);
    

    // console.log(data);

    // const vendor = selectors?.vendors?.find((item: any) => (item?.id === data?.vendor_id))?.name;
    
    // if (data) {
    //     setInfoProduct({
    //         vendor: 'vendor',
    //         name: data?.name
    //     });
    // }

    console.log(infoProduct);
    
    

    

    return (
        <div className={style.infoWrapper}>
            <div className={style.titleHeader}>
                <ul>
                    <li>Info</li>
                </ul>

                <div>
                    <div>
                        <InfoComponent
                            isImportant={true}
                            title="Vendor"
                            type="inputText"
                            placeholder="Type Vendor name to select"
                            value={infoProduct?.vendor}
                            onChangeInput={(e: any) => setInfoProduct({  ...infoProduct, vendor: e.target.value })}
                        />

                        {
                            infoProduct.vendor && (
                                <div>Test</div>
                            )
                        }
                    </div>

                    <InfoComponent
                        isImportant={true}
                        title="Product Title"
                        type="inputText"
                        value={infoProduct?.name}
                        onChangeInput={(e: any) => setInfoProduct({  ...infoProduct, name: e.target.value })}
                    />

                    <InfoComponent
                        isImportant={true}
                        title="Brand"
                        type="select"
                    />

                    <InfoComponent
                        isImportant={true}
                        title="Condition"
                        type="select"
                    />

                    <InfoComponent
                        isImportant={true}
                        title="SKU"
                        type="inputText"
                    />
                </div>
            </div>
        </div>
    );
}

export default Content;