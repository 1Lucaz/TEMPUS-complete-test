import React from 'react';
import './styles.css';

export default function InputField({ label, placeholder, type = 'text', value, onChange }) {
  return (
    <div className='input-field'>
      <label className='input-label'>{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange} 
        className='input-element'
      />
    </div>
  );
}