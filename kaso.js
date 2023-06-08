//var srv="www."+"5icoin"+".com";
var srv="127.0.0.1";
var addr="ws://"+srv+":9818";
if(window.location.href.startsWith("https://"))
{
    addr="wss://"+srv+":9817";
}
function ksockeRequect(anum,cbstart,sdid)
{        
	if(anum<1) anum=query("num")	
    if(anum<2) anum=rnum;	
	if(anum==null||anum<2) anum=3;
    started=false;
    tick=Date.now();        
    try {        
        let socket=new WebSocket(addr); 
        socket.binaryType = "arraybuffer";                
        //new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);                
        socket.onopen = function(evt) {
            var str="rubric:num:"+anum+":0";   
            if(sdid!=-1)
                str=str+":"+sdid;         
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
            socket.close();      
            cbstart('kodo',anum,started,tick,subject[3],subject[1],subject[5],subject[6]);                              
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

function ksloveDone(id,cb)
{    
    try {        
        let socket=new WebSocket(addr); 
        socket.binaryType = "arraybuffer";
        socket.onopen = function(evt) {
            var str="rubric:done:"+id+"";
            //var str="rubric:num:99:0";
            socket.send(toData(str));
        };
        socket.onmessage = function(evt) {              
            console.log("done");
            socket.close();                        
            if(cb)cb();            
        };
        socket.onerror = function(evt) {
            console.log("error:"+evt);
            socket.close();
            if(cb)cb();                        
        };
        socket.onclose = function(evt) {            
            socket.close();            
        };    
    } catch (error) {
        console.log(error);        
        if(cb)cb();        
    }
}

function ksocketCmds(cmd,cb)
{    
    try {        
        let socket=new WebSocket(addr); 
        socket.binaryType = "arraybuffer";
        socket.onopen = function(evt) {            
            socket.send(toData(cmd));
        };
        socket.onmessage = function(evt) {              
            console.log("done");
            socket.close();                                    
            if(cb)cb();            
        };
        socket.onerror = function(evt) {
            console.log("error:"+evt);
            socket.close();  
            if(cb)cb();                      
        };
        socket.onclose = function(evt) {            
            socket.close();            
        };    
    } catch (error) {
        console.log(error);              
        if(cb)cb();
    }
}