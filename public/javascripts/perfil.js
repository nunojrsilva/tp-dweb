$(()=>{
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

    $('#seguir').click(e=>{
        e.preventDefault()
        var id = $('#id').attr('name')
        console.log(id)
        var userParaSeguir = id

        var url = 'http://localhost:3000/Seguir?userParaSeguir=' + id
        $.ajax({
            url: url,
            type: 'Post',
            contentType: "application/json",
            data: userParaSeguir,
            success: data =>{
                $('#seguir7ignorar').empty()
                $('#seguir7ignorar').append(data)                
            },
            error: e =>{
                alert('Erro no post: ' + JSON.stringify(e))
                console.log('Erro no post: ' + JSON.stringify(e))
            },
			cache: false,
			contentType: false,
            processData: false
        });
    })

    $('#ignorar').click(e=>{
        e.preventDefault()

        var id = $('#id').attr('name')
        console.log(id)

        var url = 'http://localhost:3000/Ignorar?userAIgnorar=' + id

        var userAIgnorar = id
        $.ajax({
            url: url,
            type: 'Post',
            contentType: "application/json",
            data: userAIgnorar,
            success: data =>{
                $('#seguir7ignorar').empty()
                $('#seguir7ignorar').append(data)                
            },
            error: e =>{
                alert('Erro no post: ' + JSON.stringify(e))
                console.log('Erro no post: ' + JSON.stringify(e))
            },
			cache: false,
			contentType: false,
            processData: false
        });
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
