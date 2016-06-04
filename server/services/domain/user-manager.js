'use strict';

export default (userProvider) => {
	
	return {
		addUser: (userData) => {
			userProvider.save(userData);	
		}
	}
	
};