import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import React from "react";
import GoogleButton from "react-google-button";
import { auth } from '../firebase';


const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithRedirect(auth, provider)
}

const SignIn = () => {
    return (
        <div className="bg-black">
            < GoogleButton onClick={googleSignIn} />
        </div>
    )
}

export default SignIn