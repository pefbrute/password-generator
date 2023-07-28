import React, { useState } from 'react';
import "./App.css";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const SPECIAL_CHARS = "!@#$%^&*()_+[]{};':\"\\|,.<>/?";
const PASSWORD_LENGTH = 25;

function PasswordGenerator() {
    const [inputWords, setInputWords] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const generatePasswordAndEmail = () => {
        const wordsArray = inputWords.split(" ");

        // Generate 4 digit prefix for password
        let prefixPassword = '';
        for(let i = 0; i < 4; i++) {
            prefixPassword += Math.floor(Math.random() * 10);  // Generate a random digit 0-9
        }

        // Generate 4 digit prefix for email
        let prefixEmail = '';
        for(let i = 0; i < 4; i++) {
            prefixEmail += Math.floor(Math.random() * 10);  // Generate a random digit 0-9
        }

        // Generate password with interspersed special characters
        const passwordArray = wordsArray.map(word => {
            let passwordWithSpecialChars = "";
            for(let i = 0; i < word.length; i++) {
                passwordWithSpecialChars += word[i];
                const randomSpecialChar = SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)];
                passwordWithSpecialChars += randomSpecialChar;
            }
            return passwordWithSpecialChars;
        });

        let password = prefixPassword + passwordArray.join('');

        // Ensure the password is exactly 16 characters long
        while(password.length < PASSWORD_LENGTH) {
            const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
            password += randomChar;
        }

        // If the generated password is too long, trim it to the desired length
        if(password.length > PASSWORD_LENGTH) {
            password = password.substr(0, PASSWORD_LENGTH);
        }

        // Ensure at least 3 special characters
        const specialCharCount = (password.match(new RegExp(`[${SPECIAL_CHARS}]`, 'g')) || []).length;
        for(let i = 4; i < (3 - specialCharCount + 4) && i < password.length; i++) {
            const randomSpecialChar = SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)];
            password = password.substr(0, i) + randomSpecialChar + password.substr(i + 1);
        }

        setPassword(password);

        const email = `${wordsArray.join('')}${prefixEmail}@outlook.com`;
        setEmail(email);
    }

    const handleInputChange = (event) => {
        setInputWords(event.target.value);
    }

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    }

    return (
        <div className="app-container">
            <input className="input-field" type="text" onChange={handleInputChange} />
            <button className="generate-btn" onClick={generatePasswordAndEmail}>Generate Password and Email</button>
            <p className="email-display">Your email: <span className="email-text">{email}</span> <button className="copy-btn" onClick={() => handleCopyToClipboard(email)}>Copy Email</button></p>
            <p className="password-display">Your password: <span className="password-text">{password}</span> <button className="copy-btn" onClick={() => handleCopyToClipboard(password)}>Copy Password</button></p>
        </div>
    );
}

export default PasswordGenerator;
