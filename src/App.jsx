import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db } from './firebase';
import { onSnapshot, doc, setDoc, serverTimestamp, } from 'firebase/firestore';
import PokemonCard from './components/PokemonCard';
import SignIn from './components/SignIn';
import LogOut from './components/LogOut';
import Leaderboard from './Leaderboard';


function App() {
  const [user] = useAuthState(auth);
  const [score, setScore] = useState('No Score');
  const [loading, setLoading] = useState(true);

  
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
        setScore(data.score || 0);
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [user]);

  
  return (
    <div className='flex justify-center m-24'>
      {/* Start of Login and user info */}
      <div className='bg-[#253d4f] p-5 w-72 flex flex-col'>
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
          </div> : ''}

          {user ? <p className='mt-5 font-bold text-lg text-[#9333ea]'>WHOS THAT POKEMON?!</p> : <p className='font-bold text-white mt-5'>Welcome to the <span className='text-[#9333ea]'>PACKADDX</span> Pokemon Guessing Game!</p>
 }
          
          <p className='text-sm mt-5 text-white'>
          Guess the name of the blurred Pokemon card and the set it's from based on the symbol.
          </p>
          <p className='text-xs mt-5 text-gray-100'>Earn <span className='text-green-500'>10 points</span> for guessing the correct Pokemon name and <span className='text-green-500'>15 points</span> for guessing the correct set name.</p>
          <p className='text-xs mt-2 text-gray-100'><span className='text-red-400'>Be careful</span> - two wrong answers in a row and you'll have to start over.</p>
          <p className='text-xs mt-5 text-gray-100'>Login before you start to save your highscore.</p>
        </div>
        <div className='mt-10 mb-auto'>{user ? <LogOut /> : <SignIn />}</div>
        <div className='flex justify-center m-24'>
       </div>
       <Leaderboard />
        <button className='text-center underline text-sm text-yellow-700'>LEADER BOARD</button>
      </div>
      {/* End of Login and user info */}
      <div>
        <PokemonCard />
      </div>
     
    </div>
  );
}

export default App;
