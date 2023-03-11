var isLe = (function() {
    var buf = new ArrayBuffer(2);
    new DataView(buf).setInt16(0, 256, true);
    var edianflag = new Int16Array(buf)[0] === 256;
    var da=new Date();
    if (edianflag) {
        console.log(da+"litten edian");
    } else {
        console.log(da+"big edian");
    }
    return edianflag;
})();

var len=4;
var txt="拼命加载中....(如果等很久了请刷新试试！)";
var count=0;
var intid=0;
function showLoading()
{
    var loading=document.getElementById("loading");
	if(loading) loading.hidden=false;
    if(loading!=null&&!loading.hidden)
    {
        loading.innerHTML=txt.substr(0,len+1);
    }
    len++;
    var intval=100;
    if(len>=txt.length)
    {
        intval=1000;
    }
    len=len%txt.length;
    intid=setTimeout(function(){
        showLoading();
		count+=intval;
		if(count>6000){
			var close=document.getElementById("close");
			if(close)
				close.hidden=false;
		}else if(count>144000)
		{
			removeLoading();
			if(!loading.hidden)
			{				
				reStart();
			}
		}
    },intval);		    
}
showLoading();
    
var removeLoading=function(){
    var gd=document;//.getElementById("GameDiv");
    var loading=document.getElementById("loading");
    if(gd&&loading)
    {
        //gd.removeChild(loading);
        loading.hidden=true;
		clearTimeout(intid);
        console.log("removeLoading 1");
    }
}

var parseParams=function()
{
    var ps=[];
    var params
    if(window.location.search.startsWith('?'))
        params=window.location.search.substr(1).split("&");
    else
        params=window.location.search.substr(0).split("&");
    for(var i=0;i<params.length;i++)
    {
        var nv=params[i].split("=");
        ps.push(nv);
    }
    ps.sort((a,b)=>{

        return a[0].localeCompare(b[0]);
    });
    return ps;
}
var query=function(pname)
{
    let params=parseParams();
    for(let i=0;i<params.length;i++)
    {
        if(params[i][0]==pname)//puzzle
        {
            if(params[i][1].length>0)
            {
                let num=Number.parseInt(params[i][1]);
                return num;
            }
        }
    }
    return 0;
}

