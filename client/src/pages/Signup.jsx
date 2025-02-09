import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    RecaptchaVerifier, 
    signInWithPhoneNumber 
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Signup.css";

// Function to initialize reCAPTCHA properly
const setupRecaptcha = () => {
    // Prevent multiple instances
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: (response) => {
                console.log("Recaptcha resolved:", response);
            },
        });
    }
};

const Signup = () => {
    const [searchParams] = useSearchParams();
    const [signupType, setSignupType] = useState("Foodie");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        const type = searchParams.get("type");
        if (type === "Foodie" || type === "Food Seller") {
            setSignupType(type);
        }
    }, [searchParams]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            setIsButtonDisabled(false);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleGoogleSignup = async () => {
        if (!username.trim()) {
            alert("Please enter a username");
            return;
        }
        if (!acceptedTerms) {
            alert("Please accept the Terms and Conditions");
            return;
        }

        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Google User:", result.user);
        } catch (error) {
            console.error("Google Signup Error:", error);
        }
    };

    const sendOTP = async () => {
        if (!username.trim()) {
            alert("Please enter a username");
            return;
        }
        if (!phone) {
            alert("Please enter a valid phone number");
            return;
        }
        if (!acceptedTerms) {
            alert("Please accept the Terms and Conditions");
            return;
        }

        setIsButtonDisabled(true);

        try {
            setupRecaptcha(); // Ensure reCAPTCHA is properly set
            const appVerifier = window.recaptchaVerifier;
            const formattedPhone = `+${phone}`;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
            setIsVerifying(true);
            setTimer(60);
            console.log("OTP sent successfully");
        } catch (error) {
            console.error("Phone Signup Error:", error);
            alert("Error sending OTP. Please try again.");
            setIsButtonDisabled(false);
        }
    };

    const handlePhoneSignup = async () => {
        await sendOTP();
    };

    const handleResendOTP = async () => {
        if (timer > 0) return; // Prevent multiple clicks when timer is active
    
        setIsButtonDisabled(true);
    
        try {
            setupRecaptcha(); // Ensure fresh reCAPTCHA instance
            const appVerifier = window.recaptchaVerifier;
            const formattedPhone = `+${phone}`;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            
            setConfirmationResult(confirmation);
            setIsVerifying(true);
            setTimer(60); // Start countdown timer for resend
            console.log("OTP resent successfully");
        } catch (error) {
            console.error("Resend OTP Error:", error);
            alert("Error resending OTP. Please try again.");
        }
    
        setIsButtonDisabled(false); // Ensure button is re-enabled
    };    

    const verifyOtp = async () => {
        if (!otp) {
            alert("Please enter the OTP");
            return;
        }

        try {
            const result = await confirmationResult.confirm(otp);
            console.log("Phone User:", result.user);
        } catch (error) {
            console.error("OTP Verification Error:", error);
            alert("Invalid OTP. Please try again.");
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">Signup as {signupType}</h2>
            
            <div className="signup-input-container">
                <input
                    className="signup-input"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isVerifying}
                />
            </div>

            <div className="signup-type-selector">
                <label className="signup-type-label">
                    <input
                        className="signup-type-radio"
                        type="radio"
                        name="signupType"
                        value="Foodie"
                        checked={signupType === "Foodie"}
                        onChange={() => setSignupType("Foodie")}
                        disabled={isVerifying}
                    />
                    Foodie
                </label>
                <label className="signup-type-label">
                    <input
                        className="signup-type-radio"
                        type="radio"
                        name="signupType"
                        value="Food Seller"
                        checked={signupType === "Food Seller"}
                        onChange={() => setSignupType("Food Seller")}
                        disabled={isVerifying}
                    />
                    Food Seller
                </label>
            </div>

            {!isVerifying && (
                <>
                    <button 
                        className="signup-google-btn" 
                        onClick={handleGoogleSignup}
                        disabled={isVerifying}
                    >
                        Sign Up with Google
                    </button>
                    
                    <div className="signup-phone-container">
                        <PhoneInput
                            country={'in'}
                            value={phone}
                            onChange={setPhone}
                            inputClass="signup-input"
                            containerClass="phone-input-container"
                            buttonClass="country-dropdown"
                            placeholder="Enter phone number"
                            disabled={isVerifying}
                        />
                        <button 
                            className="signup-submit-btn" 
                            onClick={handlePhoneSignup}
                            disabled={isButtonDisabled}
                        >
                            Send OTP
                        </button>
                    </div>
                </>
            )}

            {isVerifying && (
                <div className="signup-otp-container">
                    <input
                        className="signup-input"
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                    />
                    <button 
                        className="signup-submit-btn" 
                        onClick={verifyOtp}
                        disabled={otp.length !== 6}
                    >
                        Verify OTP
                    </button>
                    {timer > 0 ? (
                        <div className="timer">Resend OTP in {timer}s</div>
                    ) : (
                        <button 
                            className="resend-btn" 
                            onClick={handleResendOTP}
                            disabled={isButtonDisabled}
                        >
                            Resend OTP
                        </button>
                    )}
                </div>
            )}

            <div className="terms-container">
                <label className="terms-label">
                    <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        disabled={isVerifying}
                    />
                    I accept the Terms and Conditions
                </label>
            </div>

            <div id="recaptcha-container"></div>
        </div>
    );
};

export default Signup;
