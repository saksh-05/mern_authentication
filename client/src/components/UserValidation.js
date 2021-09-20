import * as yup from "yup";

export const userEmailSchema = yup.object().shape({
  email: yup.string().email().required("required"),
});

export const userPasswordSchema = yup.object().shape({
  password: yup.string().required("required"),
})
