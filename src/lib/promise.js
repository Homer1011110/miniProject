class Promise {
    constructor(cb) {
        let self = this
        self.STATE_CREATED = 0
        self.STATE_PENDING = 1
        self.STATE_FULFILLED = 2
        self.STATE_REJECTED = 3

        self._state = self.STATE_CREATED
        self.successCB = null
        self.failCB = null

        if(cb) {
            cb && cb.call(null, function(msg) {
                self.resolve(msg)
            }, function(err) {
                self.reject(err)
            })
            self._state = self.STATE_PENDING
        }
    }

    get state() {
        return this._state
    }

    then(successCB, failCB) {
        let self = this
        self.successCB = successCB || null
        self.failCB = failCB || null
        self.nextPromise = new Promise()
        return self.nextPromise
    }

    resolve(msg) {
        let self = this
        self._state = self.STATE_FULFILLED

        if(self.successCB) {
            let result = self.successCB.call(self, msg)
            result instanceof Promise && self.setNextPromise(result)
        }
    }

    reject(err) {
        let self = this
        self._state = self.STATE_REJECTED

        if(self.failCB) {
            let result = self.failCB.call(self, err)
            result instanceof Promise && self.setNextPromise(result)
        }
    }

    setNextPromise(promise) {
        let self = this

        if(!self.nextPromise) {
            return
        }

        promise.successCB = self.nextPromise.successCB || null
        promise.failCB = self.nextPromise.failCB || null
        promise.nextPromise = self.nextPromise || null

        self.nextPromise = promise
    }
}

export default Promise