import axios from "axios";
import { Form, Formik } from "formik";
import { navigate } from "gatsby";
import React, { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { Aubtn, AuFormGroup } from "../../../types/auds";
import { IApiFormError, ILoginType } from "../../../types/types";
import { formatApiError } from "../../../util/formatApiError";
import ClientErrorDisplay from "../../blocks/clientErrors";
import PageAlert from "../../blocks/pageAlert";
import PasswordField from "../fields/PasswordField";
import TextField from "../fields/TextField";
import { initialValues, validationSchema } from "./loginSchema";

interface LoginProps {
  fromPage: string;
}

const LoginForm: React.FC<LoginProps> = ({ fromPage }: LoginProps) => {
  const [errorList, setErrorList] = useState<IApiFormError[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const user = useContext(UserContext);

  const HandleLoginUser = async (formData: ILoginType) => {
    setSaving(true);
    setErrorList([]);

    const { email, password } = formData;
    user.updateToken();
    try {
      const result = await axios.post(`/api/user/authenticate`, {
        EmailAddress: email,
        password,
      });

      if (result.status === 200) {
        user.updateToken(result.data.token, result.data.refreshToken, {
          userId: result.data.userId,
          name: result.data.name,
          role: result.data.role,
        });
        navigate(fromPage);
        return;
      }
    } catch (e) {
      setErrorList([
        {
          message: e.response.data.message,
          path: "Invalid",
        },
      ]);
    }
    setSaving(false);
  };

  return (
    <>
      {errorList && errorList.length > 0 && (
        <PageAlert type="error" className="max-30">
          <>
            <h2>There was an error</h2>
            {formatApiError(errorList)}
          </>
        </PageAlert>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          HandleLoginUser(values);
        }}
      >
        {({ errors, handleSubmit, submitForm }) => (
          <Form
            method="post"
            onSubmit={(e) => {
              handleSubmit(e);
              if (Object.keys(errors).length < 1) return;
              setIsError(true);
              document.title = "Errors | Sign up form";
              const timeout = setTimeout(() => {
                const errorSum = document.getElementById(
                  "error-heading"
                ) as any;
                if (errorSum && errorSum.focus()) {
                  errorSum.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
                clearTimeout(timeout);
              }, 500);
            }}
          >
            {isError && Object.keys(errors).length > 0 && (
              <ClientErrorDisplay errors={errors} />
            )}
            <TextField id="email" label="Email" width={"xl"} required />
            <PasswordField
              id="password"
              label="Password"
              width={"xl"}
              required
            />

            <AuFormGroup>
              <Aubtn type="submit" onClick={submitForm} disabled={saving}>
                {saving ? "Submitting" : "Login"}
              </Aubtn>
            </AuFormGroup>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
