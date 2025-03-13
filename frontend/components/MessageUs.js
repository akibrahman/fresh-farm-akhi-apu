import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useSendMessageMutation } from '../store/slices/api/contactApiSlice';

const MessageUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });

  const [sendMessage, { isLoading, isError, isSuccess }] = useSendMessageMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(formData).unwrap();
      setFormData({ fullName: '', email: '', message: '' });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
      <div
          className="min-h-screen flex items-center justify-center font-sans bg-cover bg-center bg-no-repeat bg-message-us"
      >
        <div
            className="container mx-auto px-4 max-w-2xl bg-white bg-opacity-80 rounded-lg shadow-xl p-8 backdrop-blur-md">
          <h1 className="text-4xl font-extrabold mb-6 text-gray-900 text-center">Message Us</h1>
          <p className="text-base text-gray-700 mb-8 text-center">
            If you would like to be considered for employment or contact, please fill out
            this form. A member of our team will contact you shortly.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">Name</label>
              <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900 p-3 border border-gray-300"
                  required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900 p-3 border border-gray-300"
                  required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-900">Message</label>
              <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900 p-3 border border-gray-300"
                  required
              ></textarea>
            </div>
            <div className="flex items-center justify-center">
              <span
                  className="mr-4 self-center text-2xl font-semibold whitespace-nowrap text-gray-900">ElevateMart</span>
            </div>
            <div className="flex justify-center">
              <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading}
              >
                <Send className="w-5 h-5 mr-2"/>
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
          {isError && <p className="text-red-500 mt-4 text-center">Failed to send message. Please try again.</p>}
          {isSuccess && <p className="text-green-500 mt-4 text-center">Message sent successfully!</p>}
        </div>
      </div>
  );
};

export default MessageUs;
