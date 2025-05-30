import React, { useState, useEffect, useRef } from "react";
import '../Styles/NavBar.css';
import { Link, redirect, useNavigate } from "react-router-dom";
import Logo from '../images/AppLogo.webp';
import closeLogo from '../images/Close.png';
import Avatar from '../images/Avatar2.jpg'
import { Modal } from 'react-bootstrap';
import { Button } from "react-bootstrap";
// import DropArrow from '../images/DropArrow.png'


function NavBar() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 912);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeId, setActiveId] = useState(0);
  const refSate = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const id = Number(localStorage.getItem('onActiveTab')) || 0;
  setActiveId(id);
    const handleResize = () => {
      const isNowDesktop = window.innerWidth > 912;
      setIsDesktop(isNowDesktop);
      if (isNowDesktop) {
        setIsMenuOpen(false);
      }
    };

    const onOverlayClick = (e) => {
      if (refSate.current && !refSate.current.contains(e.target)) {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", onOverlayClick);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", onOverlayClick);
    };
  }, [isMenuOpen, isProfileOpen]);


  const onNavBarClick = (id) => {
    setActiveId(id);
    localStorage.setItem('onActiveTab',id)
    setIsMenuOpen(false);
  };

  const onProfileBarClick = () => {
    localStorage.removeItem('JWTToken');
    setIsProfileOpen(false);
    navigate("/sign-in")
  };

  // const onclickOverlay = (id) => {
  //   setIsMenuOpen(false)
  //   setIsProfileOpen(false)
  // };

  const navList = ["Home", "Transactions", "Report"];
  const ProfileList = ["Profile", "Sign-Out"]
  console.log(isMenuOpen, isDesktop)

  return (
    <div id="ParentNav">

      <nav>


        <img src={Logo} alt="Expense Tracker" id="logo" />


        {/* <div id="HamBurger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
         <img src={Logo} alt="Logo" />
        </div> */}


        {/* Menu items */}
        {isMenuOpen && !isDesktop && (
          <ul className="nav-links" ref={refSate}>
            {navList.map((data, id) => (
              <li key={id}>
                <Link
                  onClick={() => onNavBarClick(id)}
                  to={data === "Home" ? "/" : `/${data.toLowerCase()}`}
                  style={{
                    textDecoration: "none",
                    borderRadius: "5px",
                    padding: "5px",
                    borderBottom: activeId === id ? `5px solid rgb(165, 23, 194)` : "",
                    color: activeId === id ? `rgb(165, 23, 194)` : "black",

                  }}
                >
                  {data}
                </Link>
              </li>
            ))}
          </ul>
        )}


        {/* {isDesktop && (
        <ul className="navFlex" style={{display:"flex", justifyContent:"end",gap:"10em"}} >
          {navList.map((data, id) => (
            <li key={id}>
              <Link
                onClick={() => onNavBarClick(id)}
                to={data === "Home" ? "/" : `/${data.toLowerCase()}`}
                style={{
                  borderBottom: activeId === id ? `5px solid #892c9b` : "",
                  textDecoration: "none",
                  color: "black",
                  borderRadius:"2px",
                  padding:"5px"
                }}
              >
                {data}
              </Link>
            </li>
          ))}
        </ul>
      )} */}

        {isProfileOpen && (
          <ul className="Profile-links" ref={refSate} style={{ display: "block" }}>

            <li>
              <Link
                to={'/profile'}
                id="ProfileData"
                onClick={()=>{setIsProfileOpen(false)}}
              >
                Profile
              </Link>
            </li>
            <li onClick={(e) => onProfileBarClick()}>
              Sign-Out
            </li>
          </ul>
        )}


      </nav>
      {/* {window.location.pathname!="/login"&&window.location.pathname!="/sign-out"&&isMenuOpen?<img onClick={() =>{ setIsMenuOpen(!isMenuOpen)}} src={closeLogo} alt="Expense Tracker" id="closelogo"/>:window.location.pathname!="/login"&&window.location.pathname!="/sign-out"&&<div id="HamBurger" onClick={() => {setIsMenuOpen(!isMenuOpen),setIsProfileOpen(false)}}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>} */}

      <div style={{ display: "flex", gap: "2em" }}>
        {window.location.pathname != "/sign-in" && isDesktop && (
          <ul className="navFlex" style={{ display: "flex", justifyContent: "end", gap: "10em", marginTop: "30px" }} >
            {navList.map((data, id) => (
              <li key={id}>
                <Link
                  onClick={() => onNavBarClick(id)}
                  to={data === "Home" ? "/" : `/${data.toLowerCase()}`}
                  style={{
                    borderBottom: activeId === id ? `5px solid rgb(165, 23, 194)` : "",
                    color: activeId === id ? `rgb(165, 23, 194)` : "Black",
                    textDecoration: "none",
                    padding: "0 0 29px",
                    borderRadius: "5px",
                  }}
                >
                  {data}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div style={{ display: "flex", gap: "2em" }}>
          {isMenuOpen && !isDesktop ? (
            <img
              onClick={() => setIsMenuOpen(false)}
              src={closeLogo}
              alt="Close Menu"
              id="closelogo"
            />
          ) : (
            window.location.pathname !== "/sign-in" && (
              <div
                id="HamBurger"

                onClick={() => {
                  setIsMenuOpen(true);
                  setIsProfileOpen(false);
                }}
              >
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            )
          )}
        </div>


        {window.location.pathname != "/sign-in" && <div style={{ cursor: "pointer" }} onClick={() => { setIsProfileOpen(!isProfileOpen), setIsMenuOpen(false) }}>
          <img src={Avatar} alt="Avatar" id="Avatar" /><span>

          </span>
        </div>
        }

      </div>

    </div>



  );
}

export default NavBar;
