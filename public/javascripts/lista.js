$(()=>{

    var fileInputs = 0;
    var item = 1;

	$('input:file').bind('change', function() {
		if (this.files[0].size > 200*1024*1024) {
			alert("Tamanho do ficheiro excedeu o limite de 200MB");
			$('#myForm').trigger("reset");
		}
	})
    
    $("#adicionarLinha").click(e => {
        e.preventDefault()
        item = item + 1
 
        var input = $("<input class=\"w3-input\" id=\"item" + item + "\" type=\"text\" placeholder=\"Item da Lista\">");
        $("#inputs").append(input)
      
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

	$("#sim").click(e =>{

		$('#nao').prop('checked', false)
		$('#sim').prop('checked', true)
	})

	$("#nao").click(e =>{

		$('#sim').prop('checked', false)
		$('#nao').prop('checked', true)
	})

    $("#more_files").click(e => {
		e.preventDefault()

		fileInputs = fileInputs + 1
 
		var input = $("<input type='file' class='w3-input w3-border w3-light-grey' name='file" + fileInputs + "' multiple/>");
		$("#listaFiles").append(input);
	})

	$('#ListaForm').submit(function(e){
		e.preventDefault();
					
		var formData = new FormData();

        formData.append('username', $('#username').val());        
        formData.append('titulo', $('#titulo').val());
		
		if(document.getElementById('sim').checked)
			formData.append('publico', true);
		else
			formData.append('publico', false);

        var aux=1;
        var linha = "";
		console.log(item)
		
        for(aux = 1; aux <= item; aux++){
            linha = $("#item" + aux).val()
            if(linha != undefined){
                if (linha != ""){
                    formData.append('item'+aux, linha)
                }
            }
            else
                console.log("ERA UNDEFINED", aux)
        }

        aux = 1
		$.each($("input[type=file]"), (i, obj) => {
			
			$.each(obj.files,(j, file) => {
				
				formData.append('file'+aux, file);
				aux++;
			})
		});
		
		formData.append('fileTitle', $('#filesTitulo').val());
		
		
		$.ajax({
			url:'/pubs/lista',
			type:"POST",
			contentType: "application/json",
			data:formData,
			success: data =>{
				$('#inicioPagina').html(data)
				alert('Ficheiros enviados');
				console.log(JSON.stringify(data))
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
