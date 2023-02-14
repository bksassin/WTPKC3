import React, {useState, useEffect, useMemo} from 'react';

const App = () => {
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
    const [gameOver, setGameOver] = useState(false);
    const cardBack = require('../assets/card.png'); // with require

    const fetchData = useMemo(() => {
        async function fetchData() {
            setLoading(true);
            setOptions([]);
            setIncorrectClicks(0);
            setCorrectCardName(false); // reset the correct card name state
            setCorrectCardSet(false); // reset the correct card set state
            setCorrectOptionClicked(false); // reset the correct option state
            setClickedOptions([]); // reset the clicked options state
            const response = await fetch("https://api.pokemontcg.io/v2/cards");
            const data = await response.json();
            const randomIndex = Math.floor(Math.random() * data.data.length);
            setCard(data.data[randomIndex]);
            setCardName(data.data[randomIndex].name);
            setCardSet(data.data[randomIndex].set.name);
            setSymbolUrl(data.data[randomIndex].set.images.symbol);
            setLoading(false);
            setBlurred(true);
        }
        return fetchData;
    }, []);

    const getRandomOptions = useMemo(() => {
        async function getRandomOptions() {
            if (!loading) {
                const response = await fetch("https://api.pokemontcg.io/v2/cards");
                const data = await response.json();
                let randomOptions = [];
                while (randomOptions.length < 4) {
                    const randomIndex = Math.floor(Math.random() * data.data.length);
                    if (randomOptions.indexOf(data.data[randomIndex].name) === -1) {
                        randomOptions.push(data.data[randomIndex].name);
                    }
                }
                randomOptions[Math.floor(Math.random() * 4)] = cardName;
                setOptions(randomOptions);
            }
        }
        return getRandomOptions;
    }, [loading, cardName]);

    const fetchSetNameOptions = useMemo(() => {
        async function fetchSetNameOptions() {
          if (!loading) {
            const response = await fetch("https://api.pokemontcg.io/v2/sets");
            const data = await response.json();
            let setNameOptionList = [];
            while (setNameOptionList.length < 3) {
              const randomIndex = Math.floor(Math.random() * data.data.length);
              if (setNameOptionList.indexOf(data.data[randomIndex].name) === -1) {
                setNameOptionList.push(data.data[randomIndex].name);
              }
            }
            setNameOptionList[Math.floor(Math.random() * 3)] = cardSet;
            setSetNameOptions(setNameOptionList);
          }
        }
        return fetchSetNameOptions;
      }, [loading, cardSet]);
      
      useEffect(() => {
        if (cardName) {
          fetchSetNameOptions();
        }
      }, [cardName, fetchSetNameOptions]);
    
    useEffect(() => {
        if (cardName) {
            getRandomOptions();
        }
    }, [cardName, getRandomOptions]);


    const handleButtonPress = () => {
        setCorrectCardSet(false);
        fetchData();
    };

    const handleOptionClick = (option) => {
      if (clickedOptions.includes(option)) {
        return;
      }
      if (option === cardName) {
        setBlurred(false);
        setCorrectCardName(true);
        setScore(score + 10);
        setCorrectOptionClicked(true); // set the correct option as clicked
      } else if (option === cardSet) {
        setCorrectCardSet(true);
        setScore(score + 15);
        setCorrectOptionClicked(true); // set the correct option as clicked
      } else {
        setIncorrectClicks(incorrectClicks + 1);
        if (incorrectClicks === 2) {
          setScore(0);
          setIncorrectClicks(0);
          setGameOver(true);
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
                <div></div>
              ) : symbolUrl ? (
                <img src={symbolUrl} alt="symbol" />
              ) : (
                <div />
              )}
            </div>
                            <div className="w-full">
                            <div className='text-center text-sm'>
  {correctCardSet ? (
    <div className="pop-up">
      <div className="pop-up-content">
        That's Correct!
      </div>
    </div>
  ) : (
    'GUESS THE SET NAME'
  )}
</div>
                            <div className='text-center text-sm flex justify-between'>
                            {
    !loading && setNameOptions.length > 0 && incorrectClicks !== 2 && setNameOptions.map((option, index) => (
      <button
      key={index}
      className={`set-name text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm p-2 m-1 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700${
        incorrectClicks === 1 ? "flash-red" : ""
      }`}
      onClick={() => handleOptionClick(option)}
    >
      {option}
    </button>
    ))
  }
                      
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
    <div className="pop-up-content">
      Sorry, you have to start over now.
    </div>
  </div>
)}
</div>
                </div>
                <div className="right-container__buttons flex flex-col mt-10p">
                {correctCardName && (
  <div className="pop-up mt-2 text-center">
    <div className="pop-up-content">
      That's Correct!
    </div>
  </div>
)}
<button
  className={`pokemon-name bg-green-400 mt-5 ${
    loading ? "cursor-not-allowed opacity-50" : ""
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
  {incorrectClicks === 2 ? "Restart" : "Load New Card"}
</button>



                </div>
            </div>
        </div>
    );
};

export default App;
