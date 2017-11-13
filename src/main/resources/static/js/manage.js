//tools
var twokuan=function (value) {
    return value<10?"0"+value:value;

}
var timeFormatter=function (value) {

    var da = new Date(value);

    return da.getFullYear() + "-" + twokuan(da.getMonth() + 1) + "-" + twokuan(da.getDate()) + " " + twokuan(da.getHours()) + ":" + twokuan(da.getMinutes()) + ":" + twokuan(da.getSeconds());

}
//defined
var flashUser=function () {
    $.post("/searchUser",function(res){
        var list=res.data;
        $("#userbody").html("");
        $.each(list,function(idx,user){
            $("#userbody").append("<tr>" +
                "<td>"+user.loginId+"</td>" +
                "<td>"+user.username+"</td>" +
                "<td>"+timeFormatter(user.createTime)+"</td>" +
                "<td>"+timeFormatter(user.updateTime)+"</td>" +
                "<td>" +
                "<button id='eubtn" + user.loginId +"' class='btn btn-xs btn-info' value='Edit' data-toggle='modal' data-target='#EditUser' onclick='edituser(this)'> " +
                "Edit" +
                "</button>&nbsp;" +
                "<button class='btn btn-xs btn-danger' onclick='deluser(this)'>" +
                "Delete" +
                "</button> " +
                "</td>" +
                "</tr>");
        });
    });
};

var flashadvertise = function () {
    $.post("/searchAds",function(res){
        var list=res.data;
        $("#adcount").text(list.length);
        $("#adbody").html("");
        $.each(list,function(idx,ad){
            $("#adbody").append("<tr>\n" +
                "<td>" + ad.userId + "</td>\n" +
                "<td><a href='"+ad.url+"'>" + ad.url + "</a></td>\n" +
                "<td>" + timeFormatter(ad.createTime) + "</td>\n" +
                "<td>\n" +
                "<button class=\"btn btn-danger btn-xs\" onclick='delAdvertise("+ad.id+");searchHistory();'>\n" +
                "<span class=\"glyphicon glyphicon-remove\"></span>\n" +
                "</button>\n" +
                "</td>\n" +
                "</tr>");
        });
    });
};

var flashstudents = function () {
    $.post("/searchStudent",function(res){
        var list=res.data;
        $("#stuListBody").html("");
        $.each(list,function(idx,stu){
            $("#stuListBody").append("<tr>\n" +
                "<td>" + timeFormatter(stu.createTime) + "</td>\n" +
                "<td>"+stu.name+"</td>\n" +
                "<td>"+stu.gender+"</td>\n" +
                "<td>"+stu.age+"</td>\n" +
                "<td>"+stu.phone+"</td>\n" +
                "<td>"+stu.email+"</td>\n" +
                "<td>"+stu.college+"</td>\n" +
                "<td>\n" +
                "<button class=\"btn btn-primary btn-xs\" data-toggle=\"modal\" data-target=\"#Details\" onclick='loadDetails("+stu.id+")'>\n" +
                "More\n" +
                "</button>\n" +
                "</td>\n" +
                "</tr>");
        });
    });
};

var delAdvertise=function (adId) {
    $.post("/delAds", {adId: adId}, function (res) {
        if (res.code!=200) {
            alert(res.msg);
        }
    });
};

function addAdvertise() {
    var url = $("#urlinput").val();
    $.post("/addAds", {url: url}, function (res) {
        if (res.code==200) {
            flashadvertise();
        } else {
            alert(res.code);
        }
    });
}

function edituser(t) {
    var chids =  $(t).closest('td').closest('tr').find("td");
    var userid = chids.eq(0).text();
    var username = chids.eq(1).text();
    var ct = chids.eq(2).text();
    var ut = chids.eq(3).text();
    $("#euid").val(userid);
    $("#eusername").val(username);
    $("#eucreateTime").val(ct);
    $("#euupdateTime").val(ut);
}

