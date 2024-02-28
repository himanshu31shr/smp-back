const { RespondSuccess } = require("../abstract/response");

module.exports = {
    get: function(req, res, next) {
        try {
            return new RespondSuccess(req.user).pipe(res);
        } catch(err) {
            next(err);
        }
    },
    post: function(req,res, next) {
        
    },
    put:  function (req, res, next){

    }
}