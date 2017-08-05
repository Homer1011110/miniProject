class Promise {
    constructor(cb) {
        let self = this
        self.STATE_PENDING = 0
        self.STATE_FULFILLED = 1
        self.STATE_REJECTED = 2

        self.state = self.STATE_PENDING
        self.successCBs = []
        self.failCBs = []

        cb.call(null, function(msg) {
            self.resolve(msg)
        }, function(err) {
            self.reject(err)
        })

    }

    then(successCB, failCB) {
        let self = this
        successCB && self.successCBs.push(successCB)
        failCB && self.failCBs.push(failCB)
        return self
    }

    resolve(msg) {
        let self = this
        self.state = self.STATE_FULFILLED

        self.successCBs.forEach(function(cb) {
            cb.call(self, msg)
        })
    }

    reject(err) {
        let self = this
        self.state = self.STATE_REJECTED

        self.failCBs.foreach(function(cb) {
            cb.call(self, err)
        })
    }

}

export default Promise