function deluser(t) {
    var row = $(t).closest('td').closest('tr');
    var chids =  row.find("td");
    var userid = chids.eq(0).text();
    alert(userid);
    $.post("/delUser", {loginId: userid}, function (res) {
        alert(res.msg);
        if(res.code==200){
            row.remove();
        }
    });
}

function adduser() {
    var loginId = $("#loginId").val();
    var username = $("#username").val();
    var password = $("#upassword").val();
    $.post("/addUser", {loginId: loginId, username: username, password: password, status: 1}, function (res) {
        alert(res.msg);
        if (res.code==200) {
            flashUser();
        }
    });
}

function searchHistory() {
    var sd = $("#hstartd").val();
    var ed = $("#hendd").val();
    $.post("/searchAds", {startDate: sd, endDate: ed}, function (res) {
        var list=res.data;
        $("#searchNum").text(list.length);
        $("#hisbody").html("");
        $.each(list,function(idx,ad){
            $("#hisbody").append("<tr>\n" +
                "<td>" + ad.userId + "</td>\n" +
                "<td><a href='"+ad.url+"'>" + ad.url + "</a></td>\n" +
                "<td>" + timeFormatter(ad.createTime) + "</td>\n" +
                "<td>\n" +
                "<button class=\"btn btn-danger btn-xs\" onclick='delAdvertise("+ad.id+");searchHistory();'>\n" +
                "<span class=\"glyphicon glyphicon-remove\"></span>\n" +
                "</button>\n" +
                "</td>\n" +
                "</tr>");
        });

    });
};

var flashStuSource=function () {
    $.post("/getStuSource",function (res) {
        var list=res.data;
        $("#SSselect").html("");
        var nulloption = "<option value=''></option>";
        $("#SSSearchSelect").html(nulloption);
        $("#userSSselect").html(nulloption);

        $("#SSselect").html(nulloption);

        $.each(list,function (idx,ss) {
            var sons=ss.sonStuSources;
            $.each(sons,function (ids,son) {
                var content=ss.stuSource.name+"-"+son.name;
                var inv="<option value='"+content+"'>"+content+"</option>";
               $("#SSselect").append(inv);
               $("#SSSearchSelect").append(inv);
               $("#userSSselect").append(inv);
            });
        });
    });
};

var showtable=function () {
    if($("#SSselect").val()=="Web-College"){
        $("#fankuiTable").css("display","");
    }else{
        $("#fankuiTable").css("display","none");
    }
};

var FBHelper=function (chkname,answer) {
    if(answer==null)return;
    var an=answer.split(',');
    for(var i=0;i<an.length;i++){
        var str=an[i];
        if(str.length>1){
            $("#other1").val(str);
        }else {
            $("input[name='" + chkname + "']").eq(str).prop("checked", "true");
        }
    }
};

