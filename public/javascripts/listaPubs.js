$(()=>{
    $("input.pubLike:button").click(function() {

        alert("ID da publicação: " + $(this).closest('publicacao').attr('id'));

		var number = $('#' + this.id).attr('name');
		var y = parseInt(number);
		$('#' + this.id).val('Gosto (' + (y+1) + ')')
		$('#' + this.id).attr('name',y+1);

    });

    $("input.commentLike:button").click(function() {

        alert("ID do comentário: " + this.id);

		var number = $('#' + this.id).attr('name');
		var y = parseInt(number);
		$('#' + this.id).val('Gosto (' + (y+1) + ')')
		$('#' + this.id).attr('name',y+1);

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
