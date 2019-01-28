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

	$("#publica").click(e =>{

		$('#publica').prop('checked', true)
		$('#seguidores').prop('checked', false)
		$('#privada').prop('checked', false)
	})

	$("#seguidores").click(e =>{

		$('#publica').prop('checked', false)
		$('#seguidores').prop('checked', true)
		$('#privada').prop('checked', false)
	})

	$("#privada").click(e =>{

		$('#publica').prop('checked', false)
		$('#seguidores').prop('checked', false)
		$('#privada').prop('checked', true)
	})
	
    $("#more_files").click(e => {
		e.preventDefault()

		fileInputs = fileInputs + 1
 
		var input = $("<input type='file' class='w3-input w3-border w3-light-grey' name='file" + fileInputs + "' multiple/>");
		$("#listaFiles").append(input);
	})

	$('#EventoForm').submit(function(e){
		e.preventDefault();
					
		var formData = new FormData();

        formData.append('username', $('#username').val());        
        formData.append('titulo', $('#titulo').val());
        formData.append('atividade', $('#atividade').val());
        formData.append('duracao', $('#duracao').val());
        formData.append('descricao', $('#descricao').val());
        formData.append('data', $('#data').val());
		formData.append('fileTitle', $('#filesTitulo').val());
		
		if(document.getElementById('publica').checked)
			formData.append('privacidade', "publica");
		else{
			if(document.getElementById('seguidores').checked)
				formData.append('privacidade', "seguidores");
			else
				formData.append('privacidade', "privada");
		}

        
        var aux=1;
		$.each($("input[type=file]"), (i, obj) => {
			
			$.each(obj.files,(j, file) => {
				
				formData.append('file'+aux, file);
				aux++;
			})
		});		
		
		$.ajax({
			url:'/pubs/evento',
			type:"POST",
			contentType: "application/json",
			data:formData,
			success: data =>{
				$('#inicioPagina').html(data)
				alert('Ficheiros enviados');
				console.log(JSON.stringify(data))
				$('#myForm').trigger("reset");
			},
			error: e =>{
				alert('Erro no post: ' + JSON.stringify(e))
				$('#myForm').trigger("reset");
				console.log('Erro no post: ' + JSON.stringify(e))
			},
			cache: false,
			contentType: false,
			processData: false
		});
	});
});