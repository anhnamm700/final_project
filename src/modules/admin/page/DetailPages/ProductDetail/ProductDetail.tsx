import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useEffect, useState, useCallback } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import Switch from "react-switch";
import Spinner from 'react-bootstrap/Spinner';

import axiosAPI from 'common/axiosConfig/axios';
import { API_PATHS } from 'configs/api';
import { ROUTES } from 'configs/routes';
import Header from 'modules/admin/components/General/Header';
import CheckBoxComponent from 'modules/components/CheckBoxComponent';
import CKEditorComponent from 'modules/components/CKEditor';
import InfoComponent from 'modules/components/InfoComponent';
import ToastComponent from 'modules/components/ToastComponent';
import InputCheckboxComponent from 'modules/components/InputCheckboxComponent';
import LoadingComponent from 'modules/components/LoadingComponent/LoadingComponent';
import MultiFileComponent from 'modules/components/MultiFileComponent';
import ReactSelectComponent from 'modules/components/ReactSelectComponent';
import { ACCESS_TOKEN_KEY, currency, marketing } from 'utils/constant';
import { validate } from 'utils/validate';
import style from './style.module.scss';

const ProductDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [product, setProduct] = useState<any>({});
    const [errorMessage, setErrorMessage] = useState<any>({});
    const [description, setDescription] = useState<any>(null);
    const [productInfo, setProductInfo] = useState<any>({
        vendor_id: '',
        vendor: '',
        name: '',
        brand: '',
        condition: '',
        sku: '',
        images: [],
        categories: [],
        cate_id: [],
        description: '',
        enabled: '',
        memberships: [],
        tax_exempt: '',
        price: '',
        participate_sale: '',
        sale_price_type: '',
        sale_price: '',
        arrival_date: '',
        quantity: '',
        shipping_default: [],
        shipping: [],
        og_tags_type: '',
        og_tags: '',
        meta_desc_type: '',
        meta_description: '',
        meta_keywords: '',
        product_page_title: '',
        facebook_marketing_enabled: "1",
        google_feed_enabled: "1",
        deleted_images: []
    });
    const [vendorFilter, setVendorFilter] = useState<any>([]);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [shippingZone, setShippingZone] = useState<any>({});
    const [isDisableAdd, setIsDisableAdd] = useState<boolean>(true);
    const [isSelectedDefault, setIsSelectedDefault] = useState<any>(true);
    const [files, setFiles] = useState<any>([]);
    const [updatedComplete, setUpdatedComplete] = useState<any>(null);
    const [updatedSuccess, setUpdatesSuccess] = useState<boolean>(false);
    const [isDisplay, setIsDisplay] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCustom, setIsCustom] = useState<boolean>(false);
    const [isMetaCustom, setIsMetaCustom] = useState<boolean>(false);
    const [isSalePrice, setIsSalePrice] = useState<boolean>(false);
    const [isToastDisplay, setIsToastDisplay] = useState<boolean>(false);
    const [isSpinner, setIsSpinner] = useState<boolean>(false);

    const auth = Cookies.get(ACCESS_TOKEN_KEY);
    const selectors = useSelector((state: any) => state.admin);

    const countries = JSON.parse(JSON.stringify(selectors?.shippings));
    const isDisableButton = productInfo.categories.length === 0 || Number(productInfo.price) === 0 || Number(productInfo.quantity) === 0 || productInfo.description.length === 0 || !selectors?.vendors.find((item: any) => item.name === productInfo.vendor) || !Number(productInfo.brand) || productInfo.images.length === 0;

    const memberships = [
        { membership_id: "4" }
    ]
    const membershipsConvert = memberships.map((item: any) => ({ label: "General", value: item.membership_id }));

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLTextAreaElement
        if (target.dataset.set !== 'input-select') {
            setIsDisplay(false);
        }
    });

    useEffect(() => {
        if (Object(location)?.state?.toast) {
            setIsToastDisplay(true);
        }
    }, [location.state]);
    
    useEffect(() => {
        if (!isToastDisplay) window.history.replaceState({}, document.title);
    }, [isToastDisplay]);

    useEffect(() => {
        const getData = async() => {
            try {
                if (updatedComplete) {
                    setIsSuccess(true);
                    setIsSpinner(false);
                    window.scrollTo(0, 0);
                };
    
                if (id) {
                    const productDetail = await axiosAPI({ method: 'POST', url: `${API_PATHS.detailProduct}`, payload: { id: id }, header: { Authorization: `${auth}` } });
                    
                    if (!productDetail?.data?.errors || productDetail.data.success) {
                        const data = await productDetail?.data?.data;
                        setProduct(data);
                    } else {
                        alert('C?? l???i x???y ra!');
                    }
                }
            } catch (error: any) {
                throw new Error(error);
            }
        }
        setIsLoading(false);
        getData();
    }, [id, updatedSuccess]);

    useEffect(() => {
        setProductInfo({
            ...productInfo,
            vendor: selectors?.vendors?.find((item: any) => (item?.id === product?.vendor_id))?.name,
            vendor_id: product?.vendor_id,
            name: product?.name,
            brand: selectors?.brands?.find((item: any) => (item?.value === product?.brand_id))?.value,
            condition: selectors.conditions,
            sku: product?.sku,
            images: product?.images,
            categories: product?.categories?.map((item: any, index: number) => {
                const result = selectors?.categories.reduce((acc: any, elm: any) => {
                    if (elm.value === item.category_id) {
                        return elm;
                    };
                    return acc;
                });
                return result;
            }),
            enabled: product?.enabled,
            memberships: product?.memberships?.map((item: any, index: number) => {
                const result = membershipsConvert?.reduce((acc: any, elm: any) => {
                    if (elm.value === item.membership_id) {
                        return elm;
                    };
                    return acc;
                });
                return result;
            }),
            price: Number(product?.price).toFixed(2),
            tax_exempt: product?.tax_exempt,
            participate_sale: product?.participate_sale,
            sale_price_type: { label: product?.sale_price_type, value: product?.sale_price_type },
            sale_price: product?.sale_price,
            arrival_date: product?.arrival_date,
            quantity: product?.quantity,
            shipping: product?.shipping,
            shipping_default: product?.shipping?.find((item: any) => Number(item.id) === 1) ? product?.shipping?.find((item: any) => Number(item.id) === 1) : { id: "1", zone_name: "Continental U.S.", price: "0" },
            description: product?.description,
            og_tags_type: product?.og_tags_type,
            og_tags: product?.og_tags,
            meta_desc_type: product?.meta_desc_type,
            meta_description: product?.meta_description,
            meta_keywords: product?.meta_keywords,
            product_page_title: product?.product_page_title,
            facebook_marketing_enabled: product?.facebook_marketing_enabled,
            google_feed_enabled: product?.google_feed_enabled,
        });


        if (product?.participate_sale === "1") {
            setIsSalePrice(true);
        } else {
            setIsSalePrice(false);
        }

        if (product?.og_tags_type === '1') {
            setIsCustom(true);
        } else {
            setIsCustom(false);
        }

        if (product?.meta_desc_type === 'C') {
            setIsMetaCustom(true);
        } else {
            setIsMetaCustom(false);
        }

    }, [product]);

    useEffect(() => {
        if (vendorFilter.length > 0) setIsDisplay(true);
        if (vendorFilter.length === 1 && vendorFilter[0].name === productInfo.vendor) setIsDisplay(false);
        if (vendorFilter.length === 0) setIsDisplay(false);
    }, [vendorFilter]);

    useEffect(() => {
        setProductInfo({ ...productInfo, images: [...productInfo.images, ...files] });
    }, [files]);

    const handleFileChange = (e: any) => {
        if (e.target.files) {
            setFiles([...e.target.files]);
        }
    }

    useEffect(() => {
        if (productInfo?.sale_price_type.label === '$') {
            if (Number(productInfo?.sale_price) > Number(productInfo?.price)) {
                setErrorMessage(validate({ ...productInfo }));
            } else {
                setErrorMessage(validate({ ...productInfo, sale_price: '' }));
            }
        } else {
            setErrorMessage(validate({ ...productInfo, sale_price: '' }));
        }
    }, [productInfo?.sale_price, productInfo?.price, productInfo?.sale_price_type]);

    useEffect(() => {
        if (productInfo?.vendor?.length === 0) return;

        const id = setTimeout(() => {
            const value = selectors?.vendors?.filter((vendor: any) => (
                vendor?.name?.includes(productInfo?.vendor)
            ));

            if (value.length > 0) {
                setVendorFilter(value);
            } else if (value.length === 0) {
                setVendorFilter(['not']);
            }

        }, 500);

        return () => clearTimeout(id);
    }, [productInfo?.vendor]);

    useEffect(() => {
        if (description) {
            setProductInfo({ ...productInfo, description: description });
        } else {
            setProductInfo({ ...productInfo, description: '' });
        }
    }, [description]);

    const handleUpdate = async () => {
        setIsSpinner(true);
        setIsLoading(true);
        try {
            const cateId = await productInfo?.categories?.map((item: any) => Number(item.value));
            const shipping = await productInfo?.shipping.map((item: any) => {
                if (Number(item?.id) !== 1) {
                    return (
                        { "id": Number(item?.id), "price": Number(item.price).toFixed(2).toString() }
                    );
                }
            });

            const shippingRequest = await [...shipping, { "id": Number(productInfo?.shipping_default?.id), "price": productInfo?.shipping_default?.price }].filter((item: any) => item);

            const productDetail = await {
                "vendor_id": productInfo?.vendor_id,
                "name": productInfo?.name,
                "brand_id": productInfo?.brand,
                "condition_id": "262",
                "categories": cateId,
                "id": id,
                "deleted_images": productInfo?.deleted_images,
                "description": productInfo?.description,
                enabled: productInfo?.enabled,
                memberships: productInfo?.memberships?.map((item: any) => item.value),
                tax_exempt: Number(productInfo?.tax_exempt),
                participate_sale: productInfo?.participate_sale,
                price: productInfo?.price,
                sale_price_type: productInfo?.sale_price_type?.value,
                sale_price: isSalePrice ? productInfo?.sale_price : 0,
                quantity: productInfo?.quantity,
                shipping_to_zones: shippingRequest,
                og_tags_type: productInfo?.og_tags_type,
                og_tags: productInfo?.og_tags_type === "1" ? productInfo?.og_tags : '',
                meta_desc_type: productInfo?.meta_desc_type,
                meta_description: productInfo?.meta_desc_type === "C" ? productInfo?.meta_description : '',
                meta_keywords: productInfo?.meta_keywords,
                product_page_title: productInfo?.product_page_title,
                facebook_marketing_enabled: productInfo?.facebook_marketing_enabled,
                google_feed_enabled: productInfo?.google_feed_enabled,
                arrival_date: moment.unix(productInfo?.arrival_date).format("YYYY-MM-DD")
            }
            const formDataProduct = new FormData();

            formDataProduct.append('productDetail', JSON.stringify(productDetail));

            const productResponse = await axiosAPI({
                method: 'POST',
                url: API_PATHS.createProduct,
                payload: { productDetail: formDataProduct.get('productDetail') },
                header: {
                    Authorization: `${auth}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            // c???t ???nh t??? v??? tr?? th??m => h???t
            const dataImages = productInfo?.images.splice(product.images.length, productInfo?.images.length);

            if (dataImages.length === 0 && !productResponse?.data?.errors) {
                setUpdatedComplete(!productResponse?.data?.errors);
                setUpdatesSuccess(!updatedSuccess);
            } else {
                if (!productResponse?.data?.errors && productResponse?.data?.success && dataImages) {
                    const responseImages = dataImages?.map(async (file: any, index: number) => {
                        const formDataImages = new FormData();
                        formDataImages.append('images[]', file);
                        formDataImages.append('order', JSON.parse(JSON.stringify(index)));
                        formDataImages.append('productId', JSON.parse(JSON.stringify(id)));

                        const imagesResponse = await axiosAPI({
                            method: 'POST',
                            url: API_PATHS.updateImage,
                            payload: formDataImages,
                            header: {
                                Authorization: `${auth}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        });

                        return imagesResponse;
                    });

                    Promise.all(responseImages).then(res => {
                        if(res?.every((item: any) => !item.data.error)) {
                            setUpdatedComplete(true);
                            setUpdatesSuccess(!updatedSuccess);
                        }
                    });
                }
            }
        } catch (error: any) {
            throw new Error(error);
        }
        setIsLoading(false);
    };

    const updateInfo = (index: number, value: string) => {
        let copyOfBlocks = productInfo?.shipping;
        copyOfBlocks[index] = { ...copyOfBlocks[index], price: value };
        setProductInfo({ ...productInfo, shipping: [...copyOfBlocks] });
    }

    const handleRemoveCountries = (index: any) => {
        let copyOfBlocks = productInfo?.shipping;
        const id = Number(index.target.dataset.id);
        copyOfBlocks.splice(id, 1);
        setProductInfo({ ...productInfo, shipping: [...copyOfBlocks] });
    }

    return (
        <div className={style.detailWrapper}>
            {
                isLoading && <LoadingComponent />
            }

            {
                isSuccess && <ToastComponent
                    show={isSuccess}
                    content="C???p nh???t th??nh c??ng"
                    setShow={() => setIsSuccess(false)}
                />
            }

            {
                isToastDisplay && <ToastComponent
                    show={isToastDisplay}
                    setShow={() => {
                        setIsToastDisplay(false);
                        Object(location).state.toast = null;
                    }}
                    content={Object(location).state.toast}
                />
            }

            <Header
                route={ROUTES.productList}
                name={product?.name}
            />

            <div className={style.infoWrapper}>
                <div className={style.titleHeader}>
                    <ul>
                        <li>Info</li>
                    </ul>

                    <div className={style.ProductComponent}>
                        <div className={style.productInfo}>
                            <div className={style.vendorWrapper}>
                                <InfoComponent
                                    isImportant={true}
                                    title="Vendor"
                                    type="inputText"
                                    placeholder="Type Vendor name to select"
                                    value={productInfo?.vendor}
                                    dataSet="input-select"
                                    onFocus={() => setIsDisplay(true)}
                                    onChangeInput={(e: any) => {
                                        setProductInfo({ ...productInfo, vendor: e.target.value });

                                        setErrorMessage(validate({ ...productInfo, vendor: e.target.value }));
                                    }}
                                    onKeyUp={(e) => {
                                        if (e.keyCode === 8) {
                                            if (productInfo?.vendor.trim().length === 0) {
                                                setVendorFilter([]);
                                                setIsDisplay(false);
                                            }
                                        }
                                    }}
                                />
                                {errorMessage.vendor ? <div className={style.messageError}>{errorMessage.vendor}</div> : null}

                                {
                                    isDisplay &&
                                    (vendorFilter[0] === 'not' ? (
                                        <p className={style.vendorFilter}>Vendor not found</p>
                                    ) : (
                                        <div className={style.vendorFilter}>
                                            {
                                                vendorFilter.map((item: any, index: number) => (
                                                    <p className="item" key={index} onClick={(e) => {
                                                        setProductInfo({ ...productInfo, vendor: item?.name, vendor_id: item?.id });
                                                        setIsDisplay(false);
                                                    }}>{item.name}</p>
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </div>

                            <div className={style.vendorWrapper}>
                                <InfoComponent
                                    isImportant={true}
                                    title="Product Title"
                                    type="inputText"
                                    value={productInfo?.name}
                                    name="name"
                                    onChangeInput={(e: any) => {
                                        setProductInfo({ ...productInfo, name: e.target.value });
                                        setErrorMessage(validate({ ...productInfo, name: e.target.value }));
                                    }}
                                    onBlur={(e: any) => {
                                        setErrorMessage(validate({ ...productInfo, name: e.target.value }));
                                    }}
                                />
                                {errorMessage.name ? <div className={style.messageError}>{errorMessage.name}</div> : null}
                            </div>

                            <div className={style.flexComponent}>
                                <p className={style.titleInfo}>Th????ng hi???u</p>
                                <ReactSelectComponent
                                    className="InfoComponent"
                                    options={selectors?.brands}
                                    value={selectors?.brands?.find((item: any) => item?.value === productInfo?.brand)}
                                    isMulti={false}
                                    onChange={(e: any) => {
                                        const value = e?.value;
                                        setProductInfo({ ...productInfo, brand: value });
                                        setErrorMessage(validate({ ...productInfo, brand: value }));
                                    }}
                                />
                                {errorMessage.brand ? <div className={style.messageError}>{errorMessage.brand}</div> : null}
                            </div>

                            <InfoComponent
                                isImportant={true}
                                title="Condition"
                                type="select"
                                dataSelect={["Used"]}
                                onSelectChange={(e: any) => setProductInfo({ ...productInfo, condition: e.target.value })}
                            />

                            <InfoComponent
                                isImportant={true}
                                title="Used Condition"
                                type="select"
                                dataSelect={[]}
                                onSelectChange={(e: any) => { }}
                            />

                            <InfoComponent
                                isImportant={true}
                                title="SKU"
                                type="inputText"
                                value={productInfo?.sku}
                                onChangeInput={(e: any) => setProductInfo({ ...productInfo, sku: e.target.value })}
                            />

                            <div className={style.vendorWrapper}>
                                <p className={style.titleGeneral}>???nh</p>
                                <MultiFileComponent
                                    data={productInfo?.images}
                                    onChange={handleFileChange}
                                    onClick={(e: any) => {
                                        const id = Number(e.currentTarget.id);
                                        const fileId = e.currentTarget.dataset.id;
                                        productInfo?.images.splice(id, 1);
                                        setProductInfo({ ...productInfo, images: productInfo.images });
                                        setErrorMessage(validate({ ...productInfo }));

                                        if (!!Number(fileId)) {
                                            setProductInfo({ ...productInfo, deleted_images: [...productInfo.deleted_images, fileId] });
                                        }
                                    }}
                                />
                                {errorMessage.images ? <div className={style.messageError}>{errorMessage.images}</div> : null}
                            </div>

                            <div className={style.flexComponent}>
                                <p className={style.titleInfo}>Danh m???c</p>
                                <ReactSelectComponent
                                    className='InfoComponent'
                                    options={selectors?.categories}
                                    value={productInfo?.categories}
                                    isMulti={true}
                                    onChange={(e: any) => {
                                        setProductInfo({ ...productInfo, categories: e });
                                        setErrorMessage(validate({ ...productInfo, categories: e }));
                                    }}
                                />
                                {errorMessage.categories ? <div className={style.messageError}>{errorMessage.categories}</div> : null}
                            </div>

                            <div className={style.flexComponent}>
                                <p className={style.titleInfo}>M?? t???</p>
                                <div className={style.editDescription}>
                                    <CKEditorComponent
                                        value={productInfo?.description}
                                        onChange={(data: any) => {
                                            setDescription(data);
                                            setErrorMessage(validate({ ...productInfo, description: data }));
                                        }}
                                    />
                                </div>
                                {errorMessage.description ? <div className={style.messageError}>{errorMessage.description}</div> : null}
                            </div>

                            <div className={`${style.vendorWrapper} ${style.switchInfo}`}>
                                <p className={style.titleGeneral}>Available for sale</p>
                                <Switch
                                    onChange={(e: any) => setProductInfo({ ...productInfo, enabled: e ? "1" : "0" })}
                                    checked={productInfo?.enabled === "0" ? false : true}
                                    className={style.reactSwitch}
                                />
                            </div>

                            <div>
                                <h6 className={style.tilteForm}>Prices & Inventory</h6>
                                <div className={style.flexComponent}>
                                    <p className={style.titleInfo}>Memberships</p>
                                    <InputCheckboxComponent
                                        data={membershipsConvert}
                                        value={productInfo?.memberships}
                                        handleChange={(e: any) => setProductInfo({ ...productInfo, memberships: e })}
                                    />
                                </div>

                                <div className={style.flexComponent}>
                                    <p className={style.titleInfo}>Tax class</p>
                                    <CheckBoxComponent
                                        title='Tax Exempt'
                                        value={productInfo?.tax_exempt}
                                        setCheckedSearch={(e: any) => {
                                            if (e.target.checked) {
                                                setProductInfo({ ...productInfo, tax_exempt: "1" });
                                            } else {
                                                setProductInfo({ ...productInfo, tax_exempt: "0" });
                                            }
                                        }}
                                        isCheckedItem={productInfo?.tax_exempt}
                                    />
                                </div>

                                <div className={style.flexComponent}>
                                    <p className={style.titleInfo}>Gi??</p>

                                    <div className={style.priceProduct}>
                                        <NumberFormat
                                            value={productInfo?.price}
                                            className={style.inputPrice}
                                            displayType={'input'}
                                            thousandSeparator={true}
                                            prefix={'$'}
                                            onValueChange={(values, sourceInfo) => {
                                                const { formattedValue, value } = values;
                                                setProductInfo({ ...productInfo, price: Number(value).toFixed(2) });
                                                const { event, source } = sourceInfo;
                                            }}
                                        />
                                        {errorMessage.price ? <div className={style.messageError}>{errorMessage.price}</div> : null}

                                        <CheckBoxComponent
                                            title='Sale'
                                            value={productInfo?.participate_sale}
                                            setCheckedSearch={(e: any) => {
                                                if (e.target.checked) {
                                                    setProductInfo({ ...productInfo, participate_sale: "1" });
                                                    setIsSalePrice(true);
                                                } else {
                                                    setProductInfo({ ...productInfo, participate_sale: "0" });
                                                    setIsSalePrice(false);
                                                }
                                            }}
                                            isCheckedItem={productInfo?.participate_sale}
                                        />

                                        {isSalePrice && (
                                            <div className={style.salePrice}>
                                                <ReactSelectComponent
                                                    className={style.selectComponent}
                                                    options={currency}
                                                    value={productInfo?.sale_price_type}
                                                    isMulti={false}
                                                    onChange={(e: any) => {
                                                        setProductInfo({ ...productInfo, sale_price_type: e });
                                                    }}
                                                />

                                                <NumberFormat
                                                    value={productInfo?.sale_price}
                                                    displayType={'input'}
                                                    thousandSeparator={true}
                                                    onValueChange={(values, sourceInfo) => {
                                                        const { formattedValue, value } = values;
                                                        setProductInfo({ ...productInfo, sale_price: Number(value).toFixed(2) });
                                                        const { event, source } = sourceInfo;
                                                    }}
                                                />
                                                {errorMessage.sale_price ? <div className={style.messageError}>{errorMessage.sale_price}</div> : null}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <InfoComponent
                                    unit={<FontAwesomeIcon icon={faCalendar} />}
                                    isImportant={false}
                                    title="Arrival date"
                                    type="inputText"
                                    dataType='date'
                                    name='arrival'
                                    value={moment.unix(productInfo?.arrival_date).format("YYYY-MM-DD")}
                                    onChangeInput={(e: any) => {
                                        const dateFomat = moment(e.target.value).format('YYYY-MM-DD');
                                        setProductInfo({ ...productInfo, arrival_date: new Date(dateFomat).getTime() / 1000 });
                                    }}
                                />

                                <div className={style.relativePosition}>
                                    <InfoComponent
                                        isImportant={true}
                                        title="Quantity in stock"
                                        type="inputText"
                                        value={productInfo?.quantity}
                                        dataType="number"
                                        onChangeInput={(e: any) => {
                                            setProductInfo({ ...productInfo, quantity: e.target.value })
                                            setErrorMessage(validate({ ...productInfo, quantity: e.target.value }));
                                        }}
                                    />
                                    {errorMessage.quantity ? <div className={style.messageError}>{errorMessage.quantity}</div> : null}
                                </div>
                            </div>

                            <div>
                                <h6 className={style.tilteForm}>Shipping</h6>
                                <div className={style.flexComponent}>
                                    <p className={style.titleInfo}>{productInfo?.shipping_default?.zone_name}</p>
                                    <NumberFormat
                                        value={productInfo?.shipping_default?.price}
                                        className={style.numberFomat}
                                        displayType={'input'}
                                        thousandSeparator={true}
                                        onValueChange={(values, sourceInfo) => {
                                            const { formattedValue, value } = values;
                                            setProductInfo({ ...productInfo, shipping_default: { ...productInfo?.shipping_default, price: Number(value).toFixed(2) } })
                                            const { event, source } = sourceInfo;
                                        }}
                                    />
                                </div>

                                {
                                    productInfo?.shipping?.map((item: any, index: number) => {
                                        if (Number(item?.id) === 1) return;
                                        return (
                                            <div className={`${style.flexComponent} ${style.countryList}`}>
                                                <p className={style.titleInfo}>{item?.country || item?.zone_name}</p>
                                                <NumberFormat
                                                    value={item?.price}
                                                    displayType={'input'}
                                                    className={style.numberFomat}
                                                    thousandSeparator={true}
                                                    onValueChange={(values, sourceInfo) => {
                                                        const { formattedValue, value } = values;
                                                        updateInfo(index, Number(value).toFixed(2));
                                                        const { event, source } = sourceInfo;
                                                    }}
                                                />

                                                <p data-id={index} onClick={(index: any) => {
                                                    handleRemoveCountries(index);
                                                }} className={style.removeButton}>Remove</p>
                                            </div>
                                        );
                                    })
                                }
                                <div className={`${style.flexComponent} ${style.countriesBox}`}>
                                    <p className={style.titleInfo}></p>
                                    <div className={style.selectCountry}>
                                        <select onChange={(e: any) => {
                                            setIsSelectedDefault(false);
                                            setIsDisableAdd(false);
                                            setShippingZone({ id: e.target.value, price: 0, country: countries?.find((item: any) => item.id === e.target.value)?.name });
                                        }}>
                                            <option selected={isSelectedDefault ? true : false}>Ch???n th??nh ph???</option>
                                            {
                                                countries?.map((item: any) => {
                                                    const checkDisplay = productInfo?.shipping?.some((ship: any) => item.id === ship.id);
                                                    return (
                                                        <option
                                                            className={checkDisplay ? style.optionHide : ''}
                                                            value={item.id}
                                                            key={item.id}
                                                        >{item.name}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </div>

                                    <button disabled={isDisableAdd} onClick={() => {
                                        setIsSelectedDefault(true);
                                        setProductInfo({ ...productInfo, shipping: [...productInfo?.shipping, { ...shippingZone }] });
                                        setIsDisableAdd(true);
                                    }}>Add</button>
                                </div>


                            </div>

                            <div>
                                <h6 className={style.tilteForm}>Marketing</h6>
                                <div className={style.flexComponent}>
                                    <p className={style.titleInfo}>Open Graph meta tags</p>
                                    <div className={style.selectCustom}>
                                        <select onChange={(e: any) => {
                                            setIsCustom(!!Number(e.target.value));
                                            setProductInfo({ ...productInfo, og_tags_type: e.target.value });
                                        }}>
                                            {
                                                marketing?.data?.map((item: any) => {
                                                    return (
                                                        <option selected={Number(productInfo?.og_tags_type) === Number(item?.id)} key={item.id} value={item.id}>{item.name}</option>
                                                    );
                                                })
                                            }
                                        </select>

                                        {
                                            (isCustom) && (
                                                <textarea onChange={(e: any) => setProductInfo({ ...productInfo, og_tags: e.target.value })}>{productInfo?.og_tags}</textarea>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className={style.flexComponent}>
                                    <p className={style.titleInfo}>Meta description</p>
                                    <div className={style.selectCustom}>
                                        <select onChange={(e: any) => {
                                            const value = e.target.value;
                                            if (value === 'A') {
                                                setIsMetaCustom(false);
                                            } else if (value === 'C') {
                                                setIsMetaCustom(true);
                                            }
                                            setProductInfo({ ...productInfo, meta_desc_type: e.target.value });
                                        }}>
                                            {
                                                marketing?.data?.map((item: any) => {
                                                    return (
                                                        <option selected={productInfo?.meta_desc_type === item?.id_t} key={item.id} value={item.id_t}>{item.name}</option>
                                                    );
                                                })
                                            }
                                        </select>

                                        {
                                            isMetaCustom && (
                                                <textarea onChange={(e: any) => setProductInfo({ ...productInfo, meta_description: e.target.value })}>{productInfo?.meta_description}</textarea>
                                            )
                                        }
                                    </div>
                                </div>

                                <div>
                                    <InfoComponent
                                        title='Meta keywords'
                                        type='inputText'
                                        value={productInfo?.meta_keywords}
                                        onChangeInput={(e: any) => setProductInfo({ ...productInfo, meta_keywords: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <InfoComponent
                                        title='Product page title'
                                        type='inputText'
                                        value={productInfo?.product_page_title}
                                        onChangeInput={(e: any) => setProductInfo({ ...productInfo, product_page_title: e.target.value })}
                                    />
                                </div>

                                <div className={`${style.flexComponent} ${style.socialOption}`}>
                                    <p className={style.titleInfo}>Add to Facebook product feed</p>
                                    <Switch
                                        onChange={(e: any) => setProductInfo({ ...productInfo, facebook_marketing_enabled: e ? "1" : "0" })}
                                        checked={productInfo?.facebook_marketing_enabled === "0" ? false : true}
                                        className={style.reactSwitch}
                                    />
                                </div>

                                <div className={`${style.flexComponent} ${style.socialOption}`}>
                                    <p className={style.titleInfo}>Add to Google product feed</p>
                                    <Switch
                                        onChange={(e: any) => setProductInfo({ ...productInfo, google_feed_enabled: e ? "1" : "0" })}
                                        checked={productInfo?.google_feed_enabled === "0" ? false : true}
                                        className={style.reactSwitch}
                                    />
                                </div>
                            </div>


                            <div className={`${style.flexComponent} ${style.socialOption}`}>
                                <button disabled={isDisableButton || isSpinner} className={isDisableButton || isSpinner ? `${style.updateButtonDisable} ${style.generalButton}` : `${style.updateButton} ${style.generalButton}`} onClick={handleUpdate}>Update</button>
                                {
                                    isSpinner && <Spinner animation="border" className={style.spinner} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;