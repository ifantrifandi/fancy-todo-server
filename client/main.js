$('#register').click((event)=>{
    event.preventDefault()
    $('#login-page').hide()
    $('#register-page').show()
})

$('#logout').click(event=>{
    event.preventDefault()
    
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });

    localStorage.clear()

    checkAuth()
})
$('#back-to-login').click(event=>{
    event.preventDefault()
    $('#login-page').show()
    $('#register-page').hide()
})

$('#register-submit').click((event)=>{
    event.preventDefault()
    checkAuth(event)
    let email = $('#register-email').val()
    let password = $('#register-password').val()

    $.ajax({
        method:'POST',
        url: 'http://localhost:3001/register',
        data :{
            email,
            password
        }
    })
    .done(response=>{

        $('#register-email').val('')
        $('#register-password').val('')
        
        $('#login-page').show()
        $('#register-page').hide()
    })
   
})

$('#login-submit').click((event)=>{
    event.preventDefault()
    checkAuth(event)
    let email = $('#login-email').val()
    let password = $('#login-password').val()

    $.ajax({
        method : 'POST',
        url : 'http://localhost:3001/login',
        data:{
            email,
            password
        }
    })
    .done((response)=>{
        console.log(response)
        localStorage.setItem('iduser' , response.id)
        localStorage.setItem('email' , email)
        localStorage.setItem('token' , response.access_token)
        
        $('#todo-all-page').show()
        $('#login-page').hide()
        getData()
        $('#login-email').val('')
        $('#login-password').val('')

    })
    .fail(err=>{
        console.log(err)
    })

})

$('#add-todo').click((event)=>{
    event.preventDefault()
    checkAuth(event)
    $('#todo-all-page').hide()
    $('#create-todo-page').show()
})

$('#create-todo').click((event)=>{
    event.preventDefault()
    checkAuth(event)
    let title = $('#title').val()
    let description = $('#description').val()
    let due_date = $('#due_date').val() 
    let UserId = localStorage.getItem('iduser')

    $.ajax({
        method : 'POST',
        url : 'http://localhost:3001/todos',
        data :{
            title,
            description,
            due_date,
            UserId
        },
        headers: {
            token: localStorage.token
        }
    })
    .done(response=>{

    })
    .fail(err=>{
        console.log(err)
    })
    .always(()=>{
        getData()
        $('#todo-all-page').show()
        $('#create-todo-page').hide()

        $('#title').val('')
        $('#description').val('')
        $('#due_date').val('') 
    })
})

$('#back-to-dashboard').click(event=>{
    event.preventDefault()

    getData()
    $('#todo-all-page').show()
    $('#edit-todo').hide()
    localStorage.removeItem('id')

})

$('#edit-todo-submit').click((event)=>{
    event.preventDefault()
    checkAuth(event)
    let idEdit = localStorage.id
    let title = $('#title-edit').val()
    let description = $('#description-edit').val()
    let due_date = $('#due-date-edit').val() 
    let status = $('#status-edit').val()

    $.ajax({
        method : 'PUT',
        url : `http://localhost:3001/todos/${idEdit}`,
        data : {
            title,
            description,
            due_date,
            status
        },
        headers: {
            token: localStorage.token
        }
    })
    .done(response=>{

        getData()
        $('#todo-all-page').show()
        $('#edit-todo').hide()
        localStorage.removeItem('id')  
    })
    .fail(err=>{
        console.log(err)
    })
})

$('#back-from-create').click(event=>{
    event.preventDefault()
    $('#title').val('')
    $('#description').val('')
    $('#due_date').val('')
    getData()
    $('#todo-all-page').show()
    $('#create-todo-page').hide()
})

$('#history').click(event=>{
    event.preventDefault()
    getHistoryData()
    $('#todo-all-page').hide()
    $('#todo-history-page').show()
})

$('#back-from-history').click(event=>{
    event.preventDefault()
    getData()
    $('#todo-all-page').show()
    $('#todo-history-page').hide()
})

