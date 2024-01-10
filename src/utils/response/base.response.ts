import { ResponseSuccess, ResponsePagination } from "src/interface";

class BaseResponse {
  _Success(message: string, data?: any): ResponseSuccess {
    return {
      status: 'Success',
      message: message,
      data: data || {}
    }
  }
  _Pagination(message: string, data: any, totalData: number, page: number, pageSize: number): ResponsePagination {
    return {
      status: 'Success',
      message: message,
      data: data,
      pagination: {
        total: totalData,
        page: page,
        pageSize: pageSize,
      }
    }
  }
}
export default BaseResponse;