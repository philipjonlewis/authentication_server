const asyncHandler = (fn: (arg0: any, arg1: any, arg2: any) => any) => (req: any, res: any, next: ((reason: any) => PromiseLike<never>) | null | undefined) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
