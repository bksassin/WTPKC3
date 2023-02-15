import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { onSnapshot, collection, orderBy, query } from 'firebase/firestore';



const Leaderboard = () => {

  const [scores, setScores] = useState([]);


  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'scores'), orderBy('score', 'desc')),
      (snapshot) => {
        setScores(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return unsubscribe;
  }, []);
  
  


  return (
      <div className='bg-[#253d4f]'>
    <table className='table-fixed text-sm mt-2'>
      <thead>
        <tr>
          <th className=''>Pos</th>
          <th className=''>Name</th>
          <th className=''>Score</th>
          <th className=''>Date</th>
        </tr>
      </thead>
      <tbody className='text-gray-100'>
  {scores.map((score, index) => (
    <tr key={score.id}>
 {index < 3 ? (
  <td className='border px-2 py-2'>
    <span className={index === 0 ? 'leaderboard-first' : index === 1 ? 'leaderboard-second' : 'leaderboard-third'}>
      {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
    </span>
  </td>
) : (
  <td className='border px-4 py-2'>
    {index + 1}
  </td>
)}
      <td className='border px-1 py-2'>{score.name}</td>
      <td className='border px-1 py-2'>{score.score}</td>
      <td className='border px-1 py-2'>{score && score.date && score.date.toDate().toLocaleDateString()}</td>
    </tr>
  ))}
</tbody>
    </table>
  </div>
  )
}

export default Leaderboard