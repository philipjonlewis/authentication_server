class modifiedErrorHandler extends Error {
  status: string | undefined;
  payload: any;
  constructor(status: string | any, message: string | any, payload: any) {
    super();
    this.status = status;
    this.message = message;
    this.payload = payload;
  }
}

export default modifiedErrorHandler;
