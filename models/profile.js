'use strict';


module.exports = function ProfileModel() {

	// ProfileModel.prototype = BaseModel();
	// FIXME : data & messages object shoudl come from Base model

    return {
        name: 'profile',
        data: {}
        // messages: {
        // 	desc: {},
        // 	status: 'SUCCESS'
        // }
    };
};