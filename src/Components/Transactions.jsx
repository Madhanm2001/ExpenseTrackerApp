import React, { useEffect, useState } from "react";
import "../Styles/Transaction.css";
import PopUpModal from "../common/Modal";
import filterTransaction from "../images/filterTransaction.jpg";
import EditTransaction from "../images/EditTransaction.png";
import DeleteTransaction from "../images/DeleteTransaction.jpg";
import AddTransaction from "../images/AddTransaction.png";
import * as Api from '../Api/Apis';
import { useMutation, useQuery } from "@tanstack/react-query";
import FilterTransaction from "./FilterTransaction";

function Transactions() {
    const [transactionDetails, setTransactionDetails] = useState({ amount: "", type: "", category: "", date: "", description: "" })
    const [show, setShow] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [transactionDetailsErrors, setTransactionDetailsErrors] = useState('')
    const [transactionListDetails, setTransactionListDetails] = useState({ startDate: '', endDate: '', year: '', month: '', type: '', category: '' })
    const [transactionListResponse, setTransactionListResponse] = useState('')

    const dateNew = new Date()



    const { data: TransactionList, isLoading, error } = useQuery({
        queryKey: 'TransactionList',
        queryFn: () => Api.transactionList({ year: dateNew.getFullYear(), month: dateNew.getMonth() + 1, startDate: '', endDate: '', type: 'all', category: "all" })
    })

    useEffect(() => {
        setTransactionListResponse(TransactionList?.data?.data?.transactionData)
        console.log('TransactionList123', transactionListResponse);
    },[TransactionList])

    const handleAddClick = () => {
        setShow(true);
    };

    let TransactionDataArray = []

    for (const key in transactionListResponse) {

        console.log(key);
        TransactionDataArray.push({ date: key, amount: transactionListResponse[key].transactions[0].amount, type: transactionListResponse[key].transactions[0].type, total: transactionListResponse[key].total })
        console.log(TransactionDataArray);

    }

    const getTransactionFilterValues = async (data) => {

        setTransactionListDetails(data)

        console.log(transactionListDetails, ":setTransactionListDetails");

        Api.transactionList(data).then((res) => {
            if (res.data.data.totalAmount!=0) {

                setTransactionListResponse(res?.data?.data?.transactionData)


            }
            else {
                TransactionDataArray = []
                setTransactionListResponse('')
            }

        }).catch(()=>{
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

        const errors = onFormValidate();
        if (Object.keys(errors).length === 0) {

            CreateTransactionMutate(CreateTransactionDate)
            console.log(CreateTransactionDate);


        }

    };

    const {
        mutate: CreateTransactionMutate,
        isLoading: isCreateTransactionLoading,
        isError: isCreateTransactionError,
        error: CreateTransactionError,
        data: CreateTransactionData
    } = useMutation({
        mutationKey: ["resetPassword"],
        mutationFn: Api.createTransaction,
        onSuccess: (res) => {

            if (res) {

                setTransactionDetails({
                    amount: "", type: "", category: "", date: "", description: ""
                });
                setTransactionDetailsErrors({ amount: "", type: "", category: "", date: "", description: "" })
                window.location.reload();
            }
            else {
                setTransactionDetailsErrors({ amount: "", type: "", category: "", date: "", description: "" })
            }
        },
        onError: (err) => console.error('Login Error', err),
    });

    const onFormValidate = () => {
        const errors = {};
        const amount = /[0-9]/

        if (!transactionDetails.amount.trim()) {
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

    const onChangeTransactionDetails = (e) => {
        const { name, value } = e.target;

        setTransactionDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    console.log(transactionDetails);




    return (
        <div>





            <PopUpModal
                show={show}
                closeButton={true}
                closeFunction={() => setShow(false)}
                overlayFunction={() => setShow(false)}
                headerContent={"Create Transaction"}
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
                        <button onClick={onSubmitTransactionDetails} >Submit</button>
                        <button onClick={() => setShow(false)}>Cancel</button>
                    </>
                }
            />
            <section id='TopSection'>
                <div id="addFilter">
                    <button onClick={handleAddClick}>
                        <div className="buttonName">Create Transaction</div><img src={AddTransaction} alt="Add Transaction" />
                    </button>
                    <button onClick={() => setShowFilter(!showFilter)}>
                        <div className="buttonName" id="button2">Filter Transaction</div><img src={filterTransaction} alt="Filter Transaction" />
                    </button>
                    {/* <button>
          <img src={EditTransaction} alt="Edit Transaction" />
        </button>
        <button>
          <img src={DeleteTransaction} alt="Delete Transaction" />
        </button> */}
                </div>

                <div id="clearAll">Clear All</div>
            </section>
            {showFilter && <FilterTransaction getTransactionFilterValues={getTransactionFilterValues} />}
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {TransactionDataArray ? TransactionDataArray.map((data, id) => (
                        <tr key={id}>
                            <td>{data.date}</td>
                            <td>{data.type}</td>
                            <td>{data.amount}</td>
                            <td>{data.total}</td>
                        </tr>
                    )) : ""}
                </tbody>


            </table>

        </div>
    );
}

export default Transactions;
