         function onlyAlphabets() {
            var password = document.f.password1.value;
        var confirmPassword = document.f.confpassword.value;
             var regex = /^[a-zA-Z0-9_]+$/;
             if (regex.test(document.f.username.value)&&(password === confirmPassword)) {

            //document.getElementById("notification").innerHTML = "Watching.. Everything is Alphabet now";
            return true;
            }  else if(!regex.test(document.f.username.value)){
            // document.getElementById("notification").innerHTML = "Alphabets Only";
            alert("alphanumeric only");
            return false;
            }
            else{
                alert("Passwords do not match.");
            return false;
            }
            function load(){
            document.f.profileImage.value = "/uploads/default.png";
            }}

