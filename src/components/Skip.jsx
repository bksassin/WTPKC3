import React from 'react';

function SkipButton({ skipCount, label, onClick }) {

    
  return skipCount > 0 ? (
    <button onClick={onClick} className="mt-2 w-24 h-10 ml-auto bg-[#e71d23] cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#e71d23,0_0px_0_0_#e71d23]
    active:border-b-[0px]
    transition-all duration-150 [box-shadow:0_7px_0_0_#c5151a]
    rounded-full  border-[1px] border-[#eb4146]">
     <span className='flex flex-col justify-center h-full text-[#55090b] font-semibold'> 
        {label}
     </span>
    </button>
  ) : (
    <button className="mt-2 w-24 h-10 ml-auto bg-[#e71d23] cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#e71d23,0_0px_0_0_#e71d23]
    active:border-b-[0px]
    transition-all duration-150 [box-shadow:0_7px_0_0_#c5151a]
    rounded-full  border-[1px] border-[#eb4146]" disabled>
      <span className='flex flex-col justify-center h-full text-[#55090b] font-semibold'>
      Skips x0
      </span>
    </button>
  );
}

export default SkipButton;
