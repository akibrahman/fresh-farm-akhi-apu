import React from "react";
import Head from "next/head";
import { formatToBangladeshDate } from "@/utils/formatDate";

const TermsAndConditions = () => {
  const date = new Date().toLocaleDateString("en-US");
  // const formattedDate = formatToBangladeshDate(date);
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Terms and Conditions - Elevate Mart</title>
        <meta
          name="description"
          content="Terms and Conditions for Elevate Mart"
        />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <p className="mb-4">
        Welcome to Elevate Mart. By accessing our website at
        www.elevatemart.com, you agree to these terms and conditions.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        1. Acceptance of Terms
      </h2>
      <p className="mb-4">
        By using our website, you agree to be bound by these Terms and
        Conditions and all applicable laws and regulations.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">2. Use of Site</h2>
      <p className="mb-4">
        You may use our site for lawful purposes only. You must not use our site
        in any way that causes, or may cause, damage to the site or impairment
        of the availability or accessibility of the site.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        3. Product Information
      </h2>
      <p className="mb-4">
        We strive to provide accurate product information, but we do not warrant
        that product descriptions or other content is accurate, complete,
        reliable, current, or error-free.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        4. Pricing and Availability
      </h2>
      <p className="mb-4">
        All prices are subject to change without notice. We reserve the right to
        modify or discontinue any product without notice.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">5. Privacy Policy</h2>
      <p className="mb-4">
        Please review our Privacy Policy, which also governs your visit to our
        website, to understand our practices.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">6. Modifications</h2>
      <p className="mb-4">
        We reserve the right to revise these Terms and Conditions at any time
        without notice. By using this website, you agree to be bound by the
        current version of these Terms and Conditions.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        7. Contact Information
      </h2>
      <p className="mb-4">
        If you have any questions about these Terms, please contact us at:{" "}
        <a href="mailto:efat131226@gmail.com">support.elevatemart.com</a>
      </p>

      <p className="mt-8 text-sm text-gray-600">{`Last updated: ${date}`}</p>
    </div>
  );
};

export default TermsAndConditions;
