import React from 'react';
import { useGetMessagesQuery, useDeleteMessageMutation } from '../../store/slices/api/contactApiSlice';

const Contacts = () => {
    const { data: messages, error, isLoading } = useGetMessagesQuery();
    const [deleteMessage] = useDeleteMessageMutation();

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await deleteMessage(id).unwrap();
                alert('Message deleted successfully');
            } catch (err) {
                console.error('Failed to delete message: ', err);
            }
        }
    };

    if (isLoading) return <div className="text-gray-700">Loading...</div>;
    if (error) return <div className="text-red-500">Error loading messages</div>;

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Contact Messages</h1>
            {messages.length === 0 ? (
                <div className="text-gray-600">No messages found</div>
            ) : (
                <ul className="space-y-4">
                    {messages.map((message) => (
                        <li key={message._id} className="p-4 bg-white shadow-md rounded-md">
                            <p className="text-gray-700"><strong>Name:</strong> {message.fullName}</p>
                            <p className="text-gray-700"><strong>Email:</strong> {message.email}</p>
                            <p className="text-gray-700"><strong>Message:</strong> {message.message}</p>
                            <button 
                                onClick={() => handleDelete(message._id)} 
                                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Contacts;
