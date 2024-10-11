export const parseUrlParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
  }
  return params;
};

export const getPaymentResult = (url: string) => {
  const params = parseUrlParams(url);
  return {
    code: params.code,
    message: params.message,
    paymentId: params.paymentId,
    pgCode: params.pgCode,
    pgMessage: params.pgMessage,
    transactionType: params.transactionType,
    txId: params.txId,
    status: params.status,
    storeId: params.storeId,
  };
};
