import React, { useState, useEffect } from "react";

const CVInfoModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("seenCVModal");
    if (!hasSeenModal) {
      setShowModal(true);
      localStorage.setItem("seenCVModal", "true");
    }
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md text-center relative animate-fadeIn">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          CV Auto Fill
        </h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
           If you chose the &qout;Talent&qout; role or want to be a &qout;Both&qout;, you can upload your CV, and it will be automatically analyzed to fill in your personal information. You can also enter your details manually if you prefer.
        </p>
        <button
          onClick={() => setShowModal(false)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-xl hover:opacity-90 transition"
        >
            Got it
        </button>
      </div>
    </div>
  );
};

export default CVInfoModal;

