fs=require('fs');
var header=new Array();

var literacy={
  literateMales : 0,
  literateFemales: 0,
  illiterateMales: 0,
  illiterateFemales: 0
};

var northEastStates=['ARUNACHAL PRADESH','NAGALAND','MANIPUR','MIZORAM','TRIPURA','MEGHALAYA','ASSAM'];

var states={};

(function analyse() {
    console.log("Reading file");
    readInput(0);
})();

function readInput(fileName) {
        console.log("Opening file India2011_"+fileName+".csv");
        var csvrow=require('csvrow');
        var readIndc=true;
        try {
                  var fileObj = require('readline').createInterface({input: require('fs').createReadStream('../data/'+"India2011_"+fileName+".csv")});
        } catch (e) {
          throw e;
          //console.log(e);
        } finally {

        }


          fileObj.on('line', function(line) {
                        var buffer = csvrow.parse(line);

                        if(readIndc){
                          if(fileName==0){
                            for(i in buffer)
                            header.push(buffer[i]);
                          }
                          readIndc=false;
                        }
                        else if(buffer[4] == "Total" && buffer[5] == "All ages"){
                                //console.log("Current line State : "+buffer[3].replace("State -", "").trim());
                                //console.log(buffer[10]);
                                literacy.literateMales+=parseInt(buffer[13],10);
                                literacy.literateFemales+=parseInt(buffer[14],10);
                                literacy.illiterateMales+=parseInt(buffer[10],10);
                                literacy.illiterateFemales+=parseInt(buffer[11],10);

                                var currentState=buffer[3].replace("State -", "").trim();
                                if(currentState in states) {

                                   var state = states[currentState];
                                   state.literateMales += parseInt(buffer[13]);
                                   state.illiterateMales += parseInt(buffer[10]);
                                   state.literateFemales += parseInt(buffer[14]);
                                   state.illiterateFemales += parseInt(buffer[11]);

                                }
                                else {
                                  states[currentState] = {
                                    literateMales : parseInt(buffer[13]),
                                    literateFemales : parseInt(buffer[14]),
                                    illiterateMales : parseInt(buffer[10]),
                                    illiterateFemales :parseInt(buffer[11])
                                   };
                                 }
                                //dataRows.push(buffer);
                            }
                        }).on('close', function() {
                        console.log('Closing the data file. \nStatus :' + dataRows.length+' lines read.\n');
                        //console.log(dataRows.length);

                        if(fileName==2){
                          console.log("All file read successfully!")
                          //console.log(states);
                          //console.log(literacy);
                          generateJSONFiles();
                          return;
                        }
                        readInput(++fileName);
                    });
      //readInput(++fileName);
}

function generateJSONFiles(argument) {
  var resultOverall=new Array();
  var resultNorthEast=new Array();

  resultOverall.push({'education' : 'literate',
    'male'      : literacy.literateMales,
    'female'    : literacy.literateFemales
  });

  resultOverall.push({'education' : 'Illiterate',
    'male'      : literacy.illiterateMales,
    'female'    : literacy.illiterateFemales
  });

  console.log("Write begins...");


        fs.writeFile('../data/overallResults.json', JSON.stringify(resultOverall), function (err) {
        if (err) return console.log(err);
        console.log("overallResults written Successfully.");
      });

      var resultNorthEast=new Array();
      var resultAllStates=new Array();

      for(state in states){
        var val=new Object();
        val["state"]=state;
        val["literateMales"]=states[state].literateMales;
        val["literateFemales"]=states[state].literateFemales;
        val["illiterateMales"]=states[state].illiterateMales;
        val["illiterateFemales"]=states[state].illiterateFemales;

        resultAllStates.push(val);

        for(i in northEastStates)
          {
            if(northEastStates[i]==state){
              resultNorthEast.push(val);
          }
      }
}
console.log(resultNorthEast);
fs.writeFile('../data/northEastResults.json', JSON.stringify(resultNorthEast), function (err) {
if (err) return console.log(err);
console.log("North East states result written Successfully.");
});

fs.writeFile('../data/allStates.json', JSON.stringify(resultAllStates), function (err) {
if (err) return console.log(err);
console.log("All states result written Successfully.");
});
}