var toData=function(datastr)
{
    var arrData = new Uint16Array(datastr.length);
    for (var i = 0; i < datastr.length; i++) {
        arrData[i] = datastr.charCodeAt(i);
    }
    return arrData;
}
var dispSodoku=function(data)
{
    var str="";
    str="<table border='1'>";
    var a=data.split('.');
    let n=Math.sqrt(a[0].length);
    for(var i=0;i<n;i++)
    {
        str+="<tr>";
        for(var j=0;j<n;j++)
        {
            str+="<td>"+a[0][i*n+j]+"</td>";
        }
        str+="</tr>";
    }
    str+="</table>";
    return str;
}
var ctx;
var canvas;
var size=50;
var optionnum=13;
var puz=""    
//var offsetx=1.4;
//var offsety=1.4;    
var offsetx=0.02;
var offsety=0.02;
var offunx=0.1;
var offuny=0.1;
var num=7;
var cells=[]; 
var funs=[];
var gblock="";
var gpuzzle="";
var ganswer="";
var selectcell=null;
var blocks=[];    
var isLans=false;
var tick=0;
function adaptsize(awidth,aheight)
{
    let mins=awidth;
    let maxs=awidth;
    if(mins>aheight) mins=aheight;
    if(maxs<aheight) maxs=aheight;
    isLans=false;
    if(awidth>=aheight) isLans=true;
    let diff=maxs-mins;        
    let bordernb=1+offsetx+offunx;
    let borderna=bordernb;
    size=Math.floor(mins/(num+borderna));      
    let margin=2;
    //if(diff>=(size*bordernb))
    if(diff>=(size))
    {        
        if(isLans)
        {
            canvas.width=size*(num+bordernb)+margin;
            canvas.height=size*(num+borderna)+margin;
        }else
        {
            canvas.width=size*(num+borderna)+margin;//-8;
            canvas.height=size*(num+bordernb)+margin;
        }                   
    }else
    {   
        //size=Math.floor((maxs-size*bordernb)/(num+borderna));              
        if(isLans)
        {                
            canvas.width=size*(num+bordernb)+margin;
            canvas.height=size*(num+borderna)+margin;
        }
        else
        {
            canvas.width=size*(num+borderna)+margin;//-8;
            canvas.height=size*(num+bordernb)+margin;
        }
    }
    
    if(canvas.width>awidth) canvas.width=awidth;
    if(canvas.height>aheight) canvas.width=aheight;
}
var appendBolds=function(bolds,line)
{
    ctx.moveTo(line[0],line[1]);
    ctx.lineTo(line[2],line[3]);
    for(var i=0;i<bolds.length;i++)
    {
        if(bolds[i][0]-line[0]<0.0000001
            &&bolds[i][1]-line[1]<0.0000001
            &&bolds[i][2]-line[2]<0.0000001
            &&bolds[i][3]-line[3]<0.0000001)
            {
                bolds.push(line);
                return true;
            }
    }
    return false;
}
var drawLoading=function()
{
    ctx.lineWidth=1*canvas.height/1000;  
    ctx.font = size/5*Math.sqrt(num)/2+"px serif";
    //ctx.font="italic 35px 黑体";  
    ctx.strokeStyle="#000099";
    ctx.fillStyle="red";        
    ctx.textAlign="center";
    ctx.textBaseline="middle";        
    ctx.beginPath();
    var width=211*size/150*Math.sqrt(num);
    var height=99*size/150*Math.sqrt(num);
    var offset=canvas.width/2-width/2;
    ctx.moveTo(0+offset,0+offset);
    ctx.lineTo(width+offset,0+offset);        
    ctx.lineTo(width+offset,height+offset);        
    ctx.lineTo(0+offset,height+offset);        
    ctx.lineTo(0+offset,0+offset);   
    var fh=size/5/2;
    ctx.fillText(1,width/2+offset,0+offset+fh);
    ctx.fillText(2,width+offset-fh,height/2+offset);
    ctx.fillText(3,width/2+offset,height+offset-fh);        
    ctx.fillText(4,0+offset+fh,height/2+offset);
    var idx=Math.floor(Math.random()*2);
    var tips=['Loading Fight...','拼命加载中...'];
    ctx.fillText(tips[idx],width/2+offset,height/2+offset);
    ctx.closePath();
    ctx.stroke();
    //ctx.fill();
}
var qryCode=function(val)
{
    var str="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@";
    return str[val];
}
var qryFuns=function(val)
{
    var str="00000000000000000000000000000000000000000000000000000000000新清@";
    return str[str.length-val-2];
}
var drawKodoku=function(puzzle,block)
{        
    gblock=block;
    gpuzzle=puzzle;
    ctx.lineWidth=1*canvas.height/1000;        
    var a=puzzle.split('.');
    num=Math.sqrt(a[0].length);
    puz=a[0];
    ctx.font = size/2+"px serif";
    //ctx.font="italic 35px 黑体";  
    ctx.strokeStyle="#000099";
    ctx.fillStyle="red";
    ctx.textAlign="center";
    ctx.textBaseline="middle";        
    ctx.beginPath();
    cells=[];
    for(var i=0;i<num;i++)
    {
        cells.push([]);
        for(var j=0;j<num;j++)
        {
            var val=a[0][i*num+j];
            var bid=block[i*num+j];                
            ctx.moveTo((i+offsetx)*size,(j+offsety)*size);
            ctx.lineTo((i+offsetx)*size,(j+1+offsety)*size);                
            ctx.lineTo((i+1+offsetx)*size,(j+1+offsety)*size);
            ctx.lineTo((i+1+offsetx)*size,(j+offsety)*size);
            ctx.lineTo((i+offsetx)*size,(j+offsety)*size);                                
            if(val!='0'){
                ctx.fillText(val,(i+0.5+offsetx)*size,(j+0.5+offsety)*size);
            }
            //左下右上
            var b={minx:(i+offsetx)*size,miny:(j+offsety)*size,maxx:(i+1+offsetx)*size,maxy:(j+1+offsety)*size,value:val,bi:bid
                ,lines:[[(i+offsetx)*size,(j+offsety)*size,(i+offsetx)*size,(j+1+offsety)*size]
                    ,[(i+offsetx)*size,(j+1+offsety)*size,(i+1+offsetx)*size,(j+1+offsety)*size]
                    ,[(i+1+offsetx)*size,(j+1+offsety)*size,(i+1+offsetx)*size,(j+offsety)*size]
                    ,[(i+1+offsetx)*size,(j+offsety)*size,(i+offsetx)*size,(j+offsety)*size]],user:false,x:i,y:j};
            cells[i].push(b);
        }
    }                        
    ctx.closePath();  
           
    ctx.stroke();  
    
    strokeFuns();
    storkeAlien(block);
}    

