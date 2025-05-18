import React, { useEffect, useState } from "react";
import "../Styles/HeroSection.css";
import closeLogo from '../images/Close.png'




function PopUpModal(props) {

    useEffect(() => {
        // setShow(props.show);
    }, [props.show]);


const show =props.show;
    console.log(show)

    return (
        <>
            <div onClick={() => { props.overlayFunction() }} style={{
                backgroundColor: show ? "rgba(107, 107, 107, 0.5)" : "",
                backdropFilter: show ? "blur(.5px)" : "",
                zIndex: show ? 1000 : -1, width: "100%", height: "100%", position: 'fixed', top: 0, left: 0
            }}></div>

            <div id="CreateModel" style={{ display: show ? "block" : "none" }}>

                <header>
                    <h2>{props.headerContent}</h2>
                    {props.closeButton && <img onClick={() => { props.closeFunction() }} style={{ cursor: "pointer" }} src={closeLogo} alt="closemodal" id="closemodal" />
                    }
                </header>

                <section>
                    {props.bodyContent}
                </section>

                <footer id="ModelFooter">
                    {props.footerContent}
                </footer>

            </div>

        </>

    );
}

export default PopUpModal;
