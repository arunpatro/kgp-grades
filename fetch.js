
var all={};

var allDepts = ["AE","AG","BT","CE","CH","CS","CY","EC","EE","EX","GG","HS","IE","IM","MA","ME","MI","MT","NA","PH"];

for (var depIndex in allDepts){
	var dep = allDepts[depIndex];
	all[dep]={};
	(depIndex==6||depIndex==9||depIndex==10||depIndex==11||depIndex==14||depIndex==19) ? fromRoll(20001,dep) : function(){ fromRoll(10001,dep); fromRoll(30001,dep);}()
	
}

function fromRoll(start,dep){
	for(var i=start, breakCounter = 0;;i++){
		if (breakCounter>4) {break;}
		var roll = "13" + dep + String(i);
		(getPersonDetails(roll)!=false) ? function(){console.log("%c Roll no " + roll + " is valid, inserting into database", 'color : green'); all[dep][roll] = new createProfile(roll,getPersonDetails(roll)); breakCounter=0}(): function(){breakCounter++; console.log('%c Roll no ' + roll + ' is not valid','color:red');}()
	}
}

function createProfile(roll,personDetails){
	var nSems=(personDetails.length-1)/3;
	this.name=personDetails[0].getElementsByTagName("td")[4].innerHTML;
	this.roll=roll;
	this["Final CGPA"]=personDetails[3].getElementsByTagName('td')[11].innerHTML;
	for (var i=nSems;i>=1;i--)

	{
		this["Sem " + i]=function (){
			return {
				"SGPA" : personDetails[3*(nSems-i+1)].getElementsByTagName('td')[9].innerHTML,
				"CGPA" : personDetails[3*(nSems-i+1)].getElementsByTagName('td')[11].innerHTML,
			}
		}();
	}
}

function getPersonDetails(roll){
	var req = new XMLHttpRequest();
	url = "https://erp.iitkgp.ernet.in/StudentPerformance/view_performance.jsp?rollno="+roll;
	req.open("GET",url,false);
	req.send();
	parser = new DOMParser();
	var personDetails = parser.parseFromString(req.response, "text/html").body.getElementsByTagName("table");
	if ((parser.parseFromString(req.response, "text/html").body.getElementsByTagName("h3").length)!=0){
		return personDetails;
	}
	return false;
}




var allEE=[];

for(var i in all["EE"]){
	allEE.push(function(){return {"name":all["EE"][i].name, "roll" :all["EE"][i].roll, "CGPA":all["EE"][i]["Sem 4"].CGPA}}())
}

allEE.sort(function(a, b){return b.CGPA-a.CGPA})

function getDR(id){
	for(var iter1=0;iter1<allEE.length;iter1++){
		if(allEE[iter1].roll==id||allEE[iter1].name==id){
			console.log("Departmental Rank of " + id + " is ", iter1 + 1);
		}
	}
}