function strokeFuns()
{
    funs=[];
    funs.push([]);
    ctx.beginPath();
    ctx.lineWidth=3*canvas.height/1000;
	ctx.font = size/2+"px serif";
    ctx.fillStyle="red";
    ctx.textAlign="center";
    let hpy=num+offsety+offuny; 
    let hpx=offsetx; 
    funs.push([]);        
    for(var i=0;i<num;i++)//bottom
    {
        ctx.moveTo((hpx+i)*size,(hpy)*size);
        ctx.lineTo((hpx+i)*size,(hpy+1)*size);
        ctx.lineTo((hpx+i+1)*size,(hpy+1)*size);
        ctx.lineTo((hpx+i+1)*size,(hpy)*size);
        ctx.lineTo((hpx+i)*size,(hpy)*size);  
        ctx.fillText(qryCode(i+1),(hpx+i+0.5)*size,(hpy+0.5)*size);
        var c={minx:(hpx+i)*size,miny:(hpy)*size,maxx:(hpx+i+1)*size,maxy:(hpy+1)*size,value:qryCode(i+1)};
        funs[funs.length-1].push(c);            
    }
    hpx=num+offsetx+offunx;
    hpy=offsety;
    funs.push([]);
    for(var i=0;i<num;i++)//right
    {
        ctx.moveTo((hpx)*size,(hpy+i)*size);
        ctx.lineTo((hpx)*size,(hpy+1+i)*size);
        ctx.lineTo((hpx+1)*size,(hpy+1+i)*size);
        ctx.lineTo((hpx+1)*size,(hpy+i)*size);
        ctx.lineTo((hpx)*size,(hpy+i)*size);  
        
        ctx.fillText(qryFuns(i),(hpx+0.5)*size,(hpy+i+0.5)*size);            
        var c={minx:(hpx)*size,miny:(hpy+i)*size,maxx:(hpx+1)*size,maxy:(hpy+i+1)*size,value:qryFuns(i)};
        //ctx.fillText(qryCode(i+1),(hpx+0.5)*size,(hpy+i+0.5)*size);            
        //var c={minx:(hpx)*size,miny:(hpy+i)*size,maxx:(hpx+1)*size,maxy:(hpy+i+1)*size,value:qryCode(i+1)};
        funs[funs.length-1].push(c);
    }    
    
    //corner        
    hpy+=offuny+num;
    ctx.moveTo((hpx)*size,(hpy)*size);
    ctx.lineTo((hpx)*size,(hpy+1)*size);
    ctx.lineTo((hpx+1)*size,(hpy+1)*size);
    ctx.lineTo((hpx+1)*size,(hpy)*size);
    ctx.lineTo((hpx)*size,(hpy)*size);      
    ctx.fillText('0',(hpx+0.5)*size,(hpy+0.5)*size);            
    var c={minx:(hpx)*size,miny:(hpy)*size,maxx:(hpx+1)*size,maxy:(hpy+1)*size,value:'0'};
    funs[funs.length-1].push(c);
    
    /*                 
    hpy=offuny;
    hpx=offsetx;        
    for(var i=0;i<num;i++)//top
    {
        ctx.moveTo((hpx+i)*size,(hpy)*size);
        ctx.lineTo((hpx+i)*size,(hpy+1)*size);
        ctx.lineTo((hpx+i+1)*size,(hpy+1)*size);
        ctx.lineTo((hpx+i+1)*size,(hpy)*size);
        ctx.lineTo((hpx+i)*size,(hpy)*size);  
        var c={minx:(hpx+i)*size,miny:(hpy)*size,maxx:(hpx+i+1)*size,maxy:(hpy+1)*size,value:''};
        funs[funs.length-1].push(c);
    }              
    
    hpy=offsety;
    hpx=offunx;
    funs.push([]);
    for(var i=0;i<num;i++)//left
    {
        ctx.moveTo((hpx)*size,(hpy+i)*size);
        ctx.lineTo((hpx)*size,(hpy+i+1)*size);
        ctx.lineTo((hpx+1)*size,(hpy+i+1)*size);
        ctx.lineTo((hpx+1)*size,(hpy+i)*size);
        ctx.lineTo((hpx)*size,(hpy+i)*size); 
        var c={minx:(hpx)*size,miny:(hpy+i)*size,maxx:(hpx+1)*size,maxy:(hpy+i+1)*size,value:0};
        funs[funs.length-1].push(c);            
    }
    */            
    ctx.closePath();        
    ctx.stroke();
    
    ctx.fillStyle="#00ffff";
    let si=Math.floor(30*canvas.height/1000);
    let clamp=si;
    if(si<10) si=10;
    if(si>30) si=30;
    ctx.font = si+"px serif";
    let dat=new Date();
    let timetxt=fmtStr(dat.getFullYear(),4)+"/"+fmtStr((dat.getMonth()+1),2)+"/"+fmtStr(dat.getDate(),2)
        +" "+fmtStr(dat.getHours(),2)+":"+fmtStr(dat.getMinutes(),2)+":"+fmtStr(dat.getSeconds(),2)+":"
        +fmtStr(dat.getMilliseconds(),2);
    ctx.textAlign="start";    
    if(clamp>20) clamp=20;
    let m=ctx.measureText(timetxt)
    let h=canvas.height-m.fontBoundingBoxDescent*1.2;
    ctx.fillText(timetxt,m.fontBoundingBoxDescent*0.5,h);
    ctx.stroke();
}

