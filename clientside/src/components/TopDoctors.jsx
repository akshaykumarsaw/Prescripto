import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-6 my-16 text-slate-800 md:mx-10">
      <h1 className="text-3xl md:text-4xl font-semibold text-center">Top Doctors to Book</h1>
      <p className="sm:w-1/2 text-center text-slate-500 font-inter text-sm md:text-base">
        Browse through our extensive list of highly-rated, verified professionals.
      </p>

      <div className="w-full grid grid-cols-auto gap-6 pt-5 px-3 sm:px-0 mt-4">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            <div className="bg-blue-50">
              <img className="bg-blue-50" src={item.image} alt={item.name} />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'
                    }`}
                >
                  <p
                    className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'
                      } rounded-full`}
                  ></p>
                  <p>{item.available ? 'Available' : 'Not Available'}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  ★ <span className="text-gray-600 font-medium font-inter">{item.rating > 0 ? item.rating.toFixed(1) : "4.8"}</span>
                  {item.reviews && item.reviews.length > 0 && (
                    <span className="text-gray-400 text-xs">({item.reviews.length})</span>
                  )}
                </div>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/doctors");
          window.scrollTo(0, 0);
        }}
        className="mt-10 bg-white text-slate-700 border border-slate-200 px-10 py-3 rounded-full font-medium hover:bg-slate-50 hover:shadow-md transition-all hover:-translate-y-0.5"
      >
        View Doctors
      </button>
    </div>
  );
};

export default TopDoctors;
