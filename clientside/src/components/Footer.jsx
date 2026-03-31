import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* ------------ Left Section ------------ */}
        <div>
          <img className="mb-5 w-40 hover:opacity-80 transition-opacity" src={assets.logo} alt="Prescripto Logo" />
          <p className="w-full md:w-2/3 text-slate-600 leading-relaxed font-inter">
            Prescripto is a modern healthcare platform connecting patients with trusted doctors.
            Experience seamless appointment scheduling, digital health record management, and expert
            medical consultations from the comfort of your home.
          </p>
        </div>

        {/* ------------ Center Section ------------ */}
        <div>
          <p className="text-xl font-medium mb-5 text-slate-800">COMPANY</p>
          <ul className="flex flex-col gap-3 text-slate-600">
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">Home</li>
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">About us</li>
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">Contact us</li>
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">Privacy policy</li>
          </ul>
        </div>

        {/* ------------ Right Section ------------ */}
        <div>
          <p className="text-xl font-medium mb-5 text-slate-800">GET IN TOUCH</p>
          <ul className="flex flex-col gap-3 text-slate-600">
            <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer w-fit">
              <span className="font-semibold">+1-234-567-8900</span>
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">
              support@prescripto.com
            </li>
          </ul>
        </div>
      </div>

      {/* ------------ Copyright Text ------------ */}
      <div>
        <hr className="border-slate-200" />
        <p className="py-6 text-sm text-center text-slate-500 font-inter">
          Copyright © {new Date().getFullYear()} Prescripto - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
