var fs = require('fs');

var file1= fs.readFileSync('../csv/India2011.csv','utf8');
var file2 = fs.readFileSync('../csv/IndiaSC2011.csv','utf8');
var file3 = fs.readFileSync('../csv/IndiaST2011.csv','utf8');

var csvtojson = function(csv) {

  var states={};
  var lines = csv.split("\r\n");
  var headers = lines[0].split(",");

  for (var j = 1; j < lines.length; j++) {
     var currentLine = lines[j].split(",");
     if(currentLine[4] == "Total" && currentLine[5] == "All ages") {
        var currentState = currentLine[3];

        if(currentState in states) {

           var state = states[currentState];
           state.literateMales += parseInt(currentLine[13]);
           state.illiterateMales += parseInt(currentLine[10]);
           state.literateFemales += parseInt(currentLine[14]);
           state.illiterateFemales += parseInt(currentLine[11]);
        }
        else {
          states[currentState] = {
            literateMales : parseInt(currentLine[13]),
            literateFemales : parseInt(currentLine[14]),
            illiterateMales : parseInt(currentLine[10]),
            illiterateFemales :parseInt(currentLine[11])
           };
         }
       }
     }

     return stateresult(states);

    }

    var stateresult = function(states){
      var result=[];
      var population = {
        literateMales : 0,
        literateFemales : 0,
        illiterateMales : 0,
        illiterateFemales : 0
      };

      for(state in states) {
        population.literateMales += parseInt(states[state].literateMales);
        population.literateFemales += parseInt(states[state].literateFemales);
        population.illiterateMales += parseInt(states[state].illiterateMales);
        population.illiterateFemales += parseInt(states[state].illiterateFemales);
       };

       result.push( {
          'education':'Literate',
          'male' : population.literateMales,
          'female' : population.literateFemales
       });

       result.push( {
          'education':'Illiterate',
          'male' : population.illiterateMales,
          'female' : population.illiterateFemales
       });

       return result;

     }

     var output = function (){
      var final = [];
      final.push.apply(final, result1);
      final.push.apply(final, result2);
      final.push.apply(final, result3);

      var totalmaleliterate =0;var totalmaleilliterate = 0;var totalfemaleliterate=0;var totalfemaleilliterate=0;

      for (var el=0 ;el<final.length;el++){
        if(final[el]["education"]==="Literate")
        {
          totalmaleliterate += final[el]["male"];
          totalfemaleliterate+=final[el]["female"];
        }
        else {
          totalmaleilliterate+=final[el]["male"];
          totalfemaleilliterate+=final[el]["female"];
        }

      }

      var final_result=[];
      var objectsliterate={};

      objectsliterate["education"]= "Literate";
      objectsliterate["male"]=totalmaleliterate;
      objectsliterate["female"]=totalfemaleliterate;

      var objectsilliterate={};
      objectsilliterate["education"]= "Illiterate";
      objectsilliterate["male"]=totalmaleilliterate;
      objectsilliterate["female"]=totalfemaleilliterate;

      final_result.push(objectsliterate);
      final_result.push(objectsilliterate);

      fs.writeFile("../json/Json_Allstates.json",JSON.stringify(final_result,null,4),function(err,data){
        if(err){
          return console.log(err);
        }
        console.log(final_result);
        console.log("All states results generated successfully");
      });

    }

    var result1 = csvtojson(file1.toString());
    var result2= csvtojson(file2.toString());
    var result3 =csvtojson(file3.toString());

    output();
