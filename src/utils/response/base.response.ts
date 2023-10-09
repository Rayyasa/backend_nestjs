import { ResponseSuccess, ResponsePagination } from "src/book/interface";

class BaseResponse {
  _Success(message: string, data?: any): ResponseSuccess {
    return {
      status: 'Success',
      message: message,
      data: data || {}
    }
  }
  _Pagination(message: string, data: any, totalData: number, page: number, pageSize: number,total_page:number, remaining_page:number): ResponsePagination {
    return {
      status: 'Success',
      message: message,
      data: data,
      pagination: {
        total: totalData,
        page: page,
        pageSize: pageSize,
        total_page: total_page,
        remaining_page:remaining_page
      }
    }
  }
}
export default BaseResponse;