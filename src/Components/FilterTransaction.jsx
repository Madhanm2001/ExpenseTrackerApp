import React, { useState } from 'react';

const FilterTransaction = (props) => {

    const {getTransactionFilterValues}=props
    const date = new Date();
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
   
    const FromDate=fromDate?fromDate.split('-'):""
    const ToDate=toDate?toDate.split('-'):""
    const FilterValueObject={month:selectedMonth,year:selectedYear,startDate:FromDate?`${FromDate[2]}/${FromDate[1]}/${FromDate[0]}`:'',endDate:ToDate?`${ToDate[2]}/${ToDate[1]}/${ToDate[0]}`:'',type:selectedType||'all',category:selectedCategory||'all'}


const onSubmitFilterSearch=(e)=>{
    e.preventDefault();
    // const FilterValueObject={selectedMonth,selectedYear,fromDate:`${FromDate[2]}/${FromDate[1]}/${FromDate[0]}`,toDate:`${ToDate[2]}/${ToDate[1]}/${ToDate[0]}`,selectedType,selectedCategory}
    getTransactionFilterValues(FilterValueObject,e)
    
}


console.log(FilterValueObject,":FilterValueObject");


    const yearArr = [];
    const MonthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const SelectedCategory = ['Food', 'Travel', 'Health', 'Bills']

    for (let i = 2000; i <= date.getFullYear(); i++) {
        yearArr.push(i);
    }
    console.log(selectedMonth, fromDate, selectedYear, toDate, selectedCategory, selectedType);
    return (
        <div style={{
  padding: '0px 2vh',
  borderBottom: '3px solid grey',
  display: 'flex',           
  justifyContent: 'center'  
}}>

            <div style={{
    padding: "3vh",
    display: "flex",
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: "5vh"
  }}>

            <div style={{display:'flex',flexDirection:'column',gap:'2vh'}}>
                <label>Month:</label>
                <select style={{ padding: "10px",width:'30vh', borderRadius: "1vh", border: '2px solid grey' }} value={selectedMonth} onChange={(e) => {setSelectedMonth(e.target.value),!selectedYear&&setSelectedYear(new Date().getFullYear()),setFromDate(''),setToDate('')}}>
                    <option value={''}>{'Select Month'}</option>
                    {MonthArr.map((month, idx) => (
                        <option value={idx + 1} key={idx}>{month}</option>
                    ))}
                </select>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'2vh'}}>
                <label>Year:</label>
                <select style={{ padding: "10px",width:'30vh', borderRadius: "1vh", border: '2px solid grey' }} value={selectedYear} onChange={(e) => {setSelectedYear(e.target.value),setFromDate(''),setToDate('')}}>
                    <option value={selectedYear?selectedYear:''}>{selectedYear||"Select Year"}</option>
                    {yearArr.map((year) => (
                        <option value={year} key={year}>{year}</option>
                    ))}
                </select>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'2vh'}}>
                <label>From Date:</label>
                <input style={{ padding: "10px",width:'30vh', borderRadius: "1vh", border: '2px solid grey' }} type="date" value={fromDate} onChange={(e) => {setFromDate(e.target.value),setSelectedYear(''),setSelectedMonth('')}} />
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'2vh'}}>
                <label>To Date:</label>
                <input style={{ padding: "10px",width:'30vh', borderRadius: "1vh", border: '2px solid grey' }} type="date" value={toDate} onChange={(e) =>{setToDate(e.target.value),setSelectedYear(''),setSelectedMonth('')}} />
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'2vh'}}>
                <label>Type:</label>
                <select style={{ padding: "10px",width:'30vh', borderRadius: "1vh", border: '2px solid grey' }} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <option value="">All</option>
                    <option value='income' >Income</option>
                    <option value='expense' >Expense</option>
                </select>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'2vh'}}>
                <label>Category:</label>
                <select style={{ padding: "10px", width:'30vh',borderRadius: "1vh", border: '2px solid grey' }} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">All</option>
                    {SelectedCategory.map((category) => (
                        <option value={category} key={category}>{category}</option>
                    ))}
                </select>
                <button style={{padding:"2vh",background:"blue",color:'white',border:"none",borderRadius:"1vh"}} onClick={onSubmitFilterSearch}>Submit</button>
            </div>

        </div>
        
        </div>
        


    );
};

export default FilterTransaction;
