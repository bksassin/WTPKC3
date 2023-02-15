import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db } from './firebase';
import { onSnapshot, doc, setDoc, serverTimestamp, } from 'firebase/firestore';
import PokemonCard from './components/PokemonCard';
import SignIn from './components/SignIn';
import LogOut from './components/LogOut';
import Leaderboard from './Leaderboard';
import SkipButton from './components/Skip';


function App() {
  const [user] = useAuthState(auth);
  const [score, setScore] = useState('No Score');
  const [loading, setLoading] = useState(true);
  const [skipCount, setSkipCount] = useState(0);
  const [skipButtonLabel, setSkipButtonLabel] = useState("");

  
  useEffect(() => {
    if (user) {
      const { uid, displayName, email } = auth.currentUser;
      const docRef = doc(db, 'scores', uid);
      const scoreData = {
        name: displayName,
        email: email,
        date: serverTimestamp()
      };
      setDoc(docRef, scoreData, { merge: true });
  
      const unsubscribe = onSnapshot(docRef, (doc) => {
        const data = doc.data();
        const score = data.score || 0;
        setScore(score);
        setSkipCount(Math.floor(score / 50));
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [user]);
  
  useEffect(() => {
    if (skipCount > 0) {
      setSkipButtonLabel(`Skips x${skipCount}`);
    } else {
      setSkipButtonLabel("");
    }
  }, [skipCount]);
  
  

  
  return (
    <div className='flex flex-wrap justify-center m-24 max-h-screen'>
      {/* Start of Login and user info */}
      <div
        id='menu'
        style={{ maxHeight: '750px' }}
        className='bg-[#253d4f] p-5 w-full lg:w-1/5 flex flex-col order-2 lg:order-1'
      >
        <div>
          {user ? (
            <img
              className='w-8 h-8 rounded-full mx-2'
              src={auth.currentUser.photoURL}
              alt='Rounded avatar'
            />
          ) : (
            ''
          )}
        </div>
        <div>
          {user ? (
            <p className='text-white font-bold'>{auth.currentUser.displayName}</p>
          ) : (
            ''
          )}
        </div>
        <div>{user ? <div>
    <p className='mt-5'>YOUR HIGHEST SCORE</p>
    {loading ? (
      <p className='text-yellow-500'>Loading...</p>
    ) : (
      <p className='text-yellow-500'>{score}</p>
    )}
  </div>: ''}

          {user ? <p className='mt-5 text-[#9333ea]'>WHOS THAT POKEMON?!</p> : <p className='text-xl font-bold text-white mt-5'>Welcome to the <span className='text-[#9333ea]'>PACKADDX<br></br></span>Who's That Pokemon Game!</p>
 }
          
          <p className='text-sm mt-5 text-white'>
          Guess the name of the blurred Pokemon card and the set it's from based on the symbol.
          </p>
          <p className='text-sm mt-5 text-gray-100'><span className='text-green-500'>10 points</span> for correctly guessing the Pokemon's name. <span className='text-green-500'>15 points</span> for guessing the set's name.</p>
          <p className='text-sm mt-2 text-gray-100'><span className='text-red-400'>Be careful</span> - 2 consecutive wrong answers will result in a restart.</p>
          <p className='text-sm mt-2 text-gray-100'>Earn <span className='text-yellow-500'>1 Skip</span> for every <span className='text-green-500'>50 points</span> in your high score. Skips can be used to skip challenging cards, so use them wisely to improve your score and climb the leaderboard. Keep in mind that all Skips will be replenished if you have to start over.</p>
          <p className='text-lg mt-2 text-gray-100'>Good luck, trainer!</p>
          {user ? '' : <p className='text-xs mt-5 text-gray-100 underline'>Remember to login before starting to save your score.</p>} 
          
        </div>
        <div className='mt-10 mb-auto'>{user ? <LogOut /> : <SignIn />}</div>
        <div className='flex justify-center m-5'>
       </div>
       <button className='text-left lg:text-center font-bold text-lg text-yellow-700'>LEADER BOARD</button>
       <div style={{ overflowY: 'auto' }}>
       <Leaderboard />
       </div>
      </div>
      {/* End of Login and user info */}
      <div className='w-full lg:w-4/5 order-1 lg:order-2'>
        <PokemonCard />
      </div>
    </div>
  );
}

export default App;
