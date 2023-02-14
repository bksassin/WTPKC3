import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db } from './firebase';
import { onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import PokemonCard from './components/PokemonCard';
import SignIn from './components/SignIn';
import LogOut from './components/LogOut';
import { onAuthStateChanged } from 'firebase/auth';

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
        setScore(data.score);
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [user]);

  
  
  return (
    <div className='flex justify-center m-24'>
      {/* Start of Login and user info */}
      <div className='bg-[#253d4f] p-5 w-64'>
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
          
          <p className='font-bold text-white mt-5'>Do you know your Pokemon!?</p>
          <p className='text-sm mt-5 text-white'>
            Can you guess the pokemons name from the blurred card? What about the Set name from only
            the symbol?
          </p>
          <p className='text-xs mt-5 text-yellow-200'>Correct Pokemon Name = 10 Points</p>
          <p className='text-xs text-yellow-200'>Correct Set Name = 15 Points</p>
          <p className='text-xs mt-2 text-yellow-200'>You can only have 2 wrong answers before restarting</p>
        </div>
        <div className='mt-10'>{user ? <LogOut /> : <SignIn />}</div>
      </div>
      {/* End of Login and user info */}
      <div>
        <PokemonCard />
      </div>
    </div>
  );
}

export default App;
