import React, {useState, useEffect, useMemo} from 'react';
import {db, auth} from '../firebase';
import {doc, getDoc, updateDoc, setDoc, onSnapshot, serverTimestamp} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import SkipButton from '../components/Skip';



const App = () => {
    const [apiData, setApiData] = useState(null);
    const [card, setCard] = useState({});
    const [cardName, setCardName] = useState('');
    const [cardSet, setCardSet] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [blurred, setBlurred] = useState(true); 
    const [symbolUrl, setSymbolUrl] = useState(''); 
    const [setNameOptions, setSetNameOptions] = useState([]);
    const [correctCardName, setCorrectCardName] = useState(false);
    const [correctCardSet, setCorrectCardSet] = useState(false);
    const [score, setScore] = useState(0);
    const [incorrectClicks, setIncorrectClicks] = useState(0);
    const [clickedOptions, setClickedOptions] = useState([]);
    const [correctOptionClicked, setCorrectOptionClicked] = useState(false);
    const [scores, setScores] = useState();
    const cardBack = require('../assets/card.png'); // with require
    const [user] = useAuthState(auth);
    const [currentScore, setCurrentScore] = useState(0);
    const [skipCount, setSkipCount] = useState(0);
    const [skipButtonLabel, setSkipButtonLabel] = useState("");
    const [loadCardDisabled, setLoadCardDisabled] = useState(true);


    const fetchData = async () => {
      setLoading(true);
      setOptions([]);
      setIncorrectClicks(0);
      setCorrectCardName(false);
      setCorrectCardSet(false);
      setCorrectOptionClicked(false);
      setClickedOptions([]);
      const response = await fetch("https://api.pokemontcg.io/v2/cards?select=name,images,set");
      const data = await response.json();
      setApiData(data);
      const randomIndex = Math.floor(Math.random() * data.data.length);
      setCard(data.data[randomIndex]);
      setCardName(data.data[randomIndex].name);
      setCardSet(data.data[randomIndex].set.name);
      setSymbolUrl(data.data[randomIndex].set.images.symbol);
      setLoading(false);
      setBlurred(true);

  };
  

  const getRandomOptions = useMemo(() => {
    async function getRandomOptions() {
        if (apiData) {
            let randomOptions = [];
            while (randomOptions.length < 4) {
                const randomIndex = Math.floor(Math.random() * apiData.data.length);
                if (randomOptions.indexOf(apiData.data[randomIndex].name) === -1) {
                    randomOptions.push(apiData.data[randomIndex].name);
                }
            }
            randomOptions[Math.floor(Math.random() * 4)] = cardName;
            setOptions(randomOptions);
        }
    }
    return getRandomOptions;
}, [apiData, cardName]);

const fetchSetNameOptions = useMemo(() => {
  async function fetchSetNameOptions() {
    setSetNameOptions([])
      if (apiData) {
          let setNameOptionList = [];
          while (setNameOptionList.length < 3) {
              const randomIndex = Math.floor(Math.random() * apiData.data.length);
              if (setNameOptionList.indexOf(apiData.data[randomIndex].set.name) === -1) {
                  setNameOptionList.push(apiData.data[randomIndex].set.name);
              }
          }
          setNameOptionList[Math.floor(Math.random() * 3)] = cardSet;
          setSetNameOptions(setNameOptionList);
      }
  }
  return fetchSetNameOptions;
}, [apiData, cardSet]);

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
  }
  setScore(0); // Reset score to 0
}, [user]);

      
useEffect(() => {
  if (cardName && apiData) {
      fetchSetNameOptions();
      getRandomOptions();
  }
}, [cardName, apiData]);

useEffect(() => {
  if (!user) {
    setScore(0);
  }
}, [user]);

useEffect(() => {
  if (user) {
    const uid = auth.currentUser.uid;
    const docRef = doc(db, 'scores', uid);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const { score } = doc.data();
        setSkipCount(Math.floor(score / 50));
        setSkipButtonLabel(`Skips x${Math.floor(score / 50)}`);
      }
    });
  }
}, [user]);



    const handleButtonPress = () => {
        setCorrectCardSet(false);
        fetchData();
    };

