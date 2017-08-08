const P = require('bluebird');

const moment = require('moment');
const WorkerBase = require('yeedriver-base/WorkerBase');

const printer = require('printer');

const createPdfFromTemplate = require('fx-template-to-pdf-node');

const templatePrinter = class extends WorkerBase{

    initDriver(options,memories){
        this.templateFilepath = options.templateFilepath;
        this.setRunningState(this.RUNNING_STATE.CONNECTED);
        this.setupEvent();
    }

    WriteWQ(wq_mapItem,value,devId){
        let options = {
            templateData: value[wq_mapItem.start],
            templateFilepath: this.templateFilepath,//'/home/fx/carApply.docx',
            documentFilepath: this.templateFilepath+'.bak',
            buffer:true
        };

        return createPdfFromTemplate(options)
            .then((buf)=>{
            return new P((resolve,reject)=>{
                printer.printDirect({
                    data: buf,
                    type: 'PDF',
                    success: resolve,
                    error:reject
                })
            })

        }).catch((e)=>{
            return P.reject(e);
            })

    }

};

new templatePrinter();
