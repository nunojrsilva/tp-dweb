$(()=>{

    $("listaPublicacoes").load('http://localhost:3000/pubs?username='+$("listaPublicacoes").attr('id'))

    $("input.pubLike:button").click(function() {

        var pubID = $(this).closest('publicacao').attr('id')

        alert("ID da publicação: " + pubID);

        var formData = new FormData();
        formData.append('pubID', pubID)
        
        $.ajax({
            url: '/pubs/pubGostos',
            type: 'PUT',
            contentType: "application/json",
            data: formData,
            success: data =>{
                console.dir(data.size)
                $('#' + this.id).val('Gosto (' + (data.size) + ')')
            },
            error: e =>{
                alert('Erro no post: ' + JSON.stringify(e))
                console.log('Erro no post: ' + JSON.stringify(e))
            },
			cache: false,
			contentType: false,
			processData: false
        });
    });

    $('#aSeguirBTN').click(e=>{
        e.preventDefault()
        var id = $('#id').attr('name')
        console.log(id)

        var url = 'http://localhost:3000/aSeguir?uid=' + id
        axios.get(url)
        .then(dados =>{
            $('#aSeguirBTN').css('visibility', 'hidden')
            $('#seguidoresBTN').css('visibility', 'visible')
            $('#pubsBTN').css('visibility', 'visible')
    
            $('#aSeguir').css('visibility', 'visible')
            $('#seguidores').css('visibility', 'hidden')
            $('#pubs').css('visibility', 'hidden')

            console.log(dados)
            console.log(dados.data)
            $('#aSeguir').empty()
            $('#aSeguir').append(dados.data)
        })
        .catch(erro =>{
            alert('Erro no get aSeguir: ' + erro)
            console.log('Erro no get aSeguir: ' + erro)
        })
    })

    $('#seguidoresBTN').click(e=>{
        e.preventDefault()
        var id = $('#id').attr('name')
        console.log(id)
        var url = 'http://localhost:3000/aSeguir'
        $('#aSeguirBTN').css('visibility', 'visible')
        $('#seguidoresBTN').css('visibility', 'hidden')
        $('#pubsBTN').css('visibility', 'visible')

        $('#aSeguir').css('visibility', 'hidden')
        $('#seguidores').css('visibility', 'visible')
        $('#pubs').css('visibility', 'hidden')

        /*axios.get(url, {uid: id})
        .then(_ =>{

        })
        .catch(erro =>{
            alert('Erro no post: ' + JSON.stringify(erro))
            console.log('Erro no post: ' + JSON.stringify(erro))
        })*/
    })

    $('#pubsBTN').click(e=>{
        e.preventDefault()
        var id = $('#id').attr('name')
        console.log(id)
        var url = 'http://localhost:3000/aSeguir'
        $('#aSeguirBTN').css('visibility', 'visible')
        $('#seguidoresBTN').css('visibility', 'visible')
        $('#pubsBTN').css('visibility', 'hidden')

        $('#aSeguir').css('visibility', 'hidden')
        $('#seguidores').css('visibility', 'hidden')
        $('#pubs').css('visibility', 'visible')

        /*axios.get(url, {uid: id})
        .then(_ =>{

        })
        .catch(erro =>{
            alert('Erro no post: ' + JSON.stringify(erro))
            console.log('Erro no post: ' + JSON.stringify(erro))
        })*/
    })

    $('#seguir').click(e=>{
        e.preventDefault()
        var id = $('#id').attr('name')
        console.log(id)
        var url = 'http://localhost:3000/Seguir'

        axios.post(url, {userParaSeguir: id})
        .then(_ =>{
            $('#seguir').css('visibility', 'hidden')
            $('#seguirImg').css('visibility', 'hidden')
            $('#ignorar').css('visibility', 'visible')
            $('#ignorarImg').css('visibility', 'visible')
        })
        .catch(erro =>{
            alert('Erro no post: ' + JSON.stringify(erro))
            console.log('Erro no post: ' + JSON.stringify(erro))
        })
    })

    $('#ignorar').click(e=>{
        e.preventDefault()

        var id = $('#id').attr('name')
        console.log(id)
        var url = 'http://localhost:3000/Ignorar'

        axios.post(url, {userAIgnorar: id})
        .then(_ =>{
            $('#seguir').css('visibility', 'visible')
            $('#seguirImg').css('visibility', 'visible')
            $('#ignorar').css('visibility', 'hidden') 
            $('#ignorarImg').css('visibility', 'hidden') 
        })
        .catch(erro =>{
            alert('Erro no post: ' + JSON.stringify(erro))
            console.log('Erro no post: ' + JSON.stringify(erro))
        })
    })
    
    $('#fotosPerfil').click(e =>{
        e.preventDefault()
        location.href = "http://localhost:3000/FotosPerfil";
    })

    $('comentarios').on("click", 'input.commentLike:button', e => {

        comentID = e.target.id
        alert("ID do comentário: " +  comentID);

        var formData = new FormData();
        formData.append('comentID', comentID)
        
        $.ajax({
            url: '/pubs/comentGostos',
            type: 'PUT',
            contentType: "application/json",
            data: formData,
            success: data =>{
                console.dir(data.size)
                $('#' + comentID).val('Gosto (' + (data.size) + ')')
            },
            error: e =>{
                alert('Erro no post: ' + JSON.stringify(e))
                console.log('Erro no post: ' + JSON.stringify(e))
            },
			cache: false,
			contentType: false,
            processData: false
        });
    });
    
    $("form").submit(function(e) {
		e.preventDefault();        

        var pubID = $(this).closest('publicacao').attr('id')
        alert("ID da publicação: " + pubID);

        var formData = new FormData();
		formData.append('pubID', pubID)
		formData.append('comentario', $('#'+pubID).find('#comentario').val())
        
        $.ajax({
            url: '/pubs/comentario',
            type: 'PUT',
            contentType: "application/json",
            data: formData,
            success: data =>{
                console.dir(data)
                $('#' + this.id).trigger("reset");
                $('comentarios').append(data)
                $("#"+pubID+"NoComments").remove()
                alert('Comentário enviado');
            },
            error: e =>{
                alert('Erro no post: ' + JSON.stringify(e))
                $('#' + this.id).trigger("reset");
                console.log('Erro no post: ' + JSON.stringify(e))
            },
			cache: false,
			contentType: false,
			processData: false
        });
    });
});
