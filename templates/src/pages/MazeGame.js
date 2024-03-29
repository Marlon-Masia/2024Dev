/*************************
Converted from class-based to functional component in Spring 2023.
**************************/

import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { Unity, useUnityContext } from "react-unity-webgl";
import MainTemplate from '../pages/MainTemplate'; 
import Template from '../pages/Template';
import Footer from '../components/Footer';

import '../stylesheets/style.css';
import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/font-awesome/css/font-awesome.min.css';
import '../lib/owlcarousel/assets/owl.carousel.min.css';
import '../lib/ionicons/css/ionicons.min.css';

function MazeGame(props) {
	const [permission, setPermission] = useState(props.user.permission);

    useEffect(() => {
        verifyPermission();
    }, []);

	const verifyPermission = () => {
		const jwt = localStorage.getItem('jwt');
		if (!jwt) {
		  props.history.push(props.location.pathname);
		}
		else {
			var jwtDecode = require('jwt-decode');
			var decoded = jwtDecode(jwt);
			setPermission(decoded.user_claims.permission);
		}
	}
	  
    const { unityProvider, requestFullscreen, isLoaded, sendMessage, loadingProgression } = useUnityContext({
        // If you change the file paths, you must also change the README in templates/public/Unity-Game-WebGL-Builds!
        loaderUrl: "Unity-Game-WebGL-Builds/Maze-Game/Build.loader.js",
        dataUrl: "Unity-Game-WebGL-Builds/Maze-Game/Build.data",
        frameworkUrl: "Unity-Game-WebGL-Builds/Maze-Game/Build.framework.js",
        codeUrl: "Unity-Game-WebGL-Builds/Maze-Game/Build.wasm",
    });
    
    // Automatically log the user into the Unity Maze Game
    if (isLoaded === true) {
        const jwt = localStorage.getItem('jwt');
        sendMessage("ContinueButton", "loginAttempt", jwt);
    }

	const handleOnClickFullscreen = () =>  {
        requestFullscreen(true);
	}

    return (  
        <>
        <div className="downloadsBg mainDiv">
            {localStorage.getItem('jwt') === null ? <MainTemplate /> : <Template permission={permission}/>}
            <br />
            <div className="center-contents">
                <div className="webglLoadingStatusBox" style={{visibility: isLoaded ? "hidden" : "visible"}}>
                    <p className="webglLoadingStatusText">Loading {Math.round(loadingProgression * 100)}%</p>
                </div>
                
                <Unity
                    unityProvider={unityProvider}
                    style={{
                        width: "1152px",
                        height: "648px",
                        visibility: isLoaded ? "visible" : "hidden"
                    }}
                />
                <br />
                <br />
                <Button onClick={handleOnClickFullscreen} style={{visibility: isLoaded ? "visible" : "hidden"}}>Fullscreen</Button>
            </div>
            <p className="mazeGame"><font color="black">If there are no available modules for you to select, try logging out and logging back in.</font></p>
            <br />
            <Footer></Footer>
        </div>
        </>
    );
}

export default MazeGame;
