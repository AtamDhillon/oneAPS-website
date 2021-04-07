import * as React from "react";
import DefaultLayout from "../components/layouts/default-layout";
import SEO from "../components/seo";
import { PageContext } from "../types/types";

// markup
const EmailConfirmation: React.FC<PageContext> = ({
  pageContext,
  location,
}) => {
  return (
    <DefaultLayout pageContext={pageContext} location={location}>
      <>
        <SEO title="Register" />
        <div className="container-fluid au-body">
          <h1>Check your email</h1>
          <p>Please click the link in your email to confirm your account</p>
        </div>
      </>
    </DefaultLayout>
  );
};

export default EmailConfirmation;