$(()=>{
    $('#listaPublicacoes').on("click", 'input.pubLike:button', function(e){

        var pubID = $(this).closest('publicacao').attr('id')

        alert("ID da publicação: " + pubID);
z
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
    

    $('#listaPublicacoes').on("click", 'input.commentLike:button', function(e){

        var comentID = $(this).closest('.comentarioDiv').attr('id')
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
    
    $('#listaPublicacoes').on('submit','.formComentarios', function(e){

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
                $('#'+pubID+'comentarios').append(data)
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

    $('#hashtagBTN').on('click', function(e){

		e.preventDefault();        

        var HashtagProcurado = $('#hashtag').val()
        var Trimmed = HashtagProcurado.trim()
        var Termo = Trimmed.replace(/#/g, '')

        if (Termo  != "") {
            
            var url = "http://localhost:3000/pubs?hashtag=" + Termo

            axios.get(url)
                .then(dados => {
                    $('#hashtag').val("")
                    $('#listaPublicacoes').empty()
                    console.log(dados.data)
                    $('#listaPublicacoes').append(dados.data)
                })
                .catch(e => {
                    $('#hashtag').val("")
                    console.log("Erro na pesquisa por hashtags" + e)
                })
        }
    });

    $('#pubDataBTN').on('click', function(e){

		e.preventDefault();        

        var data = $('#pubData').val()
        var a = data.split("-")
        //alert(a)
        if (a[0].length == 4 && a[1].length == 2 && a[2].length == 2) {
        // alert(data)
            var url = "http://localhost:3000/pubs?data=" + data

            axios.get(url)
                .then(dados => {
                    $('#pubData').val("")
                    $('#listaPublicacoes').empty()
                    console.log(dados.data)
                    $('#listaPublicacoes').append(dados.data)
                })
                .catch(e => {
                    $('#pubData').val("")
                    console.log("Data inválida!")
                })
        }
        else {
            $('#pubData').val("")
            alert("Data inválida!")

        }
    });




});
