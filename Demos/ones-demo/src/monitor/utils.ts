/**
 * 提取 url 中的 query 参数
 * @param url
 * @returns
 */
export const extractQueryInUrl = (url: string) => {
  let urlWithoutSearch = url;
  let search = '';
  if (url.indexOf('?') !== -1) {
    urlWithoutSearch = url.substring(0, url.indexOf('?'));
    search = url.substring(url.indexOf('?'));
  }
  return {
    search,
    urlWithoutSearch,
  };
};

/**
 * 如果开头第一个字符是斜杠，过滤掉该斜杠
 * @param url
 * @returns
 */
export const filterLeadingSlash = (url: string) => {
  if (url.startsWith('/')) {
    return url.substring(1);
  }
  return url;
};

// 将字符串开头替换成 prefix 字符串
export const replaceStartStringWithPrefix = (pathname: string, prefix: string) => {
  const arr = pathname.split('/');
  const prefixArr = prefix.split('/');
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const remainingStr = arr.slice(prefixArr.length).join('/');
  return {
    prefix, // 前缀
    remainingStr, // 除前缀以外的字符串
    pathname: `${prefix}/${remainingStr}`,
  };
};
