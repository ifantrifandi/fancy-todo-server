$('#register').click((event)=>{
    event.preventDefault()
    $('#login-page').hide()
    $('#register-page').show()
})

$('#logout').click(event=>{
    event.preventDefault()
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
        localStorage.setItem('email' , email)
        localStorage.setItem('token' , response.access_token)
        $('#login-page').hide()
        $('#todo-all-page').show()
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
    
    $.ajax({
        method : 'POST',
        url : 'http://localhost:3001/todos',
        data :{
            title,
            description,
            due_date
        },
        headers: {
            token: localStorage.token
        },
        isLoggedIn :{
            email : localStorage.email
        }
    })
    .done(response=>{
        $('#table-todo-all').empty()
        getData()
        $('#todo-all-page').show()
        $('#create-todo-page').hide()

        $('#title').val('')
        $('#description').val('')
        $('#due_date').val('')   
    })
    .fail(err=>{
        console.log(err)
    })
})

$('#back-to-dashboard').click(event=>{
    event.preventDefault()
    $('#table-todo-all').empty()
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
        },
        isLoggedIn :{
            email : localStorage.email
        }
    })
    .done(response=>{
        $('#table-todo-all').empty()
        getData()
        $('#todo-all-page').show()
        $('#edit-todo').hide()
        localStorage.removeItem('id')  
    })
    .fail(err=>{
        console.log(err)
    })
})

function editTodo( id ){
    $.ajax({
        method : 'GET',
        url :`http://localhost:3001/todos/${id}`,
        headers: {
            token: localStorage.token
        },
        isLoggedIn :{
            email : localStorage.email
        }
    })
    .done(response=>{
    
    localStorage.setItem('id' , id)

    let newDate = response.due_date.split('T')
    let newSuperDate = newDate[0]

    $('#title-edit').val(`${response.title}`)
    $('#description-edit').text(`${response.description}`)
    $('#due-date-edit').val(`${newSuperDate}`)
    $('#status-edit').val(`${response.status}`)

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
        },
        isLoggedIn :{
            email : localStorage.email
        }
    })
    .done((response)=>{
        afterDelete()
    })
    
}

function afterDelete(){

    $('#table-todo-all').empty()
    getData()

}

function getData(){

    $.ajax('http://localhost:3001/todos' , {
        method: 'GET',
        headers: {
            token: localStorage.token
        },
        isLoggedIn :{
            email : localStorage.email
        }
    })
    .done(response=>{

        let title = `
        <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Status</th>
        <th>Due Date</th>
        <th>Action</th>
        </tr>
        `
        $('#table-todo-all').append(title)

        response.forEach(elem=>{
            let template = 
        `
            <tr>
                    <td>${elem.title}</td>
                    <td>${elem.description}</td>
                    <td>${elem.status}</td>
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

function checkAuth(event){

    if(!localStorage.token){
        $('.hidden').hide()
        $('#login-page').show()
    }
}