# Waves Client Code (Based off of Mathnet's Client Code)

## Setup

1. Make sure the Nodejs communication server is running.
2. Change the host variable in the file www/mathnet/js/host.js to the url for the Node js server.
3. Make sure in the file www/js/main.js on line 5, the URL for the socketio library points to the correct location which is the Nodejs Server's path.
4. Also make sure the path is correctly defined on line 6 of the file www/js/network/WSSession.js to point to the Nodejs Server.

## Usage

### www/admin.html
1. Using this page manage the creation and deletion of groups in class.

### www/student.html 
1. View student.html to login as a student
2. Enter the class id (Available on the admin tab of admin.html) and student name 
3. The list of groups available in the class will be displayed.  Click a group to join.
4. The Waves app will then load.