import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState, useRef } from "react";
import { ACCESS_TOKEN_KEY } from "utils/constant";
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faChevronDown, faChevronUp, faSpinner, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import './style.css';
import { stocksStatus, availabilityStatus, pagesNumber, searchIn } from 'utils/constant';
import ModalComponent from "modules/components/ModalComponent";
import PanigationComponent from "modules/components/PanigationComponent";
import TableComponent from "modules/components/TableComponent";
import CheckBoxComponent from "modules/components/CheckBoxComponent";
import SelectComponent from "modules/components/SelectComponent";
import ButtonComponent from "modules/components/ButtonComponent";
import InputComponent from "modules/components/InputComponent";
import LoadingComponent from "modules/components/LoadingComponent/LoadingComponent";
import { setProducts, setCategories, setVendors, setBrands, setConditions, setCountries, setShippings } from 'modules/admin/redux/admin';
import { API_PATHS } from "configs/api";
import axiosAPI from "common/axiosConfig/axios";
import InfoComponent from "modules/components/InfoComponent";
import { applyMiddleware } from "redux";
import { iteratorSymbol } from "immer/dist/internal";
import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";
import { ROUTES } from "configs/routes";

const ProductList = () => {
    const dispatch = useDispatch();
    const store = useSelector((state: any) => state.admin);

    const auth = Cookies.get('token');
    const navigate = useNavigate();

    const [perPage, setPerpage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [product, setProduct] = useState<any>([]);
    const [isModalDelete, setIsModalDelete] = useState<boolean>(false);

    const [checkedAll, setCheckedAll] = useState<any>([]);
    const [isReload, setIsReload] = useState<boolean>(false);

    const [stockItem, setStockItem] = useState<any>([]);

    const [productsData, setProductsData] = useState<any>([]);
    const [isChecked, setIsChecked] = useState<any>([]);
    const [vendorList, setVendorList] = useState<any>([]);
    const [vendorKeyword, setVendorKeyword] = useState<any>('');
    const [selectedVendor, setSelectedVendor] = useState<any>('');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalActive, setIsModalActive] = useState<boolean>(false);
    const [isModalEdit, setIsModalEdit] = useState<boolean>(false);
    const [isChange, setChange] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<any>(null);
    const [isLoadingVendor, setIsLoadingVendor] = useState<boolean>(false);
    const [isExpandSearch, setIsExpandSearch] = useState<boolean>(false);
    const [isArrangeActive, setIsArrangepActive] = useState<boolean>(false);
    const [search, setSearch] = useState<any>({
        seachKeyword: '',
        category: '0',
        stock: stocksStatus?.data[0]?.id,
        searchIn: [],
        available: availabilityStatus?.data[0]?.id,
        vendor: '',
        order_by: 'DESC',
        sort: 'name'
    });
    
    const productsPerPage = Math.ceil(Number(store.products.recordsTotal) / perPage);
    

    useEffect(() => {
        const getCategories = async() => {
            try {
                setIsLoading(true);
                const dataCatgories = await axios.post(API_PATHS.categories);

                if (!dataCatgories?.data?.errors) {
                    const result = dataCatgories?.data?.data?.map((item: any) => (
                        { ...item ,value: item.id, label: item.name }
                    ));

                    if (result) {
                        dispatch(setCategories(result));
                    }
                    // dispatch(setCategories(dataCatgories.data));
                } else {
                    alert('Có lỗi xảy ra!');
                }
                

                setIsLoading(false);
            } catch (error: any) {
                throw new Error(error);
            }
        }

        const getShipping = async() => {
            try {
                setIsLoading(true);
                const dataShipping = await axiosAPI({
                    method: 'POST',
                    url: API_PATHS.getShippings,
                    header: { Authorization: `${auth}` }
                });

                if (!dataShipping?.data?.errors) {
                    dispatch(setShippings(dataShipping?.data));
                } else {
                    alert('Có lỗi xảy ra!');
                }
                

                setIsLoading(false);
            } catch (error: any) {
                throw new Error(error);
            }
        }

        const getBrands = async() => {
            try {
                setIsLoading(true);

                const dataBrands = await axios.get(`https://api.gearfocus.div4.pgtest.co/apiAdmin/brands/list`, { headers: { Authorization: `${auth}` } });

                if (!dataBrands?.data?.errors) {
                    const result = dataBrands?.data?.data?.map((item: any) => (
                        { value: item.id, label: item.name }
                    ));

                    if (result) {
                        dispatch(setBrands(result));
                    }

                } else {
                    alert('Có lỗi xảy ra!');
                }
                

                setIsLoading(false);
            } catch (error: any) {
                throw new Error(error);
            }
        }

        const getVendors = async() => {
            try {
                setIsLoading(true);

                const dataVendors = await axios.get(`https://api.gearfocus.div4.pgtest.co/apiAdmin/vendors/list`, { headers: { Authorization: `${auth}` } });

                if (!dataVendors?.data?.errors) {
                    dispatch(setVendors(dataVendors.data));
                } else {
                    alert('Có lỗi xảy ra!');
                }
                

                setIsLoading(false);
            } catch (error: any) {
                throw new Error(error);
            }
        }

        const getConditions = async() => {
            try {
                const dataConditions = await axios.get(`https://api.gearfocus.div4.pgtest.co/apiAdmin/conditions/list`, { headers: { Authorization: `${auth}` } });
                if (!dataConditions?.data?.errors) {
                    dispatch(setConditions(dataConditions.data));
                } else {
                    alert('Có lỗi xảy ra!');
                }
            } catch (error: any) {
                throw new Error(error);
            }
        }

        const getCountries = async() => {
            try {
                const dataCountries = await axios.get(API_PATHS.getCountries, { headers: { Authorization: `${auth}` } });
                
                if (!dataCountries?.data?.errors) {
                    dispatch(setCountries(dataCountries?.data));
                } else {
                    alert('Có lỗi xảy ra!');
                }
            } catch (error: any) {
                throw new Error(error);
            }
        }

        getCategories();
        getBrands();
        getVendors();
        getConditions();
        getCountries();
        getShipping();
    }, [dispatch]);

    useEffect(() => {
        const getProducts = async() => {
            try {
                setIsLoading(true);

                const dataProducts = await axios.post(`https://api.gearfocus.div4.pgtest.co/api/products/list`, {"page": currentPage,"count": perPage,"search": search.seachKeyword,"category": search.category,"stock_status": search.stock,"availability": search.available,"vendor": search.vendor,"sort": search.sort,"order_by": search?.order_by,"search_type": search.searchIn.toString()});

                if (!dataProducts?.data?.errors) {
                    dispatch(setProducts(dataProducts.data));
                    setProduct(dataProducts.data.data);
                } else {
                    alert('Có lỗi xảy ra!');
                }
                

                setIsLoading(false);
            } catch (error: any) {
                throw new Error(error);
            }
        }

        getProducts();
    }, [dispatch, perPage, currentPage, isSearch, isChange, isReload, isArrangeActive]);
    
    useEffect(() => {
        const searchVendor = async() => {
            if (vendorKeyword.trim().length === 0) {
                setVendorList([]);
            } else {
                try {
                    setIsLoadingVendor(true);

                    const dataVendors = await axios.post(`https://api.gearfocus.div4.pgtest.co/apiAdmin/vendors/list`,{search: `${vendorKeyword}`}, { headers: { Authorization: `${auth}` } });

                    if (!dataVendors?.data?.errors) {
                        setVendorList(dataVendors?.data?.data);
                    } else {
                        alert('Có lỗi xảy ra!');
                    }

                    setIsLoadingVendor(false);
                } catch (error: any) {
                    throw new Error(error);
                    
                }
            };
        }

        searchVendor();

    }, [vendorKeyword]);

   

    const handleSearchData = () => {
        setIsSearch(!isSearch);
    }

    const handleCheckedSearch = (e: any) => {
        const checked = e.target.checked;
        const value = e.target.value;

        if (checked) {
            setSearch({ ...search, searchIn: [...search.searchIn, value] });
        } else {
            search.searchIn.map((item: any, index: number) => {
                if (item.includes(value)) {
                    search.searchIn.splice(index, 1);
                    setSearch({ ...search, searchIn: [...search.searchIn] });
                }
            });
        }
    }

    const handleCheckedItems = (e: any) => {
        const { checked, value } = e.target;

        if (checked) {
            setIsChecked([...isChecked, value]);
        } else {
            setIsChecked(isChecked.filter((item: any) => item!== value));
        }
    }
    
    const handleArrange = (e: any) => {
        const keyword = e.target.title;
        
        const changeArrange = (keyword: string) => {
            if (search?.sort !== keyword) {
                setSearch({ ...search, sort: keyword });
            } else {
                if (search?.order_by !== 'ASC') {
                    setSearch({ ...search, order_by: 'ASC' });
                } else {
                    setSearch({ ...search, order_by: 'DESC' });
                }
            }
        };

        switch (keyword) {
            case 'sku':
                changeArrange(keyword);
                break;
            
            case 'name':
                changeArrange(keyword);
                break;

            case 'price':
                changeArrange(keyword);
                break;

            case 'amount':
                changeArrange(keyword);
                break;

            case 'vendor': 
                changeArrange(keyword);
                break;

            case 'arrivalDate': 
                changeArrange(keyword);
                break;

            default:
                break;
        }

        setIsArrangepActive(!isArrangeActive);
    }

    const handleCheckAll = (e: any) => {
        const checked = e.target.checked;
        const indexProducts: string[] = [];

        if (product) {
            store?.products?.data?.map((product: any) => (
                indexProducts.push(product.id)
            ))
        }

        if (checked) {
            setCheckedAll([...indexProducts]);
            setIsChecked([...indexProducts]);
        } else {
            setCheckedAll([]);
            setIsChecked([]);
        }

    }

    const handleDeleteProducts = useCallback(async() => {
        setIsLoading(true);
        if (checkedAll.length === 0 && isChecked.length > 0) {
           try {
                const dataResponse = await axiosAPI({
                    method: 'POST',
                    url: API_PATHS.editProduct,
                    payload: { params: [...isChecked.map((item: any) => ({ "id": item, "delete": 1 }))] },
                    header: { Authorization: `${auth}` }
                });

                if (!dataResponse?.data?.errors) {
                    alert("Xóa thành công");
                    setIsReload(!isReload);
                }
           } catch (error: any) {
                throw new Error(error);
           }
            
        } else if (checkedAll.length > 0) {
            try {
                const dataResponse = await axiosAPI({
                    method: 'POST',
                    url: API_PATHS.editProduct,
                    payload: { params: [...checkedAll.map((item: any) => ({ "id": item, "delete": 1 }))] },
                    header: { Authorization: `${auth}` }
                });

                if (!dataResponse?.data?.errors) {
                    alert("Xóa thành công");
                    setIsReload(!isReload);
                }
            } catch (error: any) {
                throw new Error(error);
            }
        } else if (!!Number(deleteId)) {
            try {
                const dataResponse = await axiosAPI({
                    method: 'POST',
                    url: API_PATHS.editProduct,
                    payload: { params: [{ "id": deleteId, "delete": 1 }] },
                    header: { Authorization: `${auth}` }
                });

                if (!dataResponse?.data?.errors) {
                    alert("Xóa thành công");
                    setIsReload(!isReload);
                }
            } catch (error: any) {
                throw new Error(error);
            }
        } 

        setIsModalDelete(false);
        window.scrollTo(0, 0);
        setIsLoading(false);
            
    }, [checkedAll, isChecked, deleteId]);
    

    const handleActiveProduct = (value: any) => {
        const values = value?.target?.parentNode?.closest("tr")?.id;
        const active = value?.target?.parentNode?.closest("tr")?.dataset?.active;

        if (values && active) {
            setIsActive(active);
            setIsModalActive(true);
            setSelectedProduct(values);
        }
    }

    const handleEditProducts = useCallback(async() => {
        try {
            const dataResponse = await axiosAPI({
                method: 'POST',
                url: API_PATHS.editProduct,
                payload: { params: [...productsData] },
                header: { Authorization: `${auth}` }
            });

            if (!dataResponse?.data?.errors) {
                alert("Cập nhật thành công");
                setIsReload(!isReload);
            }

            setIsModalEdit(false);
            window.scrollTo(0, 0);

        } catch (error: any) {
            throw new Error(error);
            
        }
    }, [productsData]);

    

    const handleConfirmChange = useCallback(() => {
        try {
            const activeChange = async() => {
                if (!selectedProduct) return;
    
                try {
                    const dataActive = await axios.post(`https://api.gearfocus.div4.pgtest.co/apiAdmin/products/edit`,{params: [{id: selectedProduct, enable: !!Number(isActive) ? 0 : 1}]}, { headers: { Authorization: `${auth}` } });
    
                    if (!dataActive?.data?.errors || dataActive.data.data) {
                        setChange(!isChange);
                    } else {
                        alert('Có lỗi xảy ra!');
                    }
    
                    setIsModalActive(false);
    
                } catch (error) {
                    
                }
            }

            activeChange();
        } catch (error: any) {
            throw new Error(error);
        }
    }, [selectedProduct, isActive]);

    
    useEffect(() => {
                
        const productsStore = store?.products?.data;
        const products = product.map((item: any, index: number) => {
            if (item.id === productsStore[index].id && (item.price !== productsStore[index].price || item.amount !== productsStore[index].amount)) {
                return { id: item.id, price:  Number(item.price).toFixed(2).toString(), stock: item.amount };
            }
        }).filter((item: any) => item);

        setProductsData(products);
        
        
        
    }, [product]);

    console.log('re-render');
    
        
    return (
        <div className="warpper">
            {
                isLoading && <LoadingComponent/>
            }
            <h2 className="title">Danh sách sản phẩm</h2>

            <div>
                {
                    isModalActive && 
                    
                    <ModalComponent
                        isClose={isModalActive}
                        content="Bạn có muốn thay đổi trường này không?"
                        onClose={() => setIsModalActive(false)}
                        onConfirm={handleConfirmChange}
                    />
                }

                {
                    isModalDelete && 

                    <ModalComponent
                        isClose={isModalDelete}
                        content="Bạn có muốn xóa trường này không?"
                        onClose={() => setIsModalDelete(false)}
                        onConfirm={handleDeleteProducts}
                    />
                }

                {
                    isModalEdit && 
                    <ModalComponent
                        isClose={isModalEdit}
                        content="Bạn có muốn thay đổi không?"
                        onClose={() => setIsModalEdit(false)}
                        onConfirm={handleEditProducts}
                    />
                }

                <div className="box-main-search">
                    <div className="box-search">
                        <InfoComponent
                            type="inputText"
                            placeholder="Seach Keywords"
                            className="homeSearch"
                            onChangeInput={(value) => setSearch({ ...search,  seachKeyword: value.target.value})}
                            onKeyUp={(e: any) => {
                                if (e.keyCode === 8) {
                                    if (search?.seachKeyword.trim().length === 0) {
                                        setSearch({ ...search,  category: e.target.value})   
                                    }
                                }
                            }}
                        />

                        <SelectComponent
                            className="width300"
                            data={store.categories} 
                            onSelectChange={(e: any) => setSearch({ ...search,  category: e.target.value})}
                        />

                        <SelectComponent
                            className="width300"
                            data={stocksStatus}
                            onSelectChange={(e: any) => setSearch({ ...search,  stock: e.target.value})}
                        />

                        <ButtonComponent
                            variant="primary"
                            value="Search"
                            type="submit"
                            icon=""
                            size="m"
                            onClick={handleSearchData}
                        />
                    </div>

                    {
                        isExpandSearch && (
                            <div className="expand-search">
                                <div className="d-flex search-in">
                                    <p className="title">Search in:</p>

                                    <div className="d-flex flex-column">
                                        {
                                            searchIn?.map((item: any) => (
                                                <div key={item.value}>
                                                    <input type="checkbox" id={item.value} value={item.value} onChange={handleCheckedSearch} />
                                                    <label htmlFor={item.value}>{item.title}</label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                                <div className="d-flex search-in">
                                    <p className="title">Availability:</p>

                                    <div className="d-flex flex-column">
                                        <SelectComponent
                                            className="width300"
                                            data={availabilityStatus}
                                            onSelectChange={(e: any) => setSearch({ ...search,  available: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex search-in">
                                    <p className="title">Vendor:</p>

                                    <div className="d-flex flex-column align-items-center vendor-box">
                                        <InputComponent
                                            unit=""
                                            placeholder=""
                                            type="text"
                                            className="width300"
                                            inputRef={selectedVendor}
                                            time={1000}
                                            setValueInput={(value) => setVendorKeyword(value)}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 8) {
                                                    setVendorList([]);
                                                }
                                            }}
                                        />
                                        
                                        {
                                            isLoadingVendor && <FontAwesomeIcon icon={faSpinner} className="vendor-spinner" />
                                        }

                                        {
                                            vendorList.length > 0 && (
                                                <div className="search-data">
                                                    {
                                                        vendorList.map((vendor: any, index: number) => (
                                                            <p key={index} onClick={() => {
                                                                setSearch({ ...search, vendor: vendor.name });
                                                                setVendorList([]);
                                                                
                                                                setSelectedVendor(vendor.name);
                                                            }} className="vendor-item">{ vendor.name }</p>
                                                        ))
                                                    }

                                                </div> 
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }

                        
                </div>

                <div className="expand-btn">
                    <ButtonComponent
                        variant=""
                        value=""
                        type="button"
                        icon={isExpandSearch ? <FontAwesomeIcon icon={faChevronUp}/> : <FontAwesomeIcon icon={faChevronDown}/>}
                        size="n"
                        onClick={() => setIsExpandSearch(!isExpandSearch)}
                    />
                </div>
            </div>

            <div>
                <ButtonComponent
                    variant="primary"
                    value="Thêm sản phẩm"
                    type="button"
                    icon=""
                    size="m"
                    onClick={() => navigate(ROUTES.addProduct)}
                />
                <div className="table-box">
                    <table className="table">
                        <thead>
                            <tr>
                                <th colSpan={2} className="widthTable100">
                                     <input
                                        type="checkbox"
                                        onChange={handleCheckAll}
                                        value="all"
                                        />
                                </th>

                                <th className="widthTable300"><span title="sku" onClick={handleArrange}>SKU { search.sort === "sku" ? ( search.order_by === "DESC" ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} /> ) : '' } </span></th>
                                <th className="widthTable500"><span title="name" onClick={handleArrange}>Name { search.sort === "name" ? ( search.order_by === "DESC" ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} /> ) : '' } </span></th>
                                <th className="widthTable500">Category</th>
                                <th className="widthTable300"><span title="price" onClick={handleArrange}>Price { search.sort === "price" ? ( search.order_by === "DESC" ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} /> ) : '' } </span></th>
                                <th className="widthTable300"><span title="amount" onClick={handleArrange}>In Stock { search.sort === "amount" ? ( search.order_by === "DESC" ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} /> ) : '' } </span></th>
                                <th className="widthTable300"><span title="vendor" onClick={handleArrange}>Vendor { search.sort === "vendor" ? ( search.order_by === "DESC" ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} /> ) : '' } </span></th>
                                <th className="widthTable300"><span title="arrivalDate" onClick={handleArrange}>Arrival Date { search.sort === "arrivalDate" ? ( search.order_by === "DESC" ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} /> ) : '' } </span></th>
                                <th></th>
                            </tr>
                        </thead>

                        <TableComponent
                            data={product}
                            isChecked={isChecked}
                            onActive={handleActiveProduct}
                            setCheckedSearch={handleCheckedItems}
                            deleteItem={(e: any) => {
                                const id = e.target?.parentNode?.dataset?.id
                                setDeleteId(id);
                                setIsModalDelete(true);
                            }}
                            setPriceItem={(index: number, value: string) => {
                                const cloneProduct = JSON.parse(JSON.stringify(product));
                                cloneProduct[index] = { ...cloneProduct[index], price: value };
                                
                                setProduct([...cloneProduct]);
                            }}
                            setQuantityItem={(index: number, value: string) => {
                                const cloneProduct = JSON.parse(JSON.stringify(product));
                                cloneProduct[index] = { ...cloneProduct[index], amount: value };
                                
                                setProduct([...cloneProduct]);
                            }}
                        />

                        
                    </table>
                </div>

                <div className="tfoot">
                    <div className="panigation">
                            <PanigationComponent
                                pages={productsPerPage}
                                changeTotal={perPage}
                                setCurrentPage={(value: number) => { 
                                    if (typeof(value) === 'number') {
                                        setCurrentPage(value);
                                        setIsChecked([]);
                                    } 
                                }}
                            />
                    </div>

                    <div className={`changeNumber d-flex align-items-center`}>
                        <p>{ store?.products?.recordsTotal } Items</p>

                        <SelectComponent
                            className="width80"
                            data={pagesNumber}
                            onSelectChange={(e: any) => {
                                setPerpage(Number(e.target.value));
                                setIsChecked([]);
                            }}
                        />
                    </div>

                </div>
                <div className="deleteBox">
                    <button onClick={() => setIsModalDelete(true)} disabled={isChecked.length === 0 && checkedAll.length === 0 ? true : false} className={isChecked.length === 0 && checkedAll.length === 0 ? "deleteButton" : "deleteButton active"}>Delete</button>
                    <button  onClick={() => setIsModalEdit(true)} disabled={productsData.length === 0 ? true : false} className={productsData.length === 0 ? "deleteButton" : "deleteButton active"} >Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
}

export default ProductList;