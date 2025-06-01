import React, { useEffect, useState } from "react";
import "../Styles/Transaction.css";
import PopUpModal from "../common/Modal";
import filterTransaction from "../images/FilterTransaction.jpg";
import EditTransaction from "../images/EditTransaction.png";
import DeleteTransaction from "../images/DeleteTransaction.jpg";
import AddTransaction from "../images/AddTransaction.png";
import * as Api from '../Api/Apis';
import { useMutation, useQuery } from "@tanstack/react-query";
import FilterTransaction from "./FilterTransaction";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,    // ✅ Must have
  PointElement,   // ✅ Must have
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
   CategoryScale,
  LinearScale,
  BarElement,
  LineElement,    // ✅ Must have
  PointElement,   // ✅ Must have
  ArcElement,
  Tooltip,
  Legend,
  Title
);

function Report() {
    const [transactionDetails, setTransactionDetails] = useState({ amount: "", type: "", category: "", date: "", description: "", id: '' })
    const [show, setShow] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [transactionDetailsErrors, setTransactionDetailsErrors] = useState('')
    const [transactionListDetails, setTransactionListDetails] = useState({ startDate: '', endDate: '', year: new Date().getFullYear(), month: '', type: 'all', category: 'all' })
    const [transactionListResponse, setTransactionListResponse] = useState('')
    const [DateList, setDateList] = useState('')
    const [DateDetails, setDateDetails] = useState('')
    const [MonthId, setMonthId] = useState('')
    const [DateId, setDateId] = useState('')
    const [DateListToogle, setDateListToogle] = useState(false)
    const [DateDetailsToogle, setDateDetailsToogle] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const[sameMonth,setShowMonth]=useState(false)
    const dateNew = new Date()



    const { data: TransactionList, isLoading, error } = useQuery({
        queryKey: 'TransactionList',
        queryFn: () => Api.transactionList({ year: dateNew.getFullYear(), month: '', startDate: '', endDate: '', type: 'all', category: "all" })
    })

    useEffect(() => {
        setTransactionListResponse(TransactionList?.data?.data?.transactionData)
        localStorage.setItem('onActiveTab',2)
        console.log('TransactionList123', transactionListResponse);
    }, [TransactionList])

    const handleAddClick = () => {
        setIsEdit(false)
        setTransactionDetails({ amount: "", type: "", category: "", date: "", description: "" })
        setShow(true);
    };

    let TransactionDataArray = []
    let DateArr = []
    let DetailArr = []
    for (const key in transactionListResponse) {
        const transactions = transactionListResponse[key]?.transactions || [];

        let income = 0;
        let expense = 0;

        transactions.forEach((data) => {
            if (data.type === 'income') {
                income += data.amount;
            } else if (data.type === 'expense') {
                expense += data.amount;
            }
        });

        TransactionDataArray.push({
            date: key,
            income,
            expense,
            total: transactionListResponse[key].total
        });
    }


    DateArr = [];
    DetailArr = []

    for (const key in DateList) {
        const transactions = DateList[key]?.transactions || [];

        let income = 0;
        let expense = 0;

        transactions.forEach((data) => {
            if (data.type === 'income') {
                income += data.amount;
            } else if (data.type === 'expense') {
                expense += data.amount;
            }
        });

        DateArr.push({
            date: key,
            income,
            expense,
            total: DateList[key].total
        });
    }



    DateDetails && DateDetails.length > 0 && DateDetails.forEach((data) => {
        let expense = 0
        let income = 0
        if (data?.type === 'income') {
            income += data?.amount;
        } else if (data?.type === 'expense') {
            expense += data?.amount;
        }
        DetailArr.push({
            category: data?.category,
            income,
            expense,
            Description: data?.description,
            id: data._id
        });
        console.log(DetailArr);
    });




    const getTransactionFilterValues = async (data) => {

        DateArr = []
        DetailArr = []
        TransactionDataArray = []
        setDateList('')
        setDateListToogle(false);
        setDateDetailsToogle(false)
        setTransactionListDetails(false)
        setMonthId(null)
        setDateId(null)


        console.log(data, ":setTransactionListDetails");

        if (data.startDate) {
            if (!data.endDate) {
                toast.error('select To Date')
            }
        }
        else if (data.endDate) {
            if (!data.startDate) {

                toast.error('select From Date')
            }
        }

        Api.transactionList(data).then((res) => {
            if (res.data.data.totalAmount != 0) {
                setShowFilter(false)
                setTransactionListResponse(res?.data?.data?.transactionData)


            }
            else {
                TransactionDataArray = []
                setTransactionListResponse('')
            }

        }).catch(() => {
            TransactionDataArray = []
            setTransactionListResponse('')
        })


    }

    const onSubmitTransactionDetails = (e) => {
        e.preventDefault();
        const Date = transactionDetails.date.split('-')
        const CreateTransactionDate = {
            amount: Number(transactionDetails.amount),
            date: `${Date[2]}/${Date[1]}/${Date[0]}`,
            description: transactionDetails.description,
            type: transactionDetails.type,
            category: transactionDetails.category
        }
        const EditTransactionDate = {
            amount: Number(transactionDetails.amount),
            date: `${Date[1]}/${Date[2]}/${Date[0]}`,
            description: transactionDetails.description,
            type: transactionDetails.type,
            category: transactionDetails.category
        }



        const errors = onFormValidate();
        if (Object.keys(errors).length === 0) {
            if (isEdit) {
                EditTransactionMutate({
                    id: transactionDetails.id,
                    data: EditTransactionDate
                });
                console.log(CreateTransactionDate, JSON.parse(JSON.stringify(transactionDetails.id)), 'CreateTransactionDate');
            }
            else {
                CreateTransactionMutate(CreateTransactionDate)
                console.log(CreateTransactionDate);
            }
        }

    };

    const {
        mutate: CreateTransactionMutate,
        isLoading: isCreateTransactionLoading,
        isError: isCreateTransactionError,
        error: CreateTransactionError,
        data: CreateTransactionData
    } = useMutation({
        mutationKey: ["createTrasaction"],
        mutationFn: Api.createTransaction,
        onSuccess: (res) => {

            if (res) {

                setTransactionDetails({
                    amount: "", type: "", category: "", date: "", description: ""
                });
                setShow(false)
                setTransactionDetailsErrors({ amount: "", type: "", category: "", date: "", description: "" })
                toast.info('Transaction is Created', {
                    autoClose: 1000,
                    onClose: () => {
                        onClearAll()
                    }

                });
            }
            else {
                setTransactionDetailsErrors({ amount: "", type: "", category: "", date: "", description: "" })
            }
        },
        onError: (err) => console.error('Login Error', err),
    });


    const {
        mutate: EditTransactionMutate,
        isLoading: isEditTransactionLoading,
        isError: isEditTransactionError,
        error: EditTransactionError,
        data: isEditTransactionData
    } = useMutation({
        mutationKey: ["editTransaction"],
        mutationFn: ({ id, data }) => Api.transactionDetailsEdit(id, data),
        onSuccess: (res) => {

            if (res) {

                setTransactionDetails({
                    amount: "", type: "", category: "", date: "", description: ""
                });
                setShow(false)
                setTransactionDetailsErrors({ amount: "", type: "", category: "", date: "", description: "" })
                toast.info('Transaction is Updated', {
                    autoClose: 1000,
                    onClose: () => onClearAll()
                });
            }
            else {
                setTransactionDetailsErrors({ amount: "", type: "", category: "", date: "", description: "" })
            }
        },
        onError: (err) => console.error('Login Error', err),
    });
    console.log('edited:', transactionDetails);


    const onFormValidate = () => {
        const errors = {};
        const amount = /[0-9]/

        if (!String(transactionDetails.amount).trim()) {
            errors.amount = "amount cannot be empty";
        }
        else if (!amount.test(transactionDetails.amount)) {
            errors.amount = "Enter valid amount";
        }
        if (!transactionDetails.description.trim()) {
            errors.description = "Description cannot be empty";
        }
        if (!transactionDetails.type.trim()) {
            errors.type = "Select the type";
        }
        if (!transactionDetails.category.trim()) {
            errors.category = "Select the category";
        }
        if (!transactionDetails.date.trim()) {
            errors.date = "Select the Date";
        }

        setTransactionDetailsErrors(errors);
        return errors;
    };
console.log(DateListToogle,DateDetailsToogle,"DateDetailsToogle");

    const onChangeTransactionDetails = (e) => {
        const { name, value } = e.target;

        if (name === 'amount') {
            if (!isNaN(value)) {
                setTransactionDetails((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else {
            setTransactionDetails((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    console.log(transactionDetails);



    const onClickMonth = (data) => {
        const month=MonthName[data]
        const isSameMonthClicked = month === MonthId;
        const willToggleOpen = !isSameMonthClicked&&DateListToogle?true:!DateListToogle;
setShowMonth(isSameMonthClicked)
        setMonthId(month);
        setDateList('')
        DateArr = ''
        setDateDetails('')
        DetailArr=''
        setDateListToogle(willToggleOpen);

        console.log(month , MonthId, "monthid");

        if (!willToggleOpen && isSameMonthClicked) {
            setDateList('');
            return;
        }
        Api.transactionList({
            month: data,
            year: transactionListDetails.year || 2025,
            startDate: '',
            endDate: '',
            type: transactionListDetails.type || 'all',
            category: transactionListDetails.category || 'all'
        }).then((res) => {
            if (res.data.data.totalAmount !== 0) {
                setDateList(res?.data?.data?.transactionData);
            } else {
                setDateList('');
            }
        }).catch(() => {
            setDateList('');
        });
    };

    const onClickDate = (date) => {
        const isSameDateClicked = date === DateId;
        const willToggleOpen = (!isSameDateClicked&&DateDetailsToogle)||(!sameMonth&&isSameDateClicked&&!DateDetails)?true:!DateDetailsToogle;
        setDateId(date);
        setDateDetails('')
        DetailArr = ''
        setDateDetailsToogle(willToggleOpen);
        console.log(DateDetails, "dateid");

        if (!willToggleOpen && isSameDateClicked) {
            setDateDetails('');
            return;
        }

        Api.transactionDetails(date).then((res) => {

            if (res?.data?.data) {
                setDateDetails(res?.data?.data);
            } else {
                setDateDetails('');
            }
        }).catch(() => {
            setDateDetails('');
        });
    };

    const onDetailEditClick = (id, data, date) => {
        console.log(id, data)
        setTransactionDetails({ amount: data.expense || data.income, type: data.expense ? 'expense' : 'income', description: data.Description, category: data.category, date: date, id: data.id })
        setShow(true)
        setIsEdit(true)
    }

    const onDetailDeleteClick = (id) => {
        Api.transactionDetailsDelete(id).then((res) => {
            if (res) {
                onClearAll()
            }
        })
            .catch((err) => {

                console.log("error happens");


            })
    }

    const onClearAll = () => {
        DateArr = []
        DetailArr = []
        TransactionDataArray = []
        setDateList('')
        setDateListToogle(false);
        setDateDetailsToogle(false)
        setTransactionListDetails(false)
        setMonthId(null)
        setDateId(null)


        Api.transactionList({ startDate: '', endDate: '', year: new Date().getFullYear(), month: '', type: 'all', category: 'all' }).then((res) => {
            if (res.data.data.totalAmount != 0) {
                setTransactionListResponse(res?.data?.data?.transactionData)
            }
            else {
                TransactionDataArray = []
                setTransactionListResponse('')
            }

        }).catch(() => {
            TransactionDataArray = []
            setTransactionListResponse('')
        })
    }

    const MonthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const chartData = {
    labels: TransactionDataArray?.map((data) => !isNaN(data?.date)?MonthName[data?.date-1]:data.date),
    datasets: [
      {
        label: "Income",
        data: TransactionDataArray?.map((data) => data?.income)||0,
        backgroundColor: "green",
      },
      {
        label: "Expense",
        data: TransactionDataArray?.map((data) => data?.expense||0),
        backgroundColor: "red", 
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text:isNaN(TransactionDataArray[0]?.date)? "Date Wise Chart" :"Month Wise Chart" },
    },
  };


   const lineData = {
    labels: TransactionDataArray?.map((data) => !isNaN(data?.date)?MonthName[data?.date-1]:data.date.split('T')[0]),
    datasets: [
      {
        label: "Income",
        data: TransactionDataArray?.map((data) => data?.income)||0,
        backgroundColor: "green",
        fill: false,
      backgroundColor: "green",
      borderColor: "green",
      tension: 0.4,
      pointRadius: 5, 
      pointBackgroundColor: "green",
      pointBorderColor: "green",
      pointHoverRadius: 7,
      },
      {
        label: "Expense",
        data: TransactionDataArray?.map((data) => data?.expense||0),
        backgroundColor: "red", 
        fill: false,
      backgroundColor: "red",
      borderColor: "red",
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: "red",
      pointBorderColor: "red",
      pointHoverRadius: 7,
      }
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text:isNaN(TransactionDataArray[0]?.date)? "Date Wise Chart" :"Month Wise Chart" },
    },
  };

    console.log(DetailArr)
    

    return (
        <div>
            <PopUpModal
                show={show}
                closeButton={true}
                closeFunction={() => setShow(false)}
                overlayFunction={() => setShow(false)}
                headerContent={isEdit ? "Edit Transaction" : "Create Transaction"}
                bodyContent={
                    <>
                        <div className="restform">
                            <label>Amount</label>
                            <input type="numbers" name="amount" value={transactionDetails.amount} onChange={onChangeTransactionDetails} />
                            <div style={{ color: "red" }}>{transactionDetailsErrors.amount}</div>
                        </div>
                        <div className="restform">
                            <label>Type</label>
                            <select name="type" id="" value={transactionDetails.type} onChange={onChangeTransactionDetails}>
                                <option value="">--Select--</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                            <div style={{ color: "red" }}>{transactionDetailsErrors.type}</div>
                        </div>
                        <div className="restform">
                            <label>Category</label>
                            <select name="category" id="" value={transactionDetails.category} onChange={onChangeTransactionDetails}>
                                <option value="">--Select--</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Health">Health</option>
                                <option value="Bills">Bills</option>
                            </select>
                            <div style={{ color: "red" }}>{transactionDetailsErrors.category}</div>
                        </div>
                        <div className="restform">
                            <label>Date</label>
                            <input type='date' name="date" value={transactionDetails.date} onChange={onChangeTransactionDetails} />
                            <div style={{ color: "red" }}>{transactionDetailsErrors.date}</div>
                        </div>
                        <div className="restform">
                            <label>Description</label>
                            <textarea name="description" id="" value={transactionDetails.description} onChange={onChangeTransactionDetails}></textarea>
                            <div style={{ color: "red" }}>{transactionDetailsErrors.description}</div>
                        </div>
                    </>
                }
                footerContent={
                    <>
                        <button onClick={onSubmitTransactionDetails} >{isEdit ? "Update" : "Submit"}</button>
                        <button onClick={() => setShow(false)}>Cancel</button>
                    </>
                }
            />
            <section id='TopSection'>
                <div id="addFilter">
                    <button onClick={handleAddClick} title="Add Transaction">
                        <img src={AddTransaction} alt="Add Transaction" />
                    </button>
                    <button onClick={() => setShowFilter(!showFilter)} title="Filter Transaction">
                        <img src={filterTransaction} alt="Filter Transaction" />
                    </button>
                    {/* <button>
          <img src={EditTransaction} alt="Edit Transaction" />
        </button>
        <button>
          <img src={DeleteTransaction} alt="Delete Transaction" />
        </button> */}

                    {/* {DateArr ? DateArr.map((data, id) => (
                        isNaN(data.date) ? <tr key={id} >
                            <td>{data.date}</td>
                            <td>{data.type === 'income' ? data.amount : '-'}</td>
                            <td>{data.type === 'expense' ? data.amount : '-'}</td>
                            <td>{data.total}</td>
                        </tr> :
                            <tr key={id} onClick={() => onClickMonth(data.date)}>
                                <td>{data.date}</td>
                                <td>{data.type === 'income' ? data.amount : '-'}</td>
                                <td>{data.type === 'expense' ? data.amount : '-'}</td>
                                <td>{data.total}</td>
                            </tr>
                    )) : ""} */}
                </div>

                <div id="clearAll" title="clear All the Filter and Data" onClick={onClearAll}>Clear All</div>
            </section>
            
            {showFilter && <FilterTransaction getTransactionFilterValues={getTransactionFilterValues} />}
            <div id="TableWrap">

                {/* <Doughnut data={chartData} options={chartOptions} /> */}
            
                           {TransactionDataArray[0]? <div id="ReportChart">

    {TransactionDataArray && TransactionDataArray.length && !isNaN(TransactionDataArray[0].date)> 0 ? (                      
       TransactionDataArray.length > 0 && <Bar data={chartData} options={chartOptions} />
      ) : (
       TransactionDataArray.length > 0 && <Line data={lineData} options={lineOptions} />
      )}
      
                                
         </div>
:<h1>No Transaction Report Found :(</h1>}


</div>


        </div>
    );
}

export default Report;
