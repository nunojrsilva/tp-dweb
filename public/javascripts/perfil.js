$(()=>{

    $("listaPublicacoes").load('http://localhost:3000/pubs?username='+$("listaPublicacoes").attr('id'))

    $("input.pubLike:button").click(function() {


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

    $('#alterarPriv').click(function(e){

        var novaPriv = null;
        var pubId = $(this).closest('publicacao').attr('id')
        
        if((document.getElementById('publicacb'+pubId) && document.getElementById('publicacb'+pubId).checked))
            novaPriv = "publica"

        else{
            if(document.getElementById('seguidorescb'+pubId) && document.getElementById('seguidorescb'+pubId).checked)
                novaPriv = "seguidores"

            else{
                novaPriv = "privada"
                console.log("PASSEI AQUI")
            }
        }
        
        var url = "http://localhost:3000/pubs/alterarPrivacidade"
        var data = {idPub: pubId,priv: novaPriv}
        console.log(data)
        axios.post(url, data)
        .then(tocheck =>{
            console.log(tocheck.data)
            $('#privacidade'+pubId).replaceWith("Privacidade Atual:  " + tocheck.data + "<br>")

        })
        .catch(erro =>{
            console.log("ERRO AO ALTERAR A PRIVACIDADE DE UMA PUBLICAÇÃO : " + data.idPub + erro)
        })

    })

    $("input.publicacb").click(function(e) {
        var pubID = $(this).closest('publicacao').attr('id')

        $('#publicacb'+pubID).prop('checked', true)
		$('#seguidorescb'+pubID).prop('checked', false)
		$('#privadacb'+pubID).prop('checked', false)
	})

	$("input.seguidorescb").click(function(e){
        var pubID = $(this).closest('publicacao').attr('id')

		$('#publicacb'+pubID).prop('checked', false)
		$('#seguidorescb'+pubID).prop('checked', true)
		$('#privadacb'+pubID).prop('checked', false)
	})

	$("input.privadacb").click(function(e){
        var pubID = $(this).closest('publicacao').attr('id')

		$('#publicacb'+pubID).prop('checked', false)
		$('#seguidorescb'+pubID).prop('checked', false)
		$('#privadacb'+pubID).prop('checked', true)
	})

    $('#aSeguirBTN').click(e=>{
        e.preventDefault()
        var id = $('#id').attr('name')
        console.log(id)

        var url = 'http://localhost:3000/aSeguir?uid=' + id
        axios.get(url)
        .then(dados =>{
            $('#aSeguirBTN').css('display', 'none')
            $('#seguidoresBTN').css('display', '')
            $('#pubsBTN').css('display', '')
    
            $('#aSeguir').css('display', '');
            $('#seguidores').css('display', 'none');
            $('#listaPublicacoes').css('display', 'none');

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

        var url = 'http://localhost:3000/Seguidores?uid=' + id
        axios.get(url)
        .then(dados =>{
            $('#aSeguirBTN').css('display', '')
            $('#seguidoresBTN').css('display', 'none')
            $('#pubsBTN').css('display', '')

            $('#aSeguir').css('display', 'none');
            $('#seguidores').css('display', '');
            $('#listaPublicacoes').css('display', 'none');
            
            console.log(dados)
            console.log(dados.data)
            
            $('#seguidores').empty()
            $('#seguidores').append(dados.data)
        })
        .catch(erro =>{
            alert('Erro no post: ' + JSON.stringify(erro))
            console.log('Erro no post: ' + JSON.stringify(erro))
        })
    })

    $('#pubsBTN').click(e=>{
        e.preventDefault()

        $('#aSeguirBTN').css('display', '')
        $('#seguidoresBTN').css('display', '')
        $('#pubsBTN').css('display', 'none')

        $('#aSeguir').css('display', 'none');
        $('#seguidores').css('display', 'none');
        $('#listaPublicacoes').css('display', '');
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
