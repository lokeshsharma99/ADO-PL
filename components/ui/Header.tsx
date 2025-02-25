'use client';

export const Header = () => {
  return (
    <>
      <header className="govuk-header bg-[#0b0c0c] py-4 border-b-[10px] border-[#1d70b8]" role="banner">
        <div className="max-w-[960px] mx-auto px-8 box-border">
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-white mr-3"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                <path d="M2 2l7.586 7.586"/>
                <circle cx="11" cy="11" r="2"/>
              </svg>
              <div>
                <h1 className="text-white text-[30px] font-bold leading-none m-0">StoryForge</h1>
                <p className="text-white mt-1 mb-0 text-[19px]">Crafting Digital Stories with Purpose</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="h-[10px] w-full bg-[#1d70b8] m-0 p-0"></div>
    </>
  );
}; 