const refreshCookieOptions = {
  signed: true,
  // expires in 28 days
  expires: new Date(Date.now() + 6048000 * 4),
  maxAge: new Date(Date.now() + 6048000 * 4),
  // make secure true upon deployment
  secure: false,
  httpOnly: false,
  sameSite: true,
};
const accessCookieOptions = {
  signed: true,
  // 30 min expiration
  expires: 1800000,
  maxAge: 1800000,
  // make secure true upon deployment
  secure: false,
  httpOnly: false,
  sameSite: true,
};
const resetCookieOptions = {
  signed: true,
  // 30 min expiration
  expires: 1800000,
  maxAge: 1800000,
  // make secure true upon deployment
  secure: false,
  httpOnly: false,
  sameSite: true,
};

export { refreshCookieOptions, accessCookieOptions, resetCookieOptions };
