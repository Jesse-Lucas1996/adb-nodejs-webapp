const Database = require('simplest.db')
// // this path needs to be something else probably.
export function newDatabase(){
    const dbnew = new Database({
        path: './androidTvDb.db', 
        type: "SQLite",
        name: 'androidTvDb',
        check: false, //uncertain
        cacheType: 0 //uncertain 
    })
    dbnew.clear()
    console.log(dbnew)
}

const db = new Database({
    path: './androidTvDb.db', 
    type: "SQLite",
    name: 'androidTvDb',
})



export function saveIpScanner(options:any) {
    let scanner = {
        "netmask":{
            "id" : options.netmaskId,
            "mask" : options.netmaskMask
        },
        "singleIp":options.singleIp,
        "range":{
            "to":options.rangeTo,
            "from":options.rangeFrom
        }
    }
    db.set("IpScanners.".concat(options.scannerId),scanner)
}

export function saveDeviceState(serialNo: string, ipState: boolean){
    db.set("DeviceStates.".concat(serialNo),{"state":ipState})
    console.log(db)
}

export function saveABDList(){

}

export function saveMasterIpConfig(ipArray : string[]){
    db.set("MasterIpConfig",ipArray)
}

export function saveLoginCreds(deviceId:string,username:string,password:string){
    db.set("DeviceLogins.".concat(deviceId),{"username":username,"password":password})
    console.log(db)
}


saveDeviceState("testSerialNo",false)
