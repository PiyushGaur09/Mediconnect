// import React, {useState} from 'react';
// import {View, Button} from 'react-native';
// import AgoraUIKit from 'agora-rn-uikit';

// const VideoCallScreen = () => {
//   const [videoCall, setVideoCall] = useState(false);

//   // Your Agora credentials
//   const appId = '3c63e0410cf14edf8b1b86c457e18402';
//   const channel = 'testchannel';
//   const token =
//     '007eJxTYLBpVEpnmXRXvSX4NfPzc79efinbLnSyXH/LTr+MVqWfdx4pMBgnmxmnGpgYGiSnGZqkpqRZJBkmWZglm5iapxpamBgYaV0SzGwIZGQI2faImZEBAkF8bobc1JTM5Py8vNTkEgYGALAHI8o='; // or null if token not required

//   const rtcProps = {appId, channel, token};

//   const callbacks = {
//     EndCall: () => setVideoCall(false),
//   };

//   return (
//     <View style={{flex: 1}}>
//       {videoCall ? (
//         <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
//       ) : (
//         <Button title="Start Call" onPress={() => setVideoCall(true)} />
//       )}
//     </View>
//   );
// };

// export default VideoCallScreen;



import React, { useState, useEffect } from 'react';
import { View, Button, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AgoraUIKit from 'agora-rn-uikit';

const VideoCallScreen = () => {
  const [videoCall, setVideoCall] = useState(false);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  const appId = '3c63e0410cf14edf8b1b86c457e18402';
  const channel = 'testchannel';
  const token =
    '007eJxTYLBpVEpnmXRXvSX4NfPzc79efinbLnSyXH/LTr+MVqWfdx4pMBgnmxmnGpgYGiSnGZqkpqRZJBkmWZglm5iapxpamBgYaV0SzGwIZGQI2faImZEBAkF8bobc1JTM5Py8vNTkEgYGALAHI8o=';

  // ✅ Load user_data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user_data');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          if (userData?.id) {
            setUid(Number(userData.id));
          } else {
            setUid(Math.floor(Math.random() * 100000));
          }
        } else {
          setUid(Math.floor(Math.random() * 100000));
        }
      } catch (error) {
        console.error('Error fetching user_data:', error);
        setUid(Math.floor(Math.random() * 100000));
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  // ✅ Prepare rtcProps only if we have uid
  const rtcProps =
    uid && appId && channel
      ? {
          appId,
          channel,
          token,
          uid,
        }
      : null;

  const callbacks = {
    EndCall: () => setVideoCall(false),
  };

  // ✅ Render loading state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Initializing Agora...</Text>
      </View>
    );
  }

  // ✅ Don’t render AgoraUIKit until rtcProps is valid
  if (!rtcProps) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Agora configuration incomplete</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {videoCall ? (
        <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
      ) : (
        <Button title="Start Call" onPress={() => setVideoCall(true)} />
      )}
    </View>
  );
};

export default VideoCallScreen;