function storkeAlien(block)
{
    var bolds=[];
    ctx.lineWidth=7*canvas.height/1000;
    //ctx.lineStyle="red";
    ctx.beginPath();        
    for(var i=0;i<num;i++)
    {                
        for(var j=0;j<num;j++)
        {                    
            var idx=i*num+j;
            if(i<num-1)
            {
                var idx1=(i+1)*num+j;
                if(block[idx]!=block[idx1])
                {                            
                    appendBolds(bolds,cells[i][j].lines[2]);                        
                }
            }
            if(j<num-1)
            {
                var idx2=(i*num)+j+1;
                if(block[idx]!=block[idx2])
                {                            
                    appendBolds(bolds,cells[i][j].lines[1]);
                }
            }                    
            if(i==0)
            {
                appendBolds(bolds,cells[i][j].lines[0]);
            }
            if(j==0)
            {
                appendBolds(bolds,cells[i][j].lines[3]);                        
            }
            if(i==num-1)
            {
                appendBolds(bolds,cells[i][j].lines[2]);
            }
            if(j==num-1)
            {
                appendBolds(bolds,cells[i][j].lines[1]);
            }
        }
    }               
    ctx.closePath();        
    ctx.stroke();
}
function drawFillCell(cell,color="green")
{
    var path=new Path2D();
    ctx.lineWidth=1*canvas.height/1000;
    path.moveTo(cell.lines[0][0],cell.lines[0][1]);
    path.lineTo(cell.lines[0][2],cell.lines[0][3]);
    path.lineTo(cell.lines[1][2],cell.lines[1][3]);
    path.lineTo(cell.lines[2][2],cell.lines[2][3]);
    path.lineTo(cell.lines[3][2],cell.lines[3][3]);
    path.closePath();        
    ctx.fillStyle=color;        
    ctx.fill(path);
    ctx.stroke(path);        
}
function drawPathCell(cell)
{
    var path=new Path2D();  
    ctx.lineWidth=1*canvas.height/1000;
    path.moveTo(cell.lines[0][0],cell.lines[0][1]);
    path.lineTo(cell.lines[0][2],cell.lines[0][3]);
    path.lineTo(cell.lines[1][2],cell.lines[1][3]);
    path.lineTo(cell.lines[2][2],cell.lines[2][3]);
    path.lineTo(cell.lines[3][2],cell.lines[3][3]);
    path.closePath();        
    ctx.strokeStyle="blue";        
    ctx.stroke(path);        
}       
function fillTexts(isStroke=false)
{        
    for(let i=0;i<num;i++)
    {
        for(let j=0;j<num;j++)
        {
            if(cells[i][j].value>0)
            {
                fillText(cells[i][j]);
            }
        }
    }        
}    
function fillText(cell,isStroke=false)
{
    ctx.beginPath();
    if(isStroke||cell.user)
        ctx.fillStyle="#00ffff";
    else
        ctx.fillStyle="red";
    ctx.font = size/2+"px serif";
    ctx.strokeStyle="blue"; 
    ctx.textAlign="center";
    if(cell.value>0)
    {
        if(isStroke||cell.user)
        {
            ctx.fillText(cell.value,cell.lines[0][0]+0.5*size,cell.lines[0][1]+0.5*size);
            ctx.strokeText(cell.value,cell.lines[0][0]+0.5*size,cell.lines[0][1]+0.5*size);
        }
        else
            ctx.fillText(cell.value,cell.lines[0][0]+0.5*size,cell.lines[0][1]+0.5*size);
    }
    ctx.closePath();
    ctx.stroke();
}
function drawSelect(cx,cy)
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let hid=cells[cx][cy].bi;        
    for(let i=0;i<num;i++)
    {
        for(let j=0;j<num;j++)
        {
            if(i==cx)
            {
                drawFillCell(cells[i][j]);
            }
            if(j==cy)
            {
                drawFillCell(cells[i][j]);
            }
            if(hid==cells[i][j].bi)
            {                    
                drawFillCell(cells[i][j]);
            }
            else
            {
                drawPathCell(cells[i][j]);
            }
            
        }
    }
    drawFillCell(cells[cx][cy],"yellow");
    storkeAlien(gblock);
    strokeFuns();
    fillTexts();
}
function amouseout(e)
{
    //console.log(e);
}
function amouseover(e)
{
    //console.log(e);
}
function adrop(e)
{
    console.log(e);
}
function adragenter(e)
{
    console.log(e);
}
function apaste(e)
{
    console.log(e);
}
function akeydown(e)
{
    console.log(e);
}
function akeyup(e)
{
    console.log(e);
}    
function qryHitCells(posx,posy)
{
    for(var i=0;i<num;i++)
    {
        for(var j=0;j<num;j++)
        {
            if(posx>cells[i][j].minx&&posx<cells[i][j].maxx&&posy<cells[i][j].maxy&&posy>cells[i][j].miny)
            {
                return [0,i,j];
            }
        }
    }
    for(var i=0;i<funs.length;i++)
    {
        for(var j=0;j<funs[i].length;j++)
        {
            if(posx>funs[i][j].minx&&posx<funs[i][j].maxx&&posy<funs[i][j].maxy&&posy>funs[i][j].miny)
            {
                return [1,i,j];
            }
        }
    }
    return [-1,0,0];
}
function getBlock(bi)
{
    for(var i=0;i<blocks.length;i++)
    {
        if(blocks[i].bi==bi)
        {
            return blocks[i];
        }
    }
    return null;
}
function getGroups()
{
    blocks=[];
    for(var i=0;i<gblock.length;i++)
    {
        var x=Math.floor(i/num);
        var y=i%num;
        var blo=getBlock(gblock[i]);
        if(blo!=null)
        {
            blo.cells.push(cells[x][y]);
        }
        else
        {                
            var group={bi:gblock[i],cells:[]};
            blocks.push(group);
            group.cells.push(cells[x][y]);
        }
    }
    return blocks;
}
function bigger(i,j,val)
{
    if(parseInt(cells[i][j].value)>val)
    {
        return true;
    }
    return false;
}
function checkSuccess()
{        
    var ret=true,ret1=true,ret2=true;
    var vals=[],vals1=[],vals2=[];
    var unsuccs=[];
    for(var i=0;i<num;i++)
    {            
        vals=[];
        //floor
        for(var j=0;j<num;j++)
        {
            if(vals.indexOf(cells[i][j].value)>=0)
            {
                ret=false;
                unsuccs.push({x:i,y:j,value:cells[i][j].value});
                break;
            }
            if(bigger(i,j,0))
            {
                vals.push(cells[i][j].value);                
            }
        }
        if(!ret||vals.length<num) break;
        if(ret&&vals.length==num)
        {            
            vals1=[];
            //tower
            for(var j=0;j<num;j++)
            {
                if(vals1.indexOf(cells[j][i].value)>=0)
                {
                    ret1=false;
                    unsuccs.push({x:i,y:j,value:cells[i][j].value});
                    break;
                }
                if(bigger(i,j,0))
                {
                    vals1.push(cells[j][i].value);   
                }
            }
            if(!ret1||vals1.length<num) break;
        }
    }        
    if(ret1&&ret&&vals.length==num&&vals1.length==num)
    {
        getGroups();
        for(var i=0;i<blocks.length;i++)
        {
            vals2=[];
            for(var j=0;j<blocks[i].cells.length;j++)
            {
                if(vals2.indexOf(blocks[i].cells[j].value)>=0)
                {
                    ret2=false;
                    unsuccs.push({x:i,y:j,value:cells[i][j].value});
                    break;
                }
                if(parseInt(blocks[i].cells[j].value)>0)
                {
                    vals2.push(blocks[i].cells[j].value);
                }
            }
            if(!ret2||vals2.length<num)
            {
                break;
            }
        }            
    }
    if(ret&&ret1&&ret2&&vals.length==num&&vals1.length==num&&vals2.length==num){
        isCheck=true;
        console.log("checkSuccess");
    }
    return ret&&ret1&&ret2&&vals.length==num&&vals1.length==num&&vals2.length==num;
}
function checkAnswer()
{
    var ret=true;
    for(var i=0;i<cells.length;i++)
    {
        for(var j=0;j<cells[i].length;j++)
        {
            if(parseInt(cells[i][j].value)!=parseInt(ganswer[i*num+j]))
            {
                ret=false;
                break;
            }
        }
        if(!ret) break;
    }
    if(ret){
        isCheck=true;
        console.log('checkAnswer');
    }
    return ret;
}
function reStart()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    document.getElementById("subject").innerText="";
    var puzinfo=document.getElementById("puzinfo");
    var span=document.getElementById("span");
    var select=document.getElementById("select");
    puzinfo.removeChild(span);            
    puzinfo.removeChild(select);
    drawLoading();
    setTimeout(function(){            
        sockeRequect(num);
    },1000);        
}
var isCheck=false;
setInterval(function(){
    if(!isCheck&&(checkAnswer()||checkSuccess()))
    {      
        isCheck=true;
        reStart();
    }
},3000);
function amousedown(e)
{
    //PointerEvent,鼠标，手指触摸，触摸笔，多点触控，压感
    //MouseEvent，鼠标
    //TouchEvent，移动
    
    //通过style会被拉伸
            
    //console.log(e,canvas);        
            
    var posx=e.pageX-canvas.offsetLeft;
    var posy=e.pageY-canvas.offsetTop;        
    //console.log(cells[0][0],cells[6][6],posx,posy);
    //console.log(posx,posy,window);
    var hits=qryHitCells(posx,posy);
    if(hits[0]==0)
    {
        //console.log(puz[hits[1]*num+hits[2]]);
        drawSelect(hits[1],hits[2]);
        selectcell=cells[hits[1]][hits[2]];                       
    }
    else if(hits[0]==1)
    {
        //console.log(funs[hits[1]][hits[2]].value);
        if(selectcell&&funs[hits[1]][hits[2]].value<num+1)
        {
            var val=parseInt(funs[hits[1]][hits[2]].value);
            if(parseInt(selectcell.value)>0&&selectcell.user)
            {
                selectcell.value=funs[hits[1]][hits[2]].value;
                selectcell.user=true;
                //fillText(selectcell,true);
                drawSelect(selectcell.x,selectcell.y);
                //fillTexts();
            }else if(parseInt(selectcell.value)==0)
            {
                selectcell.value=funs[hits[1]][hits[2]].value;
                selectcell.user=true;
                //fillText(selectcell,true);
                drawSelect(selectcell.x,selectcell.y);
            }        
        }
        else if(funs[hits[1]][hits[2]].value=='清')
        {
            for(var i=0;i<cells.length;i++)
            {
                for(var j=0;j<cells[i].length;j++)
                {
                    if(cells[i][j].user)
                    {
                        cells[i][j].value=0;
                    }
                }
            }
            drawSelect(selectcell.x,selectcell.y);
        }
        else if(funs[hits[1]][hits[2]].value=='新')
        {
            reStart();
        }
        else if(funs[hits[1]][hits[2]].value==num+1)
        {
            if(checkAnswer())
            {                                       
                reStart();
            }
        }
    }        
    /*
    ctx.beginPath();        
    ctx.moveTo(posx,posy);
    ctx.lineTo(posx,posy+0.3*size);
    ctx.lineTo(0.3*size+posx,posy+0.3*size);
    ctx.lineTo(0.3*size+posx,posy);
    ctx.lineTo(posx,posy);        
    ctx.closePath();        
    ctx.stroke();
    */
}
function amousemove(e)
{
    //console.log(e);
}
function amouseup(e)
{
    //console.log(e);
}
function awheel(e)
{
    console.log(e);
}   
function fmtStr(val,len)
{
    var l=(val+"").length;
    if(l<len)
    {
        for(i=l;i<len;i++)
        {
            val="0"+val;
        }
    }
    return val;
}
function startTimer()
{
    let uset=Date.now()-tick;
        
    let dat=new Date();        
    let timetxt=
        //dat.getFullYear()+"/"+fmtStr((dat.getMonth()+1),2)+"/"+fmtStr(dat.getDate(),2)+" "+
        fmtStr(dat.getHours(),2)+":"+fmtStr(dat.getMinutes(),2)+":"+fmtStr(dat.getSeconds(),2)
        +":"+fmtStr(dat.getMilliseconds(),3);    
    let minis=uset%1000;
    let second=Math.floor(uset/1000);
    let minute=Math.floor(second/60);
    let hour=Math.floor(minute/60);
    let spand=fmtStr(hour,3)+":"+fmtStr(minute%60,2)+":"+fmtStr(second%60,2);
    var span=document.getElementById("span");    
    if(span) span.innerHTML=timetxt+"-----"+spand;
    setTimeout(function(){
        startTimer();
    },200);
}
function sockeRequect(num)
{        
    var addr="ws://www.5icoin.com:9818";
    if(window.location.href.startsWith("https://"))
        addr="wss://www.5icoin.com:9817";
    let socket=new WebSocket(addr); 
    socket.binaryType = "arraybuffer";
    //new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
    tick=Date.now();
    startTimer();
    socket.onopen = function(evt) {
        var str="rubric:num:"+num+":0";
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
        var subj=document.getElementById("subject");
        //subj.style="font-size:xxx-small";
        subj.innerText=subject[3]+"\n"+subject[1]+"\n"+subject[5];	
        ganswer=subject[1];
        gpuzzle=subject[3];
        gblock=subject[5]; 
        removeLoading();
        initSelect();
        ctx.clearRect(0,0,canvas.width,canvas.height);            
        drawKodoku(subject[3],subject[5]);
        isCheck=false;		
        console.log("recv:"+str.length);
        socket.close();            
    };
    socket.onerror = function(evt) {
        socket.close();
    };
    socket.onclose = function(evt) {
        socket.close();
    };
}

