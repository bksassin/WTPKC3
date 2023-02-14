import React from 'react';
import PokemonCard from './components/PokemonCard';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignIn from './components/SignIn';
import LogOut from './components/LogOut';


function App () {
  const [user] = useAuthState(auth)
  console.log(user)
  return (
  <div className='flex justify-center m-24'>
    
     {/* Start of Login and user info */}
    <div className='bg-[#253d4f] p-5 w-64'>
    <div>
    {user ? <img class="w-8 h-8 rounded-full mx-2" 
    src={auth.currentUser.photoURL} alt="Rounded avatar" /> : ''}
    </div>
    <div>
    {user ? <p className='text-white font-bold'>{auth.currentUser.displayName}</p> : ''}
    </div>
    <div>
    <p className='mt-5'>YOUR HIGHEST SCORE</p>
    <p className='text-yellow-500'>12345678</p>

    <p className='font-bold text-white mt-5'>Do you know your Pokemon!?</p>
    <p className='text-sm mt-5 text-white'>Can you guess the pokemons name from the blurred card? What about the Set name from only the symbol?</p>
    <p className='text-xs mt-5'>Correct Pokemon Name = 10 Points</p>
    <p className='text-xs'>Correct Set Name = 15 Points</p>

    </div>
    <div className='mt-10'>
    {user ? <LogOut /> : <SignIn />}
    </div>
    </div> 
     {/* End of Login and user info */}

    <div>
    < PokemonCard />
    </div>
  </div>
);
}

export default App;
