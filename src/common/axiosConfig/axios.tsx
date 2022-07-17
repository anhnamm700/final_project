import axios from "axios";
import Cookies from "js-cookie";

import { ACCESS_TOKEN_KEY } from "utils/constant";

interface Props {
    method: string,
    url: string,
    payload?: any,
    header?: any
}

const axiosAPI = async(props: Props) => {
    const { method, url, payload, header } = props;
    
    const dataResponse = axios({
        method: method,
        url: url,
        data: payload,
        headers: header
      })

    return dataResponse;
}

export default axiosAPI;