var submit=document.getElementById('submit_btn');
submit.onclick=function()
{
    var request=new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if(request.readyState===XMLHttpRequest.DONE)
        {
            if(request.status===200)
            {
                alert('LOgged In Successfully');
            }
            else if(request.status===403)
            {
                alert('username/password incorrect');
            }
            else if(request.status===500)
            {
                alert('Something went wrong');
            }
        }
    };
  var username=document.getElementById('username').value;
  var password=document.getElementById('password').value;
  request.open('POST','http://utkarsh1521168.imad.hasura-app.io/login',true);
  request.setRequestHeader('Content-Type','application/json');
  request.send(JSON.stringify({username:username,password:password}));
};