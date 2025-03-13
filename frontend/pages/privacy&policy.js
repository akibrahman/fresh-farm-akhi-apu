import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Privacy Policy for FarmFresh
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="mb-6 text-gray-600">
            If you require any more information or have any questions about our
            privacy policy, please feel free to contact us by email at
            <a href="mailto:contact@elevatemart.com">contact@elevatemart.com</a>
            .
          </p>

          <p className="mb-6 text-gray-600">
            At www.elevatemart.com we consider the privacy of our visitors to be
            extremely important. This privacy policy document describes in
            detail the types of personal information is collected and recorded
            by www.elevatemart.com and how we use it.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Log Files
          </h2>
          <p className="mb-6 text-gray-600">
            Like many other Web sites, www.elevatemart.com makes use of log
            files. These files merely logs visitors to the site – usually a
            standard procedure for hosting companies and a part of hosting
            services's analytics. The information inside the log files includes
            internet protocol (IP) addresses, browser type, Internet Service
            Provider (ISP), date/time stamp, referring/exit pages, and possibly
            the number of clicks. This information is used to analyze trends,
            administer the site, track user's movement around the site, and
            gather demographic information. IP addresses, and other such
            information are not linked to any information that is personally
            identifiable.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Cookies and Web Beacons
          </h2>
          <p className="mb-6 text-gray-600">
            www.elevatemart.com uses cookies to store information about
            visitors' preferences, to record user-specific information on which
            pages the site visitor accesses or visits, and to personalize or
            customize our web page content based upon visitors' browser type or
            other information that the visitor sends via their browser.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            DoubleClick DART Cookie
          </h2>
          <ul className="list-disc list-inside mb-6 text-gray-600">
            <li className="mb-2">
              Google, as a third party vendor, uses cookies to serve ads on
              www.elevatemart.com.
            </li>
            <li className="mb-2">
              Google's use of the DART cookie enables it to serve ads to our
              site's visitors based upon their visit to www.elevatemart.com and
              other sites on the Internet.
            </li>
            <li className="mb-2">
              Users may opt out of the use of the DART cookie by visiting the
              Google ad and content network privacy policy at the following URL
              –{" "}
              <a
                href="http://www.google.com/privacy_ads.html"
                className="text-blue-600 hover:underline"
              >
                http://www.google.com/privacy_ads.html
              </a>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Our Advertising Partners
          </h2>
          <p className="mb-4 text-gray-600">
            Some of our advertising partners may use cookies and web beacons on
            our site. Our advertising partners include:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-600">
            <li>Google</li>
            <li>Commission Junction</li>
            <li>Amazon</li>
            <li>Adbrite</li>
            <li>Clickbank</li>
            <li>Yahoo! Publisher Network</li>
            <li>Chitika</li>
            <li>Kontera</li>
          </ul>

          <p className="mb-6 text-gray-600 italic">
            While each of these advertising partners has their own Privacy
            Policy for their site, an updated and hyperlinked resource is
            maintained here:{" "}
            <a
              href="https://www.privacypolicyonline.com/privacy-policy-links/"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy Links
            </a>
            .
          </p>

          {/* Add more sections here */}

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Consent
          </h2>
          <p className="mb-6 text-gray-600">
            By using our website, you hereby consent to our privacy policy and
            agree to its terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Update
          </h2>
          <p className="mb-6 text-gray-600">
            This Privacy Policy was last updated on: Jul 20, 2024. Should we
            update, amend or make any changes to our privacy policy, those
            changes will be posted here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
