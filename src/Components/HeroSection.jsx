import React, { useEffect, useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css'; // <-- IMPORTANT
import "../Styles/HeroSection.css";
import BalanceLogo from '../images/TotalincomeLogo.png'
import IncomeLogo from '../images/balanceLogo.png'
import ExpenseLogo from '../images/ExpenseLogo.png'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import closeLogo from '../images/Close.png';
import { Modal, Button } from 'react-bootstrap';
import PopUpModal from "../common/Modal";
import { useNavigate } from "react-router-dom";
import * as Api from '../Api/Apis'
import { useQuery } from "@tanstack/react-query";
import { toast,Slide } from "react-toastify";
import '../Styles/toastStyles.css'
import 'react-toastify/dist/ReactToastify.css'; 


function HeroSection() {
  const navigate = useNavigate()
  //   const month = [
  //     "January", "February", "March", "April", "May", "June",
  //     "July", "August", "September", "October", "November", "December"
  //   ];
  const year = [];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [CalendarValue, SetCalendarValue] = useState(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)
  console.log(CalendarValue);
  const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

const calendarData={
  month:String(currentMonth+1),year:String(currentYear)
}

  const { data: TransactionOverview, isLoading, error } = useQuery({
        queryKey: ['TransactionOverview'],
        queryFn:()=> Api.transactionOverview(calendarData),
    });

    console.log(TransactionOverview,':gshdg');
    
    const [transactions, setTransactions] = useState({income:0, expense: 0, balance: 0});

  useEffect(() => {
    console.log("in")
    if (!localStorage.getItem('JWTToken')) {
      console.log("inn")
      navigate('/sign-in')
    }
  }, [])
  useEffect(()=>{
    if(TransactionOverview?.data){
//     toast('Welcome Home', {
//   position: "top-center",
//   autoClose: 1000,
//   hideProgressBar: true,
//   closeOnClick: false,
//   pauseOnHover: false,
//   draggable: true,
//   progress: undefined,
//   theme: "light",
//   transition: Slide,
//   className: 'custom-toast',
//   bodyClassName: 'custom-toast-body',
// });
      setTransactions(TransactionOverview?.data?.data)
    }
  },[TransactionOverview])
  for (let i = 2000; i <= currentYear; i++) {
    year.push(i);
  }


  const onCalendarValue = async(value) => {
  SetCalendarValue(value);

  const calendarData = {
    month: value.getMonth() + 1,
    year: value.getFullYear(),
  };

  console.log('Parsed calendarData:', value);

  const resp = await Api.transactionOverview(calendarData);
  if(resp.data){
  setTransactions(resp?.data?.data)
  }
  else{
    setTransactions({income:0, expense: 0, balance: 0})
  }

};




  return (
    <>
      {/* <div onClick={()=>setShow(false)} style={{backgroundColor: show ? "rgba(107, 107, 107, 0.5)" : "", // light transparent white
    backdropFilter: show ? "blur(.5px)" : "", // add blur
    zIndex: show ? 1000 : -1, width:"100%",height:"100%",position:'fixed',top:0,left:0 }}></div> */}
      <div id="HeroSection">
        <div id="HeroContent">
          <h2>
            Hi M Madhankumar , Every penny counts. Make smarter money moves starting today.
          </h2>

          <div id="YearMonthFilter">
            {/* <select>
          {month.map((data, index) => (
            <option key={index} value={data}>
              {data}
            </option>
          ))}
        </select>

        <select>
          {year.map((data, index) => (
            <option key={index} value={data}>
              {data}
            </option>
          ))}
        </select> */}
            {/* <input type="month" id="HomeCalendar" value={CalendarValue} onChange={onCalendarValue} /> */}
            <DatePicker
              selected={CalendarValue}
              id="HomeCalendar"
              onChange={onCalendarValue}
              dateFormat="MM/YYYY"
              showMonthYearPicker
             />
          </div>



        </div>
        <PopUpModal
          show={show}
          closeButton={true}
          closeFunction={() => setShow(false)}
          overlayFunction={() => setShow(false)}
          headerContent={"New Password"}
          bodyContent={
            <>
              <div>
                <label>Current Password</label>
                <input type="Password" />
              </div>
              <div>
                <label>New Password</label>
                <input type="Password" />
              </div>
              <div>
                <label>Confirm Password</label>
                <input type="Password" />
              </div>
              <div>
                <label>Current Password</label>
                <input type="Password" />
              </div>
              <div>
                <label>New Password</label>
                <input type="Password" />
              </div>
              <div>
                <label>Confirm Password</label>
                <input type="Password" />
              </div>
            </>
          }
          footerContent={
            <>
              <button>Save</button>
              <button onClick={() => setShow(false)}>Cancel</button>
            </>
          }
        />

        {/* <div id="CreateModel" style={{display:show?"block":"none"}}>
      <header>
<h2>Change Password</h2>
<img onClick={()=>{setShow(false)}} style={{cursor:"pointer"}} src={closeLogo} alt="closemodal" id="closemodal"/>
      </header>
      <section>
        <div>
          <label>Current Password</label>
          <input type="Password"/>
        </div>
        <div>
          <label>New Password</label>
          <input type="Password"/>
        </div>
        <div>
          <label>Confirm Password</label>
          <input type="Password"/>
        </div>

      </section>
      <footer id="ModelFooter">
      <button>Save</button>
      <button onClick={()=>{setShow(false)}}>Cancel</button>
        
      </footer>
     </div> */}
        {/* <button onClick={() => setShow(!show)}>Click Me</button> */}
        <div id="CurrentStatus">

          <div>
            <img src={BalanceLogo} alt="" />
            <h3>Current Balance</h3>
            <h3>${transactions?.balance || 0}</h3>
            <p className="MoneyPercentage" style={{ backgroundColor: "navy", color: "white" }}>{ 0}%</p>
          </div>
          <div>
            <img src={IncomeLogo} alt="" />
            <h3>Total Income</h3>
            <h3>${transactions?.income || 0}</h3>
            <p className="MoneyPercentage">{0}%</p>
          </div>
          <div>
            <img src={ExpenseLogo} alt="" />
            <h3>Total Expense</h3>
            <h3>${transactions?.expense || 0}</h3>
            <p className="MoneyPercentage" style={{ backgroundColor: "red" }}>{0}%</p>
          </div>

        </div>
      </div>
    </>

  );
}

export default HeroSection;