function editTodo( id ){
    $.ajax({
        method : 'GET',
        url :`http://localhost:3001/todos/${id}`,
        headers: {
            token: localStorage.token
        }
    })
    .done(response=>{
    
    localStorage.setItem('id' , id)

    let newDate = response.due_date.split('T')
    let newSuperDate = newDate[0]

    $('#title-edit').val(`${response.title}`)
    $('#description-edit').text(`${response.description}`)
    $('#due-date-edit').val(`${newSuperDate}`)

    $('#todo-all-page').hide()
    $('#edit-todo').show()
    checkAuth(event)
    })
    .fail(err=>{
        console.log(err)
    })
}


function deleteTodo( id ){
    
    checkAuth(event)

    $.ajax({
        url: `http://localhost:3001/todos/${id}`,
        method :'DELETE',
        headers: {
            token: localStorage.token
        }
    })
    .done((response)=>{
        getData()
    })
    
}

function deleteHistoryTodo( id ){
    
    checkAuth(event)
    $.ajax({
        url: `http://localhost:3001/todos/${id}`,
        method :'DELETE',
        headers: {
            token: localStorage.token
        }
    })
    .done((response)=>{
        getHistoryData()
    })
    
}

function getData(){
    $('#table-todo-all').empty()
    $.ajax('http://localhost:3001/todos' , {
        method: 'GET',
        headers: {
            token: localStorage.token
        }
    })
    .done(response=>{

        let title = `
        <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Status</th>
        <th>Reference</th>
        <th>Due Date</th>
        <th>Action</th>
        </tr>
        `
        $('#table-todo-all').append(title)

        response.forEach(elem=>{
            
            let reference = `<td><a href="${elem.reference}" target="_blank">${elem.reference}</a></td>`

            if(!elem.reference){
                elem.reference = 'unknown'
                reference = `<td>${elem.reference}</td>`
            }

            let template = 
        `
            <tr>
                    <td>${elem.title}</td>
                    <td>${elem.description}</td>
                    <td>${elem.status}</td>
                    ${reference}
                    <td>${elem.due_date}</td>  
                    <td><button onclick="editTodo(${elem.id})" >Edit</button> <button onclick="deleteTodo(${elem.id})">Delete</button></td>
            </tr>
        `
            $('#table-todo-all').append(template)
        })

    })
    .fail(err=>{
        console.log(err)
    })
}

function getHistoryData(){
    $('#table-history-all').empty()
    $.ajax('http://localhost:3001/todos/history' , {
        method: 'GET',
        headers: {
            token: localStorage.token
        }
    })
    .done(response=>{

        let title = `
        <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Status</th>
        <th>Reference</th>
        <th>Due Date</th>
        <th>Created At</th>
        <th>Updated At</th>
        <th>Action</th>
        </tr>
        `
        $('#table-history-all').append(title)

        response.forEach(elem=>{
            
            let reference = `<td><a href="${elem.reference}" target="_blank">${elem.reference}</a></td>`

            if(!elem.reference){
                elem.reference = 'unknown'
                reference = `<td>${elem.reference}</td>`
            }

            let template = 
        `
            <tr>
                    <td>${elem.title}</td>
                    <td>${elem.description}</td>
                    <td>${elem.status}</td>
                    ${reference}
                    <td>${elem.due_date}</td>  
                    <td>${elem.createdAt}</td>
                    <td>${elem.updatedAt}</td>
                    <td><button onclick="deleteHistoryTodo(${elem.id})">Delete</button></td>    
            </tr>
        `
            $('#table-history-all').append(template)
        })

    })
    .fail(err=>{
        console.log(err)
    })
}

function checkAuth(){

    if(!localStorage.token){
        $('.hidden').hide()
        $('#login-page').show()
    }

}


function onSignIn(googleUser) {
    

    var id_token = googleUser.getAuthResponse().id_token;
    
    $.ajax({
        method : 'POST',
        url : 'http://localhost:3001/login-google',
        data:{
            id_token
        }
    })
    .done((response)=>{

        localStorage.setItem('email' , response.email)
        localStorage.setItem('token' , response.access_token)
        localStorage.setItem('iduser' , response.id)
        


        $('#todo-all-page').show()
        $('#login-page').hide()
        getData()
        
        checkAuth()


    })
    .fail((jqXHR , textStatus)=>{
        console.log('haduh')
        console.log(textStatus)
    })

    
}
  