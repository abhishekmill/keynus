const callServerAction = async (serverAction: any, data?: any) => {
  const result = await serverAction(data);
  if (
    (result?.isSuccess !== undefined && !result.isSuccess) ||
    (result?.success !== undefined && !result.success) ||
    (result?.status && result.status !== 200) ||
    result?.error
  ) {
    return Promise.reject(result);
  }

  return result;
};

export default callServerAction;
