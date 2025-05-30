import React, { useEffect } from "react";
// import '../Styles/Report.css'

function Report(){
    useEffect(()=>{

        localStorage.setItem('onActiveTab',2)

    },[])

    return(
        <>
        <h1>Report</h1>
        </>
    )

}

export default Report