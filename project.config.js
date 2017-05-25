module.exports = {

	reportsPaths: {
		// Base
		// the base of the directory where the reports will go
		// relative to package.json

		// the different type of reports that will be generated
		// other attributes will be programatically generated 
		// in the preprocess stage below
		types: {
			
			eslint: {
				formats: ['html']
			},
			// required
			unitTest: {
				// dir: folder name
				// filename: name of each file
				formats: ['html'], //types of reports
				// rocketchat: options for sending msg to rocketchat 
				// 	   data: format of the data you'll handle
				// 	   proccessor: function to process the data
			}
		},

		
	},

	eslint: {
		// relative to package.json
		// pathToApp
		// files
	},

	karma: {
		//base; relative to karma.config.js
		//files; relative to base
	},

	rocketchatChannel: "jenkins-test"
}