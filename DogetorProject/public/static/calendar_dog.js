$("#nxtmbtn").on('click',function(event){
    event.preventDefault();
    event.stopPropagation();
    if(month == 11){        
            month = -1;
            year++;
    }; 
    document.getElementById("schedulehead").innerHTML = "Appointment schedule : " + monthlist[++month] + " " + year;
    datee.setDate(1);
    datee.setMonth(month);
    datee.setFullYear(year);
    var day = datee.getDay();
    // alert(month);
    $.ajax({
        url:"/doginfo",
        type:"POST",          
        data: {date:1,day,day,month:month,year:year,limit:limit}
    }).done(function(result){
        limit = new Date(year, month+1, 0).getDate();
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
    datee.setDate(1);
    datee.setMonth(month);
    datee.setFullYear(year);
    var day = datee.getDay();
    // alert(month);
    $.ajax({
        url:"/doginfo",
        type:"POST",          
        data: {date:1,day,day,month:month,year:year,limit:limit}
    }).done(function(result){  
        limit = new Date(year, month+1, 0).getDate();
        nxtMonth(result);
    })
})
function preMonth(){
    var div = document.getElementById("calendar");
    div.innerHTML = result1;
}