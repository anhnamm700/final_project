import { APIHost } from "utils/constant";

enum APIService {
  auth,
  protected,
  public,
  vendor
}

function getBaseUrl(service: APIService) {
  if (service === APIService.auth) {
    return `${APIHost}/authentication`;
  } else if (service === APIService.protected) {
    if (APIHost === '/api') return `/apiAdmin`;
    return `${APIHost}/apiAdmin`;
  }else if (service === APIService.vendor) {
      if (APIHost === '/api') return `/apiVendor`;
      return `${APIHost}/apiVendor`;
  } else if (service === APIService.public) {
    return `${APIHost}`; 
  }

  return '';
}

export const API_PATHS = {
  signIn: `${getBaseUrl(APIService.auth)}/login`,
  signUp: `${getBaseUrl(APIService.auth)}/register`,
  products: `${getBaseUrl(APIService.public)}/products/list`,
  users: `${getBaseUrl(APIService.protected)}/users/list`,
  categories: `${getBaseUrl(APIService.public)}/categories/list`,
  detailProduct: `${getBaseUrl(APIService.protected)}/products/detail`,
  detailUser: `${getBaseUrl(APIService.vendor)}/profile/detail`,
  createProduct: `${getBaseUrl(APIService.protected)}/products/create`,
  editProduct: `${getBaseUrl(APIService.protected)}/products/edit`,
  createUser: `${getBaseUrl(APIService.protected)}/users/create`,
  editUser: `${getBaseUrl(APIService.protected)}/users/edit`,
  updateImage: `${getBaseUrl(APIService.public)}/products/upload-image`,
  getCountries: `${getBaseUrl(APIService.protected)}/commons/country`,
  getShippings: `${getBaseUrl(APIService.protected)}/shipping/list`,
  getState: `${getBaseUrl(APIService.protected)}/commons/state`,
  getRoles: `${getBaseUrl(APIService.protected)}/commons/role`,
  userProfile: `${getBaseUrl(APIService.public)}/user`,
  getLocation: `${getBaseUrl(APIService.public)}/location`,
  getStateByLocation: `${getBaseUrl(APIService.public)}/location?pid=`,
};
