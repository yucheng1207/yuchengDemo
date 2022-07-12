export interface IOffsetPaginationResponse<T> {
	list: T[];
	pagination: IOffsetPagination;
	ext?: any;
}


export interface IOffsetPagination {
	/**
	 * 当前页数
	 */
	page: number;
	/**
	 * 每页条数
	 */
	size: number;
	/**
	 * 数据总数
	 */
	total: number;
}

/**
 * 偏移分页参数
 */
export interface IOffsetPaginationParams {
	page?: number;
	size?: number;
}


