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
    <div className='bg-white'>
      <div>USER LOGO</div>
      <div>USER EMAIL</div>
      <div>
    {user ? <LogOut /> : <SignIn />}
    </div>
    </div> 
    <div>
    < PokemonCard />
    </div>
  </div>
);
}

export default App;