var loadDetails=function (stuId) {
    $.post("/getStudent",{stuId:stuId},function (res) {
        var stu=res.data;
        $("#dtdate").val(timeFormatter(stu.createTime));
        $("#dtname").val(stu.name);
        $("#dtgender").val(stu.gender);
        $("#dtage").val(stu.age);
        $("#dtphonenum").val(stu.phone);
        $("#dtemail").val(stu.email);
        $("#dtcollegename").val(stu.college);
        $("#dtmajor").val(stu.major);
        $("#dtwalkindate").val(stu.walkinDate);
        $("#dtmarks").val(stu.marks);
        $("#dtinsit").val(stu.interviewNote);
        $("#SSselect").val(stu.studentSource);
        $("#dtintention").val(stu.intention);
        $("#dtclassification").val(stu.classification);
    });
    $.post("/getFeedback",{stuId:stuId},function (res) {
        $("input:checkbox").removeAttr("checked");
        $("input:radio").removeAttr("checked");
       var fback=res.data;
       FBHelper('optionsRadiosinline1',fback.answer1);
       FBHelper('optionsRadiosinline2',fback.answer2);
       FBHelper('optionsRadiosinline3',fback.answer3);
       FBHelper('optionsRadiosinline4',fback.answer4);
       FBHelper('optionsRadiosinline5',fback.answer5);
       FBHelper('optionsRadiosinline6',fback.answer6);
       FBHelper('optionsRadiosinline7',fback.answer7);
    });
    $.post("/searchFollowUp",{stuId:stuId},function (res) {
       var fus=res.data;
       $("#followuplist").html("");
       $.each(fus,function (idx,fu) {
           $("#followuplist").append("" +
               "<div class='form-group'>" +
               "<label class='col-sm-2 control-label'>Follow Up:</label> " +
               "<div class='col-sm-8' style='text-align: left;'>" +timeFormatter(fu.createTime)+
               "</div>" +
               "<br/><br/>" +
               "<div class='col-sm-2' align='center'>" +
               "<button class='btn btn-danger btn-xs' onclick=''>" +
               "<span class='glyphicon glyphicon-remove'></span>" +
               "</button>" +
               "<button class='btn btn-info btn-xs' onclick=''>" +
               "<span class='glyphicon glyphicon-edit'></span>" +
               "</button>" +
               "</div>" +
               "<div class='col-sm-10'>" +
               "<textarea class='form-control' style='width: 96%;resize: none;' rows='4'>"+fu.note+"</textarea>" +
               "</div>" +
               "</div>");
       })
    });
};
//Jquery
$("#submiteu").click(function () {
    var formData = new FormData($('#euform')[0]);
    $.ajax({
        type: 'post',
        url: '/updateUser',
        data: formData,
        contentType: false,
        processData: false,
        success: function(res) {
            if (res.code==200) {
                flashUser();
            }else{
                alert(res.msg);
            }
        }
    });
});

$("#urlinput").keydown(function (e) {
    if(e.keyCode==13){
        addAdvertise();
        $("#urlinput").val("");
    }
});

$("#newStudentBtn").click(function () {
    var formData = new FormData($('#newStudentForm')[0]);
    $.ajax({
        type: 'post',
        url: '/addStudent',
        data: formData,
        contentType: false,
        processData: false,
        success: function(res) {
            if (res.code==200) {
                flashstudents();
            }else{
                alert(res.msg);
            }
        }
    });
});

$("#sssearch").click(function () {
    var sd = $("#sssdate").val();
    var ed = $("#ssedate").val();
    var name = $("#ssname").val();
    var clf = $("#selectclass option:selected").val();
    var source = $("#SSSearchSelect option:selected").val();
    $.post("/searchStudent", {name: name, startDate: sd, endDate: ed, classification: clf, source: source}, function (res) {
        if (res.code==200) {
            var list = res.data;
            $("#ssbody").html("");
            $.each(list, function (idx, stu) {
                var name = stu.name;
                var gender = stu.gender;
                var age = stu.age;
                var phone = stu.phone;
                var email = stu.email;
                var college = stu.college;
                var createTime = stu.createTime;
                $("#ssbody").append("<tr>\n" +
                    "<td>" + timeFormatter(createTime) + "</td>\n" +
                    "<td>" + name + "</td>\n" +
                    "<td>" + gender + "</td>\n" +
                    "<td>" + age + "</td>\n" +
                    "<td>" + phone + "</td>\n" +
                    "<td>" + email + "</td>\n" +
                    "<td>" + college + "</td>\n" +
                    "<td>\n" +
                    "<button class=\"btn btn-primary btn-xs\" data-toggle=\"modal\" data-target=\"#Details\">\n" +
                    "More\n" +
                    "</button>\n" +
                    "</td>\n" +
                    "</tr>");
            });
        }
    });
});

$("#research").click(function () {
    var userId = $("#userSearchUserId").val();
    var startDate = $("#userSearchStartDate").val();
    var endDate = $("#userSearchEndDate").val();
    var classification = $("#rcselect option:selected").val();
    //userSSselect
    var source = $("#userSSselect option:selected").val();
    $.post("/searchCount", {userId: userId, startDate: startDate, endDate: endDate, classification: classification, source: source}, function (res) {
        var count = res.data;
        $("#count").text(count);
    });

});

//document.ready
flashUser();
flashadvertise();
flashstudents();
flashStuSource();