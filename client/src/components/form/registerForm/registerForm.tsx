import axios from "axios";
import { Form, Formik } from "formik";
import { navigate } from "gatsby";
import React, { useEffect, useState } from "react";
import { Aubtn, AuFormGroup } from "../../../types/auds";
import { IApiFormError, IRegisterType } from "../../../types/types";
import { formatApiError } from "../../../util/formatApiError";
import ClientErrorDisplay from "../../blocks/clientErrors";
import PageAlert from "../../blocks/pageAlert";
import PasswordField from "../fields/PasswordField";
import SelectField from "../fields/SelectField";
import TextField from "../fields/TextField";
import { InitialValues, validationSchema } from "./schema";
import { useLookupHook } from "../../../hooks";

const RegisterForm: React.FC = () => {
  const [errorList, setErrorList] = useState<IApiFormError[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const agency = useLookupHook('agency');

  const handleRegisterUser = async (formData: IRegisterType) => {
    setSaving(true);
    setErrorList([]);
    const { emailAddress, password, name, agency } = formData;
    try {
      const result = await axios.post(`/api/user/register`, {
        name,
        emailAddress,
        password,
        agency,
      });
      navigate("/verify-account/", { state: { submitted: true } });
    } catch (e) {
      if (e.response.status === 400) {
        let errors: IApiFormError[] = [];
        for (const property in e.response.data.errors) {
          for (const message of e.response.data.errors[property]) {
            errors.push({
              message,
              path: property,
            });
          }
        }
        setErrorList(errors);
      }
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
        initialValues={InitialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          handleRegisterUser(values);
        }}
      >
        {({ errors, handleSubmit, submitForm }) => (
          <Form
            method="post"
            noValidate
            className="mb-2"
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

            <TextField
              id="name"
              label="Your name"
              width="lg"
              type="text"
              required
            />
            <TextField
              id="emailAddress"
              label="Email"
              width="lg"
              type="email"
              required
            />
            <TextField
              id="mobile"
              label="Mobile number"
              width="m"
              hint="We’ll send you a security code by text message"
              type="text"
              required
            />
            <SelectField
              id="agency"
              label="Department/Agency name"
              width="lg"
              options={agency.data}
              required
            />
            <PasswordField
              id="password"
              hint="Minimum 8 characters, including one uppercase, one lowercase, one number and one special case character"
              label="Create a password"
              width="lg"
              required
            />
            <TextField
              id="passwordConfirm"
              label="Confirm your password"
              type="password"
              width="lg"
              required
            />
            <AuFormGroup>
              <Aubtn type="submit" onClick={submitForm} disabled={saving}>
                {saving ? "Submitting" : "Register"}
              </Aubtn>
            </AuFormGroup>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RegisterForm;
