export const validateRegister = (
  email: string,
  username: string,
  password: string
) => {
  if (email.length < 5) {
    return [
      {
        field: "email",
        message: "length must be greater than 4",
      },
    ];
  }

  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (username.length < 3) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }

  if (username.includes("@")) {
    return [
      {
        field: "username",
        message: "username must not contain an '@' symbol",
      },
    ];
  }

  if (password.length < 3) {
    return [
      {
        field: "password",
        message: "length must be greater than 2",
      },
    ];
  }

  return null;
};
