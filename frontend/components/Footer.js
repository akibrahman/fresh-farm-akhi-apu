import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-lightBlue-500 text-black p-4 mt-auto border-t border-gray-400 shadow-inner">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between">
        <p className="text-sm">&copy; 2024 ElevateMart</p>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/privacy&policy"
              className="text-black hover:text-blue-800"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              href="/terms&conditions"
              className="text-black hover:text-blue-800"
            >
              Terms of Service
            </Link>
          </li>
          <li>
            <a href="/contactUs" className="text-black hover:text-blue-800">
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
