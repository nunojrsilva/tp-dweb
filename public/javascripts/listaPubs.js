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
                $('#' + this.id).val('Gostos (' + (data.size) + ')')
                alert('Gosto adicionado');
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

    $("input.commentLike:button").click(function() {

        alert("ID do comentário: " + this.id);

        var formData = new FormData();
        formData.append('comentID', this.id)
        
        $.ajax({
            url: '/pubs/comentGostos',
            type: 'PUT',
            contentType: "application/json",
            data: formData,
            success: data =>{
                console.dir(data.size)
                $('#' + this.id).val('Gostos (' + (data.size) + ')')
                alert('Gosto adicionado');
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
    
    $("form").submit(function(e) {
		e.preventDefault();        

        var pubID = $('#' + this.id).attr('name')

        var formData = new FormData();
		formData.append('pubID', pubID)
		formData.append('username', $('#'+pubID).find('#username').val())
		formData.append('comentario', $('#'+pubID).find('#comentario').val())
        
        $.ajax({
            url: '/pubs/comentario',
            type: 'PUT',
            contentType: "application/json",
            data: formData,
            success: data =>{
                alert('Comentário enviado');
                $('#' + this.id).trigger("reset");
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
