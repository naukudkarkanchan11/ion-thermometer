const CHUNK_SIZE = 10 * 1024;

class TimeseriesUpload {
    constructor(file) {
        this.file = file;
        this.stringBuffer = [];
        this.startConsuming = false;
        this.fileSize = file.size;
        this.fileName = file.name;
        this.start = 0;
        this.end = Math.min(this.start + CHUNK_SIZE, this.fileSize);
        this.batchSize = 0;
        this.totalCount = 0;
    }

    readfileInChunks() {
        this.batchSize++;
        this.read();
    }

    read() {
        const reader = new FileReader();
        const fileParser = this.fileParser;
        const then = this;
        reader.onload = function () {
            then.fileParser(this.result);
        };
        console.info(`${this.start}, ${this.end}, ${this.batchSize}`);
        const blob = this.file.slice(this.start, this.end);
        reader.readAsText(blob, "ascii");
    }

    async fileParser(result) {
        const postArray = [];
        for (let chunk of result) {
            if (chunk === "{") {
                this.startConsuming = true
            }

            if (this.startConsuming) {
                this.stringBuffer.push(chunk);
            }

            if (chunk === "}") {
                this.startConsuming = false;
                let jsonString = this.stringBuffer.join("");
                try {
                    postArray.push(JSON.parse(jsonString));
                } catch (e) {
                    throw e;
                }
                this.stringBuffer = [];
            }
        }

        await this.saveTimeseries({
            data: postArray,
            fileName: this.fileName,
            bytesReceived: this.end
        });

        let bytesProcessPercentage = (this.end/ this.fileSize) * 100;
        this.totalCount += postArray.length;
        showProgress(Math.min(bytesProcessPercentage, 100), this.fileSize, Math.min(this.end, this.fileSize), this.totalCount);
        this.start = this.end;
        this.end = Math.min(this.start + CHUNK_SIZE, this.fileSize + 1);

        if (this.start !== this.fileSize + 1) {
            this.readfileInChunks();
        }else{
            console.info(`END COUNT ==> ${this.totalCount} TOTAL BATCHES ==> ${this.batchSize}`);
        }
    }

    async saveTimeseries(data) {
        return fetch("http://localhost:8080/timeseries", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow', 
            body: JSON.stringify(data), 
        })
            .then(response => true)
            .catch(err => console.log(err))
    }


}