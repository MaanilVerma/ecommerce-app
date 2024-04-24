export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
};

export const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (passwordRegex.test(password)) {
    return true;
  } else {
    return false;
  }
};

export const validateOTP = (otp: string) => {
  const passwordRegex = /^\d+$/;
  if (passwordRegex.test(otp)) {
    return true;
  } else {
    return false;
  }
};

export const hideEmail = (email: string) => {
  const atIndex = email?.indexOf("@");
  if (atIndex !== -1) {
    const [username, domain] = email?.split("@");
    const hiddenUsername =
      (username ?? "")?.slice(0, 3) + "*".repeat((username ?? "")?.length - 3);
    return `${hiddenUsername}@${domain}`;
  } else {
    return email;
  }
};
