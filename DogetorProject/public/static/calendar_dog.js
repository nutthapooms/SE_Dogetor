
    var datee = new Date();
    var month = datee.getMonth();
    var year = datee.getFullYear();
    datee.setDate(1);
    var date = datee.getDate();
    var day = datee.getDay();
    var checkday = 0;
    var monthlist = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    document.getElementById("schedulehead").innerHTML = "Appointment schedule : " + monthlist[month] + " " + year;
    var x = document.getElementsByClassName("dogeach");
    var limit = new Date(year, month, 0).getDate();
    function updatecalendar(monthh,yearr){
        date = 1;
        datee.setDate(1);
        datee.setMonth(monthh);
        datee.setFullYear(yearr);
        var day = datee.getDay();
        limit = new Date(yearr, monthh, 0).getDate();
        for (var i = 0; i < x.length; i++) {
            if(i== day){
                checkday = 1;
            }
            if(checkday==0){
                x[i].innerHTML = " ";
            }
            else{
                if (date < limit) {
                    x[i].innerHTML = date;
                }
                else {
                    x[i].innerHTML = " ";
                }
                date++;
            }
        }  
        checkday = 0;
    }
    updatecalendar(month,year);
        
$("#nxtmbtn").on('click',function(event){
    event.preventDefault();
    event.stopPropagation();
    if(month == 11){        
            month = -1;
            year++;
    }; 
    document.getElementById("schedulehead").innerHTML = "Appointment schedule : " + monthlist[++month] + " " + year;
    limit = new Date(year, month+1, 0).getDate();  
    datee.setDate(1);
    datee.setMonth(month);
    datee.setFullYear(year);
    var day = datee.getDay();
    $.ajax({
        url:"/dogInfo",
        type:"POST",          
        data: {date:1,day,day,month:month,year:year,limit:limit+1}
    }).done(function(result){
        nxtMonth(result);
    })
})
function nxtMonth(result1){
    var div = document.getElementById("calendar");
    div.innerHTML = result1;
}

$("#prembtn").on('click',function(event){
    event.preventDefault();
    event.stopPropagation();
    if(month == 0){
        month = 12;
        year--;
    }; 
    document.getElementById("schedulehead").innerHTML = "Appointment schedule : " + monthlist[--month] + " " + year;      
    limit = new Date(year, month+1, 0).getDate();  
    datee.setDate(1);
    datee.setMonth(month);
    datee.setFullYear(year);
    var day = datee.getDay();
    $.ajax({
        url:"/dogInfo",
        type:"POST",          
        data: {date:1,day,day,month:month,year:year,limit:limit+1}
    }).done(function(result){  
        nxtMonth(result);
    })
})
function preMonth(){
    var div = document.getElementById("calendar");
    div.innerHTML = result1;
}
