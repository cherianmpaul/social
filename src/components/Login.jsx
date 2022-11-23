import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';
import { FcGoogle, FcBusinessman } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const initClient = () => {
          gapi.client.init({
          clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
          scope: ''
        });
     };
     gapi.load('client:auth2', initClient);
  });

  const onSuccess = (res) => {
    console.log('success:', res);
    localStorage.setItem('user', JSON.stringify(res.profileObj));
    const { name, googleId, imageUrl } = res.profileObj;
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    };
    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  };

  const onFailure = (err) => {
    console.log('failed:', err);
  };

  const guestUser = () => {
    console.log("Guest user clicked");
    const guestUser = {name: 'Guest User', googleId: '0123456789', imageUrl: 'guest-icon.png'}
    localStorage.setItem('user', JSON.stringify(guestUser));
    const { name, googleId, imageUrl } = guestUser;
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    };
    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="Share Me" width="130px" />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin
              clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign in with google
                </button>
              )}
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              isSignedIn={true}

            />
          </div>
          <div className="p-5">
            <button 
              type="button" 
              className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
              onClick={guestUser}
            >
                <FcBusinessman className="mr-1"/> Sign in as Guest User
            </button> 
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
