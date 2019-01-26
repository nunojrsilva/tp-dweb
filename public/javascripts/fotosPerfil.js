$(()=>{

	var fileInputs = 0;

	$('input:file').bind('change', function() {
		if (this.files[0].size > 200*1024*1024) {
			alert("Tamanho do ficheiro excedeu o limite de 200MB");
			$('#myForm').trigger("reset");
		}
	})

	$("#AdicaoFicheiros").click(e =>{
		e.preventDefault()

		$('#AdicaoFicheiros').css('visibility', 'hidden')
		$('#filesDiv').css('visibility', 'visible')
	})

	$("#cancelarAdicaoFicheiros").click(e =>{
		e.preventDefault()

		$('#filesDiv').css('visibility', 'hidden')
		$('#AdicaoFicheiros').css('visibility', 'visible')
	})

	$('#Enviar').click(function(e){
		e.preventDefault();
		
		console.log("HERE")
		var formData = new FormData();

        formData.append('uid', $('#id').attr('name'));        
        
        var aux=1;
		$.each($("input[type=file]"), (i, obj) => {
			
			$.each(obj.files,(j, file) => {
				
				formData.append('file'+aux, file);
				aux++;
			})
		});		
		
		$.ajax({
			url:'/api/users/novaFotoPerfil',
			type:"POST",
			contentType: "application/json",
			data:formData,
			success: data =>{
				$("#listaImg").empty()
				for(foto in data.fotos)
					$("#listaImg").append("<li><a href=\"http://localhost:3000/api/files/foto?userId=" + $('#id').attr('name') + "fotoId=" + foto._id + "><img style=\"max-width: 250px; max-height: 250px;\" src=\"http://localhost:3000/api/files/foto?userId=" + $('#id').attr('name') + "fotoId=" + foto._id + "\"></a><br><br></li>")
					
				alert('Ficheiros enviados' + JSON.stringify(data));
				console.log(JSON.stringify(data))
				$('#filesDiv').trigger("reset");
			},
			error: e =>{
				alert('Erro no post: ' + JSON.stringify(e))
				$('#filesDiv').trigger("reset");
				console.log('Erro no post: ' + JSON.stringify(e))
			},
			cache: false,
			contentType: false,
			processData: false
		});
	});
});