/* doudoubuild commander component
 * To use add require('../cmds/doudoubuild.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

module.exports = function(program) {

	program
		.command('build2 <gamesArray> [option]')
		.version('0.0.1')
		.description('build doudougames')
		.action(function (/* Args here */) {
			// Your code goes here
		});

};
