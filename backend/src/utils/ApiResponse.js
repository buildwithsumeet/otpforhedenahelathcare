class ApiResponse {
    constructor(statusCcode,messege = 'sucess', data,success = true) {
this.statusCode = statusCcode;
        this.message = messege;
        this.data = data;
        this.success = statusCcode >= 200 && statusCcode < 300;


    }

}

export default ApiResponse;