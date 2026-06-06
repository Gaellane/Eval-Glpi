import React from 'react';

const DataListInput = ({ label, name, value, onChange, options, placeholder }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                list={`${name}-list`}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 p-2 rounded focus:ring-teal-500 focus:border-teal-500 outline-none"
                required
            />
            <datalist id={`${name}-list`}>
                {options.map((opt, index) => (
                    <option key={index} value={opt} />
                ))}
            </datalist>
        </div>
    );
};

export default DataListInput;