const handleOptionClick = (option) => {
  if (clickedOptions.includes(option)) {
    return;
  }
  if (setNameOptions.includes(option)) {
    if (option === cardSet) {
      setCorrectCardSet(true);
      setScore(prevScore => prevScore + 15);
      setCurrentScore(prevScore => prevScore + 15);
      if (user) {
        const newScore = currentScore + 15;
        const uid = auth.currentUser.uid;
        const docRef = doc(db, 'scores', uid);
        getDoc(docRef).then((docSnapshot) => {
          if (docSnapshot.exists() && docSnapshot.data().score < newScore) {
            updateDoc(docRef, { score: newScore });
          }
        });
      }
    } else {
      setIncorrectClicks(incorrectClicks + 1);
      if (incorrectClicks === 2) {
        setScore(0);
        setCurrentScore(0);
        setIncorrectClicks(0);
      }
    }
    setClickedOptions([...clickedOptions, option]);
    return;
  }
  if (option === cardName) {
    setBlurred(false);
    setCorrectCardName(true);
    setScore(prevScore => prevScore + 10);
    setCurrentScore(prevScore => prevScore + 10);
    setCorrectOptionClicked(true);
    if (user) {
      const newScore = currentScore + 10;
      const uid = auth.currentUser.uid;
      const docRef = doc(db, 'scores', uid);
      getDoc(docRef).then((docSnapshot) => {
        if (docSnapshot.exists() && docSnapshot.data().score < newScore) {
          updateDoc(docRef, { score: newScore });
        }
      });
    }
  } else {
    setIncorrectClicks(incorrectClicks + 1);
    if (incorrectClicks === 2) {
      setScore(0);
      setCurrentScore(0);
      setIncorrectClicks(0);
    }
  }
  
  setClickedOptions([...clickedOptions, option]);
};

    
  
    return (
        <div className="pokedex">
            <div className="left-container">
                <div className="left-container__top-section">
                    <div className="top-section__blue"></div>
                    <div className="top-section__small-buttons">
                        <div className="top-section__red"></div>
                        <div className="top-section__yellow"></div>
                        <div className="top-section__green"></div>
                    </div>
                    <div className='w-full text-xs text-yellow-500 font-bold flex flex-row'>
                    <div className='bg-black w-1/2 py-2 pl-1'>SCORE: <span className='ml-5 text-white'>{score}</span></div>
                    <div className='w-1/2 text-right text-xl font-bold text-red-900'>PACKADDX</div>
                    </div>
                </div>
                <div className="left-container__main-section-container">
                    <div className="left-container__main-section">
                        <div className="main-section__white">
                            {loading ? (
          <img className='object-contain h-full mx-auto' src={cardBack} alt="card" />
        ) : (
          <img
            className={`object-contain h-full mx-auto ${blurred ? 'blurred-image' : ''}`}
            src={card.images && card.images.small}
            alt={card.name}
          />
        )}
        
                            <div className="main-section__black"></div>
                        </div>
                        <div className="left-container__controllers w-full h-20 flex mt-3">
                        <div className="w-1/5">
              {loading ? (
                <div>
                </div>
              ) : symbolUrl ? (
                <img className="h-14" src={symbolUrl} alt="symbol" />
              ) : (
                <div />
              )}
            </div>
                            <div className="w-full">
                            <div className='text-center text-sm'>

</div>
                            <div className='text-center text-sm flex justify-between'>
                            {!loading && setNameOptions.length > 0 && incorrectClicks !== 2 && setNameOptions.map((option, index) => (
  <button
    key={index}
    className={`set-name mt-2 w-24 h-16 ml-auto px-1 bg-[#333333] cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#333333,0_0px_0_0_#333333]
    active:border-b-[0px]
    transition-all duration-150 [box-shadow:0_7px_0_0_#222222]
    rounded-lg   border-[#222222]${
      incorrectClicks === 1 ? "flash-red" : ""
    }`}
    onClick={() => handleOptionClick(option)}
  >
    <span className="flex flex-col justify-center h-full text-gray-300 font-semibold">
      {option}
    </span>
  </button>
))}
                      
                            </div>
                  
                            </div>
                        </div>
                    </div>
                    <div className="left-container__right">
                        <div className="left-container__hinge"></div>
                        <div className="left-container__hinge"></div>
                    </div>
                </div>
            </div>
  
            <div className="right-container">
                <div className="right-container__black">
                    <div className="right-container__screen flex flex-col content-between space-y-6 text-xl">
                    {!loading && options.length > 0 && incorrectClicks !== 2 && !correctOptionClicked && (
  <div className="right-container__screen flex flex-col content-between space-y-6 text-xl">
    {options.map((option, index) => (
      <button
        key={index}
        className={`pokemon-name ${
          incorrectClicks === 1 ? "flash-red" : ""
        }`}
        onClick={() => handleOptionClick(option)}
      >
        {option}
      </button>
    ))}
  </div>
)}
{incorrectClicks === 2 && (
  <div className="pop-up mt-2 text-center">
    <div className="pop-up-content font-bold text-lg">
      Sorry, you have to start over now.
    </div>
  </div>
)}
                {correctCardName && (
  <div className="pop-up mt-1 text-center">
    <div className="pop-up-content font-bold text-lg">
      That's Correct!
    </div>
  </div>
)}
</div>
</div>
<div className="right-container__buttons flex flex-col">

<button className="mt-2 w-36 h-10 mx-auto bg-[#e71d23] cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#e71d23,0_0px_0_0_#e71d23]
    active:border-b-[0px]
    transition-all duration-150 [box-shadow:0_7px_0_0_#c5151a]
    rounded-full  border-[1px] border-[#eb4146]">
<span
  className={`flex flex-col justify-center items-center h-full text-[#55090b] font-semibold text-lg ${
    loading ? "cursor-not-allowed " : "Loading..."
  }`}
  disabled={loading}
  onClick={() => {
    if (incorrectClicks === 2) {
      window.location.reload();
    } else {
      handleButtonPress();
    }
  }}
>
  {incorrectClicks === 2 ? "Restart" : "Load Card"}
</span>
</button>
<div className="flex flex-row">
{correctCardSet ? (
    <div className="pop-up mt-5">
      <div className="pop-up-content font-bold">
        That's Correct!
      </div>
    </div>
  ) : (
    ''
  )}
<SkipButton
      skipCount={skipCount}
      label={skipButtonLabel}
      onClick={() => {
        setSkipCount(skipCount - 1);
        setSkipButtonLabel(`Skips x${skipCount - 1}`);
        handleButtonPress();
      }}
    />
    </div>
   
                </div>
            </div>
        </div>
    );
};


export default App;
