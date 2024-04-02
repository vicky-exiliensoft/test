/**
 * @access  private
 * @argument  {String} util - The utility to load.
 * @constant  {Object} path - Node's built-in `path` module.
 * @borrows   {module:utils/file.File} File as File
 * @author     vicky <SCCS.com>
 * @description The code define for using the error code
 * @update      2014/8/6
 * Error status codes and messages.
 * Contains commonly used HTTP error status codes and their corresponding messages.
 */

const errorStatus ={
    INTERNAL_SERVER_ERROR:{
        code : 500,
        message: 'Internal server error'
    },
    BAD_REQUEST:{
        code: 400,
        message: 'Bad request'
    },
    UNAUTHORIZED:{
        code:401,
        message: 'Unauthorized'
    },
    NOT_FOUND:{
        code: 404,
        message: 'Not found'
    },
    FORBIDDEN:{
        code : 403,
        message: 'Forbidden'
    },
    METHOD_NOT_ALLOWED:{
        code : 405,
        message: 'Method not allowed'
    }
}
module.exports = errorStatus;