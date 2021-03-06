"use strict";


/**
 * @function escapeStr
 * @param {string} str the string to be escaped
 * @description to escape user inputted strings to prevent injection attacks
 */
function escapeStr(str) {
    if (str)
        return str.replace(/([ #;?%&,.+*~\':"!^$[\]()=><|\/@])/g,'\\$1');      

    return str;
}

/**
 * @function server_error
 * @param {string} error the error to output on the page
 * @description to handle errors sent by the server
 */
function server_error(error) {
    if(error != "Duplicate Entry")
        $error_frame.html(JSON.stringify(error)); 
    else {


        //$class_input.css("border-color", "red");
        //$error_class_input.show();
    }
}

/**
 * function ping response
 * checks time and update ping
 */
 function ping_response(time) {
    var d = new Date();
    //console.log(d.getTime() - time)
    $('.ping').html("Ping: " + (d.getTime() - time).toString());
 }


/**
 * @function add_class_response
 * @param {number} class_id the id of the new class
 * @param {string} class_name the name of the new class
 * @param {string} group_count the number of groups in the new class
 * @description creates the starting group svgs for the admin view
 */
function add_class_response(class_id, class_name, group_count) {
    var construction_groups = $(".construction_groups");

    sessionStorage.setItem('admin_class_id', class_id);
    $error_frame.html('');

    $create_view.hide();
    $settings_tab.hide();
    $class_view.show();
   
    $class_name.html(class_name);
    $class_id.html("ID : " + class_id);
    var groups_html = "";
    var lists_html = "";
    var group_number = parseInt(group_count);
    for (var group=1; group < group_number+1; group++) {
        if(group%3 == 0)
            lists_html += "<div class='col-md-2 info_box1 gr"+ group+"'><h3 style = 'text-align: center; color: white;'>Group "+ group + "</h3></div>";
        else if(group%3 == 1 )
            lists_html += "<div class='col-md-2 info_box  gr"+ group+"'><h3 style = 'text-align: center; color: white;'>Group "+ group + "</h3></div>";
        else
            lists_html += "<div class='col-md-2 info_box2 gr"+ group +"'><h3 style = 'text-align: center; color: white;'>Group "+ group + "</h3></div>";
        // $lists.append($("<div class = '"+group+" g'>"+ group +"</div>").attr('id', 'well')); //create new div
        groups_html += "<li>Group " + group;
        groups_html += "<div class='g" + group + "'></div></li>";
        var const_group = $("<option></option>")
        const_group.text("Group " + group);
        const_group.val(group);
        construction_groups.append(const_group);
    }                                                                                                                                                                                                                                                   
    $groups.html(groups_html);
    $lists.html(lists_html);
    
}


/**
 * @function create_admin response
 * @description adds an admin
 */
 function create_admin_response( check ){

    if (check == 0) {
        $new_username.css("border-color", "red");
        $error_new_username.show();
        $error_re_new_password.hide();
        $re_new_password.css("border-color", null);
    }

    else {
        $new_username.val("");
        $new_password.val("");
        $re_new_password.val("");
        $Secret.val("");
        alert("user created");

        $create_user_view.hide();
        $username_password_view.show();

        $error_new_username.hide();
        $new_username.css("border-color", null);
        $error_re_new_password.hide();
        $re_new_password.css("border-color", null);
    }
 }

/**
 * @function change_password response
 * @description tells the user if password was changed
 */
 function change_password_response(success) {
    if (success) {
        $current_password.val("");
        $changed_password.val("");
        $retyped_changed_password.val("");
        alert("Your password has been updated.")
    }
    else {
        $('.error_password_mismatch').hide();
        $changed_password.css('border-color',  '#CCCCCC'); 
        $retyped_changed_password.css('border-color', '#CCCCCC');
        $('.error_password_incorrect').show();
        $current_password.css('border-color',  'red'); 
    }
 }


/**
 * @function add_group_response
 * @description adds a group to the end of the list
 */
function add_group_response() {    
    $error_frame.html('');
    var new_group = "";
    var lists_html = "";
    var group_number = $('.groups > li:last').index() + 2;

    new_group += "<li>Group " + group_number;
    new_group += "<div class='g" + group_number + "'></div></li>";

    if(group_number%3 == 0)
        lists_html += "<div class='col-md-2 info_box1 gr"+ group_number +"'><h3 style = 'text-align: center; color: white;'>Group "+ group_number + "</h3></div>";
    else if(group_number%3 == 1 )
        lists_html += "<div class='col-md-2 info_box  gr"+ group_number +"'><h3 style = 'text-align: center; color: white;'>Group "+ group_number + "</h3></div>";
    else
        lists_html += "<div class='col-md-2 info_box2 gr"+ group_number +"'><h3 style = 'text-align: center; color: white;'>Group "+ group_number + "</h3></div>";
    $groups.append(new_group);
    $lists.append(lists_html);
}

/**
 * @function delete_group_response
 * @description deletes the last group from the list
 */
function delete_group_response() {
    $error_frame.html('');
    var group_number = $('.groups > li:last').index() + 1;
    $('.groups > li:last').remove(); 
    $('.g'+group_number).remove();
    $('.gr'+group_number).remove();
}

/**
 * @function delete_group_response
 * @description deletes the last group from the list
 */
function delete_class_response(class_id) {
    delete sessionStorage.admin_class_id;
}

/**
 * @function leave_class_response
 * @param {boolean} disconnect whether to delete the session storage
 * @description changes the admin view from a class to the login page
 */
function leave_class_response(disconnect) {
    $error_frame.html('');
    
    $create_view.show();
    $settings_tab.show();
    $class_view.hide();

    $error_class_input.hide();
    $empty_class_input.hide();

    $class_input.css("border-color", null);
    $class_input.val("");
    $group_input.val("");

    if(!disconnect){
        sessionStorage.removeItem('admin_class_id');
    }
    socket.get_classes($secret, localStorage.getItem('admin_id'));
}

/**
 * @function group_info_response
 * @param {string} username username of person being removed from group
 * @param {number} class_id id of class being updated
 * @param {number} group_id id of group being updated
 * @param {object[]} group holds the information of each user in the group
 * @param {boolean} status whether to remove a user from the group
 * @description updates the group info for each user every time a change takes place
 */
function group_info_response(username, class_id, group_id, group, status) {
    var $people = $('.g' + group_id);
    var $real_people = $('.gr' + group_id);
    if (status) {
        for (var i in group) {
            var member = '<li id="' + group[i].member_name +'"><ul><li>';
            member += group[i].member_name;
            member += '</li></ul></li>';

            var real_member = '<p id="l' + group[i].member_name +'"style = "text-align : center; color: white;">'+group[i].member_name;+'</p>';
            
            $people.append(member);
            $real_people.append(real_member);
        }
    }
    else {
        username = username.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        username = escapeStr(username);
        $('li[id="' + username + '"]').remove();
        $('p[id="l' + username + '"]').remove();
    }
    // Update the user toolbar select
    socket.get_class_users(sessionStorage.getItem('admin_class_id'),'get-class-users-response');
}

/**
 * @function get_classes_response
 * @param {array[object]} classes array of objects holding classes and their hashed IDs
 * @description appends list objects of Classes and their IDs to an unordered list in admin.html
 */
function get_classes_response(classes, secret){
    $username_password_view.hide();
    $create_view.show();
    $settings_tab.show();
    $class_view.hide();

    sessionStorage.setItem('admin_secret', secret);

    $get_classes.html('');
    for (var i = 0; i < classes.length; i++) {
        $get_classes.append('<button class="btn btn-primary" onclick=\'join_class("'
            + classes[i].hashed_id + '")\'><span>' + classes[i].class_name + '</span></button>');
    }
}

/**
 * @function check_username response
 * @param admin id and password
 * @description logs the user in and creates a session
 */
function check_username_response(admin_id, check){
    if(check == 0){
        $username.css("border-color", "red");
        $('.error_username').show();
        $('.error_password').hide();
        $password.css("border-color", null);
    } else if (check == -1){
        $password.css("border-color", "red");
        $('.error_password').show();
        $('.error_username').hide();
        $username.css("border-color", null);
    } else{
        $username.val("");
        $password.val("");

        var string = Math.random().toString(36).substr(2, 8).toLowerCase(); 
        socket.create_session(admin_id, string);
        localStorage.setItem("check", string);
        localStorage.setItem("admin_id", admin_id);
        socket.get_classes("ucd_247", admin_id);
    }

}

/**
 * @function check_session response
 * @param admin id and password
 * @description checks a session
 */
function check_session_response(admin_id, check){
    if(check == 1){
        socket.get_classes("ucd_247", admin_id);
    } else if(check == -1){
        socket.delete_session(admin_id);
        localStorage.setItem('admin_id', '');
        localStorage.setItem('check', '');
        sessionStorage.setItem('admin_secret', '');
    } else if(check == 0 ){
        localStorage.setItem('admin_id', '');
        localStorage.setItem('check', '');
        sessionStorage.setItem('admin_secret', '');
    }
}

/**
 * @function join_class
 * @param class_id
 * @description for letting student join class
 */
function join_class(class_id){
    var current_path = window.location.pathname;
    document.getElementById('student_class_id_link').href = current_path.substring(0,window.location.pathname.lastIndexOf('/')) + "/student.html?class_id="+class_id; 

    socket.join_class(class_id, $secret);
}

//this is called when the user submits a username after the
//redirect modal is opened
function redirect_modal_submit(group, username) {
    username = username.trim();
    if (username == "") return;
    if (!valid_username(username)) {
        if (username == "admin") {
            $('#redirect_username_error_admin').show();
            $('#redirect_username_error').hide();
        }
        else {
            $('#redirect_username_error_admin').hide();
            $('#redirect_username_error').show();
        }
        $('#redirect_username').css("border-color", "red");
        $('#redirect_modal').modal('show');
        return;
    }
    $('#redirect_username_error_admin').hide();
    $('#redirect_username_error').hide();
    $('#redirect_username').css("border-color", "rgb(204,204,204)");
    $('#redirect_modal').modal('hide');
    $('#redirect_username').val("");

    var class_id = "class_id=" + sessionStorage.getItem('admin_class_id');
    var group_id = "group_id=" + group;
    var user_id = "username=" + username;
    var data = [class_id, group_id, user_id];
    var packed = escape(data[0]);
    for (var i = 1; i < data.length; i++) 
        packed += "&" + escape(data[i]);
    window.open("student.html?" + packed, "_blank","toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,width=" + window.outerWidth + ",height=" + window.outerHeight);
}

//this function validates the username submitted to the redirect modal
function valid_username(username) { 
    var alphanum = /^[A-Za-z][A-Za-z0-9]*$/;
    if (username.match(alphanum) && username.length < 9) {  
        // if (username == "admin") {
        //     return false;
        // }
        return true;  
    }
    else {   
        return false;
    }  
}
