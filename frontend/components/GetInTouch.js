import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const GetInTouch = () => {
    return (
        <div className="bg-teal-700 text-white min-h-screen flex items-center justify-center font-sans">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl font-bold mb-12 text-center font-serif">Get In Touch</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ContactCard
                        Icon={MapPin}
                        title="Address"
                        details={[
                            "5th Floor, House 1289, Road 11, Avenue 02",
                            "Mirpur DOHS,Dhaka 1216"
                        ]}
                    />
                    <ContactCard
                        Icon={Phone}
                        title="Phone"
                        details={[
                            "Main: +8801708-562437"
                        ]}
                    />
                    <ContactCard
                        Icon={Mail}
                        title="Email"
                        details={[
                            "rijon.codeelevate@gmail.com",
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

const ContactCard = ({ Icon, title, details }) => {
    return (
        <div className="bg-teal-600 p-8 rounded-lg shadow-lg text-center transition-all duration-300 hover:bg-teal-500 hover:shadow-xl">
            <Icon className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4 font-serif">{title}</h2>
            {details.map((detail, index) => (
                <p key={index} className="mb-2 text-teal-100">{detail}</p>
            ))}
        </div>
    );
};

export default GetInTouch;