var addSelects=function(select,num)
{
    var sel="<select id='select'>"
    if(num>=optionnum)num=optionnum-1;
    for(var i=2;i<optionnum;i++)
    {        
        if(i==num)
            sel+="<option value="+i+" selected='selected'>Size="+i+"</option>"    
        else
            sel+="<option value="+i+">Size="+i+"</option>"
    }
    sel+="<option value=99>Size=99</option>"
    sel+="</select>"
    select.innerHTML=sel;
}

window.onresize=function(e)
{
    //console.log(e.currentTarget.innerWidth,e.currentTarget.innerHeight,e.srcElement.innerWidth
    //,e.srcElement.innerHeight,e.target.innerWidth,e.target.innerHeight,window);
    //canvas.width=e.target.innerWidth;
    //canvas.height=e.target.innerHeight;
    adaptsize(e.currentTarget.innerWidth,e.currentTarget.innerHeight*0.9);
    ctx.clearRect(0,0,canvas.width,canvas.height);                        
    drawKodoku(gpuzzle,gblock);
    isCheck=false;
}
function refresh()
{
    //todo:刷新无法画Loading
    const oldWidth = canvas.current.width;
    const oldHeight = canvas.current.height;
    // 先隐藏canvas
    canvas.current.style.display = 'none';
    const ctx = canvas.current.getContext('2d');
    // 保存canvas设置，清楚画布区域
    ctx?.save();
    ctx?.setTransform(1, 0, 0, 1, 0, 0);
    ctx?.clearRect(0, 0, oldWidth, oldHeight);
    // 还原canvas设置
    ctx?.restore();
    canvas.current.style.display = '';
}
function initSelect()
{
    var span=document.createElement('span');
    span.innerText="Change Size of Sudoku:";
    var select=document.createElement('select'); 
    select.id="select";
    span.id="span";
    var puzinfo=document.getElementById("puzinfo");
    select.style="font-size:x-large";
    //addSelects(select,7);        
    select.addEventListener("change",(e)=>{
        isCheck=true;
        console.log(select.value);
        document.getElementById("subject").innerText="";            
        //ctx.clearRect(0,0,canvas.width,canvas.height);
        num=parseInt(select.value);
        sockeRequect(num); 
        if(num==99) num=9;            
        showLoading();
        adaptsize(window.visualViewport.width,window.visualViewport.height*0.9);                     
        puzinfo.removeChild(span);            
        puzinfo.removeChild(select);
        drawLoading();
    });        
    var subj=document.getElementById("subject");        
    //subj.style="font-size:xxx-small";
    puzinfo.insertBefore(span,subj);
    puzinfo.insertBefore(select,subj);
    addSelects(select,num);         
}
function initKodo()
{                
    canvas.onselectstart = function (e) { return false; };		//for Chrome, disable text select while dragging        
    canvas.addEventListener('drop', adrop, false);
    canvas.addEventListener('dragenter', adragenter, false);

    // Key Listeners
    canvas.addEventListener('paste', apaste, false);
    canvas.addEventListener('keydown', akeydown, false);
    canvas.addEventListener('keyup', akeyup, false);
    
    // Mouse Interaction Listeners
    canvas.addEventListener('mouseout', amouseout, false);
    canvas.addEventListener('mouseover', amouseover, false);        
    canvas.addEventListener('mousedown', amousedown, false);
    canvas.addEventListener('mousemove', amousemove, false);
    canvas.addEventListener('mouseup', amouseup, false);
    canvas.addEventListener('wheel', awheel, false);
    
    canvas.addEventListener('pointerdown', (e)=>{ 
    
    }, false);
    canvas.addEventListener('pointermove',  (e)=>{ 
    
    }, false);        
    canvas.addEventListener('pointerup',  (e)=>{ 
    
    }, false);
    canvas.addEventListener('pointerleave', (e)=>{ 
    
    }, false);
    canvas.addEventListener('pointercancel', (e)=>{ 
    
    }, false);        
    
    canvas.addEventListener('mouseleave', (e)=>{ 
    
    }, false);
    
    canvas.addEventListener('touchstart', (e)=>{ 
    
    }, false);        
    canvas.addEventListener('touchmove', (e)=>{ 
    
    }, false);
    canvas.addEventListener('touchend', (e)=>{ 
    
    }, false);
    canvas.addEventListener('touchcancel', (e)=>{ 
    
    }, false);
    
    canvas.addEventListener('onresize', (e)=>{ 
        
    }, false);
                                         
    adaptsize(window.visualViewport.width,window.visualViewport.height*0.9);
    var alien=query("alien");
    sockeRequect(num);    
}

window.onload=function()
{        
    num=query("num")
    if(num<2)num=7;
    
    canvas=document.getElementById("sudoku");
    document.body.style="margin:0";
    ctx=canvas.getContext("2d"); 
    
    adaptsize(window.visualViewport.width,window.visualViewport.height*0.9);        
    drawLoading();
    
    setTimeout(function(){
        initKodo();
    },300);        
}