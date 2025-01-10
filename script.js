// click button then open popup from
let btn = document.querySelector(".icon");
let form = document.querySelector(".popup-form");
const closeBtn = document.querySelector("#close-btn");
btn.addEventListener("click",function(){
    form.style.display = "block"
})

// close popup window
closeBtn.addEventListener("click",close);

function close(){
    form.style.display = "none"
}

// add Transaction when clicked the submit button
let tform = document.querySelector(".tform");
let submitbtn = document.querySelector(".submit-btn");
let allinput = document.querySelectorAll("input");
let select = document.querySelector("#select");
let transaction = [];

if(localStorage.getItem('transaction') != null){
    transaction = JSON.parse(localStorage.getItem('transaction'))
}

tform.onsubmit = (e) => {
    e.preventDefault();
    let obj = {
        product : allinput[0].value,
        amount : allinput[1].value,
        transaction : select.value,
        date : new Date()
    }
    transaction.push(obj);
    localStorage.setItem('transaction',JSON.stringify(transaction));
    tform.reset('');    
    let form = document.querySelector(".popup-form");
    form.style.display = "none"         // popup form
    showTransaction();
    calculation();
}

// date formate  and time formate 
const formateDate = (d) => {
    let date = new Date(d);
    let yy = date.getFullYear();
    let mm = date.getMonth()+1;
    let dd = date.getDate();
    let time = date.toLocaleTimeString();
    mm = mm < 10 ? '0'+mm : mm;
    dd = dd < 10 ? '0'+dd : dd;
    return `${dd}-${mm}-${yy}__${time}`
}

// Delete transaction
const deleteT = () => { 
    let delbtn = list.querySelectorAll(".del-btn");
    delbtn.forEach((btn,index) => {
        btn.onclick = () =>{
           transaction.splice(index,1);
           localStorage.setItem('transaction',JSON.stringify(transaction));
           showTransaction();
           calculation();
        }
    });

}

// Update transaction
let allbtn = tform.querySelectorAll("button");
let popupbtn = document.querySelector(".popup-btn");
const updateT = () => {
    let editbtn = list.querySelectorAll(".edit-btn");
    editbtn.forEach((btn,index)=> {
        btn.onclick = () => {
            popupbtn.click();
            select.value = btn.getAttribute("transaction");
            allinput[0].value = btn.getAttribute("product");
            allinput[1].value = btn.getAttribute("amount");  
            allbtn[0].style.display = "none";
            allbtn[1].style.display = "block";
            allbtn[1].onclick = () =>{
                let obj = {
                    product : allinput[0].value,
                    amount : allinput[1].value,
                    transaction : select.value,
                    date : new Date()
                }
                transaction[index] = obj;
                localStorage.setItem('transaction',JSON.stringify(transaction));
                tform.reset('');    
                let form = document.querySelector(".popup-form");
                form.style.display = "none"
                showTransaction();
                calculation();
            }
        }
    })
}


// Show Transaction History
let list = document.querySelector(".t-list");

const showTransaction = () => {
    list.innerHTML = '';
    transaction.forEach((item,index) =>{
        list.innerHTML += `
         <tr>
             <td>${item.product}</td>
             <td>₹${item.amount}</td>
             <td>${item.transaction}</td>
             <td>${formateDate(item.date)}</td>
             <td>
                 <button product="${item.product}" amount="${item.amount}" transaction="${item.transaction}"  class="edit-btn" style=" margin-right: 0.8rem;">Edit</i></button>
                 <button class="del-btn">Delete</button>
             </td>
         </tr>`;
    })
    deleteT();
    updateT();
}
showTransaction();

// calculations of transations
let balance = document.querySelector("#your-balance");
let expense = document.querySelector("#expense-rupee");
let income = document.querySelector("#income-rupee");

const calculation = () => {
    let totalCredit = 0;
    let totalDebit = 0;
    let filterCredit = transaction.filter((item) => item.transaction == "Credit");
    for(let obj of filterCredit){
        totalCredit +=  +(obj.amount);
    }
    let filterDebit = transaction.filter((item) => item.transaction == "Debit");  
    for (let obj of filterDebit){
        totalDebit +=  +(obj.amount);
    }
    expense.innerText = `₹${totalDebit}`;
    income.innerText = `₹${totalCredit}`;
    balance.innerText = `₹${totalCredit-totalDebit}`
}
calculation();

