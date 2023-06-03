function ksockeRequect(anum,cbstart)
{        
	if(anum<1) anum=query("num")	
    if(anum<2) anum=rnum;	
    started=false;
    tick=Date.now();
    var addr="ws://www."+"5icoin"+".com"+":9818";
    if(window.location.href.startsWith("https://"))
    {
        addr="wss://www."+"5icoin"+".com"+":9817";
    }
    let socket=new WebSocket(addr); 
    try {        
        socket.binaryType = "arraybuffer";
        //new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);        
        startTimer();
        socket.onopen = function(evt) {
            var str="rubric:num:"+anum+":0";
            //var str="rubric:num:99:0";
            socket.send(toData(str));
        };
        socket.onmessage = function(evt) {              
            var array = new Uint8Array(evt.data);
            var str = "";
            for (var i = 0; i < array.length; i++) {
                str = str + String.fromCharCode(array[i]);
            }
            var subject=str.split(":");                        
            //startKodo(subject[3],subject[1],subject[5]); 
            cbstart('kodo',anum,started,tick,subject[3],subject[1],subject[5]);
            socket.close();                        
        };
        socket.onerror = function(evt) {
            console.log("error:"+evt);
            socket.close();
            //startLocal(anum);  
            cbstart('local',anum,started,tick);             
        };
        socket.onclose = function(evt) {            
            socket.close();            
        };    
    } catch (error) {
        console.log(error);
        //startLocal(anum);   
        cbstart('local',anum,started,tick);
    }    
}
