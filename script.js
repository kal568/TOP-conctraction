const ADMIN_PASSWORD = "TOP2025Secure";

let workers = JSON.parse(localStorage.getItem("workers")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let payroll = JSON.parse(localStorage.getItem("payroll")) || [];

let chartInstance = null;

function saveData(){
localStorage.setItem("workers",JSON.stringify(workers));
localStorage.setItem("tasks",JSON.stringify(tasks));
localStorage.setItem("payroll",JSON.stringify(payroll));
}

function loginAdmin(){
const pwd=document.getElementById("password").value;
if(pwd===ADMIN_PASSWORD){
document.getElementById("loginBox").style.display="none";
document.getElementById("dashboard").style.display="block";
renderWorkers();
renderTasks();
renderPayroll();
}else{
alert("Wrong Password");
}
}

function addWorker(){
const name=document.getElementById("newWorker").value.trim();
if(!name) return;
workers.push({name});
saveData();
renderWorkers();
document.getElementById("newWorker").value="";
}

function renderWorkers(){
const list=document.getElementById("workerList");
const select=document.getElementById("workerSelect");
list.innerHTML="";
select.innerHTML="";
workers.forEach(w=>{
list.innerHTML+=`<li>${w.name}</li>`;
select.innerHTML+=`<option>${w.name}</option>`;
});
}

function submitTask(){
const project=document.getElementById("project").value;
const worker=document.getElementById("workerSelect").value;
const category=document.getElementById("category").value;
const quantity=document.getElementById("quantity").value;
if(!worker||!quantity) return;
tasks.push({project,worker,category,quantity});
saveData();
renderTasks();
}

function renderTasks(){
const list=document.getElementById("taskList");
list.innerHTML="";
tasks.forEach(t=>{
list.innerHTML+=`<li>${t.worker} | ${t.project} | ${t.category} | ${t.quantity}</li>`;
});
updateChart();
}

function addPayroll(){
const name=document.getElementById("name").value.trim();
const rate=parseFloat(document.getElementById("rate").value);
const days=parseFloat(document.getElementById("days").value);
if(!name||!rate||!days) return;
const total=rate*days;
payroll.push({name,rate,days,total});
saveData();
renderPayroll();
}

function renderPayroll(){
const tbody=document.getElementById("payrollBody");
tbody.innerHTML="";
payroll.forEach((p,i)=>{
tbody.innerHTML+=`<tr>
<td>${p.name}</td>
<td>${p.rate}</td>
<td>${p.days}</td>
<td>${p.total}</td>
<td><button onclick="deletePayroll(${i})">X</button></td>
</tr>`;
});
}

function deletePayroll(i){
payroll.splice(i,1);
saveData();
renderPayroll();
}

function backupData(){
const data="data:text/json;charset=utf-8,"+
encodeURIComponent(JSON.stringify({workers,tasks,payroll}));
const link=document.createElement("a");
link.href=data;
link.download="TOPConctraction_backup.json";
link.click();
}

function updateChart(){
const ctx=document.getElementById("taskChart").getContext("2d");

const p1=tasks.filter(t=>t.project==="Project 1").length;
const p2=tasks.filter(t=>t.project==="Project 2").length;

if(chartInstance) chartInstance.destroy();

chartInstance=new Chart(ctx,{
type:"bar",
data:{
labels:["Project 1","Project 2"],
datasets:[{
label:"Tasks",
data:[p1,p2],
backgroundColor:["#2a5298","#1e3c72"]
}]
}
});
}