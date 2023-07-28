import React, { useState } from 'react';
import "./App.css";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const SPECIAL_CHARS = "!@#$%^&*()_+[]{};':\"\\|,.<>/?";
const PASSWORD_LENGTH = 25;

function PasswordGenerator() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const getRandomWords = async () => {
        try {
            const response = await fetch("https://random-word-api.herokuapp.com/word?number=2");
            const words = await response.json();
            return words;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    const generatePasswordAndEmail = async () => {
        const wordsArray = await getRandomWords();

        // Generate 4 digit prefix for password
        let prefixPassword = '';
        for(let i = 0; i < 4; i++) {
            prefixPassword += Math.floor(Math.random() * 10);  // Generate a random digit 0-9
        }

        // Generate 3 digit suffix for email
        let suffixEmail = '';
        for(let i = 0; i < 3; i++) {
            suffixEmail += Math.floor(Math.random() * 10);  // Generate a random digit 0-9
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

        // Generate email with random length from 8 to 11, including 3 digits at the end
        let baseEmail = wordsArray.join('').substr(0, 5);
        const emailLength = Math.floor(Math.random() * (11 - 8 + 1)) + 8;  // Random length between 8 and 11

        while(baseEmail.length < (emailLength - 3)) {
            const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
            baseEmail += randomChar;
        }

        const email = `${baseEmail}${suffixEmail}@outlook.com`;
        setEmail(email);
    }

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    }

    return (
        <div className="app-container">
            <button className="generate-btn" onClick={generatePasswordAndEmail}>Generate Password and Email</button>
            <p className="email-display">Your email: <span className="email-text">{email}</span> <button className="copy-btn" onClick={() => handleCopyToClipboard(email)}>Copy Email</button></p>
            <p className="password-display">Your password: <span className="password-text">{password}</span> <button className="copy-btn" onClick={() => handleCopyToClipboard(password)}>Copy Password</button></p>
        </div>
    );
}

export default PasswordGenerator;
