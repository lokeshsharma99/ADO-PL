'use client';

export const Footer = () => {
  return (
    <footer className="govuk-footer bg-[#f3f2f1] py-6 border-t border-[#b1b4b6] mt-auto w-full">
      <div className="max-w-[960px] mx-auto px-8 box-border">
        <div className="flex flex-wrap justify-between items-center mt-8 gap-5">
          <div className="flex items-center gap-2.5">
            <img
              src="https://www.nationalarchives.gov.uk/images/infoman/ogl-symbol-41px-retina-black.png"
              alt="OGL"
              className="h-5"
            />
            <span className="text-[#0b0c0c] text-base">
              All content is available under the{' '}
              <a
                href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                className="text-[#0b0c0c] underline hover:text-[#1d70b8]"
              >
                Open Government Licence v3.0
              </a>
              , except where otherwise stated
            </span>
          </div>
          <div>
            <a
              href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
              className="text-[#0b0c0c] underline hover:text-[#1d70b8]"
            >
              © Crown copyright
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 