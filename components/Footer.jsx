const Footer = () => {

  /* ---------------- ICONS ---------------- */

  const MailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14.6654 4.66699L8.67136 8.48499C8.46796 8.60313 8.23692 8.66536 8.0017 8.66536C7.76647 8.66536 7.53544 8.60313 7.33203 8.48499L1.33203 4.66699M2.66536 2.66699H13.332C14.0684 2.66699 14.6654 3.26395 14.6654 4.00033V12.0003C14.6654 12.7367 14.0684 13.3337 13.332 13.3337H2.66536C1.92898 13.3337 1.33203 12.7367 1.33203 12.0003V4.00033C1.33203 3.26395 1.92898 2.66699 2.66536 2.66699Z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2
      19.86 19.86 0 0 1-8.63-3.07
      19.5 19.5 0 0 1-6-6
      19.86 19.86 0 0 1-3.07-8.67
      A2 2 0 0 1 4.11 2h3
      a2 2 0 0 1 2 1.72
      12.84 12.84 0 0 0 .7 2.81
      2 2 0 0 1-.45 2.11L8.09 9.91
      a16 16 0 0 0 6 6l1.27-1.27
      a2 2 0 0 1 2.11-.45
      12.84 12.84 0 0 0 2.81.7
      A2 2 0 0 1 22 16.92z"
      stroke="#90A1B9"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


  const LinkedinIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="2" y="9" width="4" height="12" stroke="#90A1B9" strokeWidth="1.5" />
      <circle cx="4" cy="4" r="2" stroke="#90A1B9" strokeWidth="1.5" />
    </svg>
  );

  const GithubIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75
        .5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37
        -.45-1.17-1.1-1.48-1.1-1.48-.9-.64.07-.63.07-.63
        1 .07 1.53 1.05 1.53 1.05.9 1.56 2.36 1.11 2.94.85
        .09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07
        0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7
        0 0 .84-.27 2.75 1.05A9.3 9.3 0 0112 6.8c.85 0 1.7.12 2.5.35
        1.9-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7
        .64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06
        .36.32.68.94.68 1.9v2.81c0 .26.18.59.69.48A10.02 10.02 0 0022 12.26C22 6.58 17.52 2 12 2z"
        stroke="#90A1B9"
        strokeWidth="1.2"
      />
    </svg>
  );

  const ResumeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        stroke="#90A1B9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6" stroke="#90A1B9" strokeWidth="1.5" />
      <path d="M9 13h6M9 17h6" stroke="#90A1B9" strokeWidth="1.5" />
    </svg>
  );

  /* ---------------- LINKS ---------------- */

  const linkSections = [
    {
      title: "PRODUCTS",
      links: [
        { text: "Shop All", path: "/shop" },
        { text: "Mouse", path: "/shop?category=Mouse" },
        { text: "Earbuds", path: "/shop?category=Earbuds" },
        { text: "Headphones", path: "/shop?category=Headphones" },
        { text: "Electronic Watches", path: "/shop?category=Electronic%20Watches" },
      ]
    },
    {
      title: "WEBSITE",
      links: [
        { text: "Home", path: "/" },
        { text: "Become Plus Member", path: "/pricing" },
        { text: "Create Your Store", path: "/create-store" },
      ]
    },
    {
      title: "CONTACT",
      links: [
        { text: "9711737220", path: "#", icon: PhoneIcon },
        { text: "anant.inboxx@gmail.com", path: "#", icon: MailIcon },
      ]
    }
  ];

  const socialIcons = [
    { icon: LinkedinIcon, link: "https://www.linkedin.com/in/anant-singh-b33a93373/" },
    { icon: GithubIcon, link: "https://github.com/JoeDev420/gocart_Ecommerce_Store"},
    { icon: ResumeIcon, link: "#" } // add live resume URL later
  ];

  /* ---------------- JSX ---------------- */

  return (
    <footer className="mx-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 py-10 border-b border-slate-500/30 text-slate-500">

          <div>
            <a href="/" className="text-4xl font-semibold text-slate-700">
              <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl">.</span>
            </a>

            <p className="max-w-[410px] mt-6 text-sm">
              gocart is an electronics marketplace focused on everyday peripherals and smart accessories,
              including mice, headphones, earbuds, and electronic watches.
            </p>

            <div className="flex items-center gap-3 mt-5">
              {socialIcons.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full overflow-hidden hover:scale-105 transition"
                >
                  <item.icon />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5 text-sm">
            {linkSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-medium text-slate-700 mb-3 md:mb-5">{section.title}</h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {link.icon && <link.icon />}
                      <a href={link.path} className="hover:underline">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        
      </div>
    </footer>
  );
};

export default Footer;
