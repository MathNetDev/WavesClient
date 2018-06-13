"use strict";
$(function() {

    $('[data-toggle="tooltip"]').tooltip(); //enable tooltips
    
    // Connect to the server using the Admin.Socket object constructor
    
    var class_id; // Declaring class id globally in this file


    var $secret = "ucd_247"; // Setting the secret up for further destruction

    // Start with secret view visible and create/manage/settings view hidden
    $create_view.hide();
    $class_view.hide();
    $create_user_view.hide();

    //
    // Called to check if user is logged in
    //
    if(localStorage.getItem('admin_id')){
        if(localStorage.getItem('check')){
            socket.check_session(localStorage.getItem('admin_id'), localStorage.getItem('check'));
        }
    }
    
    $username_password_view.show();
    $container.show();

    //
    // CHECKING THE USERNAME AND PASSWORD COMBINATION
    //
    $login_button.bind('click', function() {
        socket.check_username($username.val(), $password.val(), $secret);
    });


    //
    //  Pinging
    //
    /* Comment Pinging
    window.setInterval(function(){
        var d = new Date();
        socket.ping(d.getTime());
    }, 500);
    */
    
    //
    // SUBMIT PASSWORD HITTING ENTER KEY
    //
    $password.keypress(function(e) {
        if (e.which == 13) {
            socket.check_username($username.val(), $password.val(), $secret);
        }
    });

    //
    // SUBMIT USERNAME HITTING ENTER KEY
    //
    $username.keypress(function(e) {
        if (e.which == 13) {
            socket.check_username($username.val(), $password.val(), $secret);
        }
    });
    

    //
    // TO CREATE NEW USER
    //
    $new_user.bind('click', function() {
        $username_password_view.hide();
        $create_user_view.show();
    });

    //
    // CREATE CLASS
    //
    $create_button.bind('click', function() {
        // Tell the server to create a class in the database
        if ($class_input.val().trim() == "") {
            $class_input.css("border-color", "red");
            $empty_class_input.show();
        }
        else{
            var group_colors = [];

            for(var i = 0; i < parseInt($group_input.val().trim()); i++) {
                var colors = [], minimum = 0, maximum = 255;
                colors.push(Math.floor(Math.random() * (maximum - minimum + 1)) + minimum);
                colors.push(Math.floor(Math.random() * (maximum - minimum + 1)) + minimum);
                colors.push(Math.floor(Math.random() * (maximum - minimum + 1)) + minimum);
                var color = colors.join('-');
                group_colors[i] = color;

            }
            socket.add_class($class_input.val().trim(), parseInt($group_input.val().trim()), $secret, localStorage.getItem('admin_id'), group_colors);
        }
    });

    //
    // GETTING BACK TO LOGIN SCREEN
    //
    $create_admin_back.bind('click', function() {
        $create_user_view.hide();
        $username_password_view.show();
        $new_username.val("");
        $new_password.val("");
        $re_new_password.val("");
        $Secret.val("");

        $error_new_username.hide();
        $new_username.css("border-color", null);
        $error_re_new_password.hide();
        $re_new_password.css("border-color", null);

    });

    //
    // JOIN CLASS
    //
    $join_button.bind('click', function() {
        socket.join_class($class_id.val().trim(), $secret);
    });

    //
    // ADD GROUP
    //
    $add_button.bind('click', function() {
        // Tell the server to create a new group for the class in the database
        var colors = [], minimum = 0, maximum = 255;
        colors.push(Math.floor(Math.random() * (maximum - minimum + 1)) + minimum);
        colors.push(Math.floor(Math.random() * (maximum - minimum + 1)) + minimum);
        colors.push(Math.floor(Math.random() * (maximum - minimum + 1)) + minimum);
        socket.add_group(sessionStorage.getItem('admin_class_id'), $secret, colors);
    });

    //
    // CREATING A NEW ADMIN
    //
    $create_admin_button.bind('click', function() {

        if($new_password.val() == $re_new_password.val())
            socket.create_admin($new_username.val(), $new_password.val(),  $Secret.val());
        else{
            $re_new_password.css("border-color", "red");
            $error_re_new_password.show();
        }
            
    });

    //
    // DELETE GROUP
    //
    $delete_button.bind('click', function() {
        // Only remove if there are groups
        if ($('.groups > li').length > 0) {
            socket.delete_group(sessionStorage.getItem('admin_class_id'), $('.groups > li:last').index() + 1, $secret);
        }
    });

    //
    // LEAVE CLASS
    //
    $leave_button.bind('click', function() {
        socket.leave_class(sessionStorage.getItem('admin_class_id'), $secret, false);
    });

    //
    // SAVE SETTTINGS
    //
    $save_button.bind('click', function() {
        var data = {};
        for(var i=0; i<$settings.length; i++) {
            data[$settings[i].name] = $settings[i].checked;
        }
        socket.save_settings(sessionStorage.getItem('admin_class_id'), data, $secret);
    });

    //
    // LOGGING OUT
    //
    $logout_class_button.bind('click', function(){
        
        $create_view.hide();
        $settings_tab.hide();
        $username_password_view.show();
        
        socket.delete_session(localStorage.getItem('admin_id'));

        localStorage.setItem('admin_id', '');
        localStorage.setItem('check', '');
        sessionStorage.setItem('admin_secret', '');
        $('.error_password').hide();
        $('.error_username').hide();
        $('.error_class_input').hide();
        $password.css("border-color", null);
        $username.css("border-color", null);
        $class_input.css("border-color", null);
        $class_input.val("");
        $group_input.val("");



    });


    //
    // DELETING CLASS
    //
    $delete_class_button.bind('click', function(e)
    {
        var password = prompt('If you really want to delete class, then enter secret password')    

        if (password == $secret)
        {
           alert('Correct! The class has been deleted. Press OK to continue.');
           socket.delete_class(sessionStorage.getItem('admin_class_id'), $secret, true);
        }
    });

    //
    // SETTINGS CHANGE PASSWORD BUTTON 
    //
    $change_password_button.bind('click', function() {
        if ($changed_password.val() !== $retyped_changed_password.val()) {
            $('.error_password_incorrect').hide();
            $current_password.css('border-color',  '#CCCCCC'); 
            $('.error_password_mismatch').show();
            $changed_password.css('border-color', 'red'); 
            $retyped_changed_password.css('border-color', 'red');
        }
        else {
            $('.error_password_mismatch').hide();
            $changed_password.css('border-color',  '#CCCCCC'); 
            $retyped_changed_password.css('border-color', '#CCCCCC');
            socket.change_password(localStorage.getItem('admin_id'), $current_password.val(), $changed_password.val(), $secret);
        }
    });

    // 
    // MODAL LOGIN BUTTON
    //
    $redirect_login_button.bind('click', function() {
        redirect_modal_submit($redirect_modal.attr("group_id"), $redirect_username.val());
    });

    //
    // SUBMIT USERNAME HITTING ENTER KEY FOR MODAL
    //
    $redirect_username.keypress(function(e) {
        if (e.which == 13) {
            redirect_modal_submit($redirect_modal.attr("group_id"), $redirect_username.val());
        }
    });

});

