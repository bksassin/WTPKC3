import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { onSnapshot, collection } from 'firebase/firestore';



const Leaderboard = () => {

  const [scores, setScores] = useState([]);


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'scores'), (snapshot) => {
      setScores(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);


  return (
      <div className='bg-[#253d4f]'>
    <table className='table-fixed text-sm'>
      <thead>
        <tr>
          <th className=''>Name</th>
          <th className=''>Score</th>
          <th className=''>Date</th>
        </tr>
      </thead>
      <tbody className='text-gray-100'>
        {scores.map((score) => (
          <tr key={score.id}>
            <td className='border px-4 py-2'>{score.name}</td>
            <td className='border px-4 py-2'>{score.score}</td>
            <td className='border px-4 py-2'>{score.date.toDate().toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default Leaderboard