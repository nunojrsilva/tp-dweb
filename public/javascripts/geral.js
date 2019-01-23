$(()=>{

	var fileInputs = 0;
	var tipo = "opiniao"

	$('input:file').bind('change', function() {
		if (this.files[0].size > 200*1024*1024) {
			alert("Tamanho do ficheiro excedeu o limite de 200MB");
			$('#myForm').trigger("reset");
		}
	})

	$("#formDiv").on("click", "#addFiles", () => {

		fileInputs = fileInputs + 1
 
		var input = $("<input type='file' class='w3-input w3-border w3-light-grey' name='file" + fileInputs + "' multiple/>");
		$("#listaFiles").append(input);
	})

	$("#opiniaobtn").click(e=>{
		tipo = "opiniao"
		$('#formDiv').load('http://localhost:3000/pubs/opiniaoPub')
	})

	$("#narracaobtn").click(e=>{
		tipo = "narracao"
		$('#formDiv').load('http://localhost:3000/pubs/narracaoPub')
	})

	$("#filesbtn").click(e=>{
		tipo = "ficheiros"
		$('#formDiv').load('http://localhost:3000/pubs/ficheirosPub')
	})

	$("#listabtn").click(e=>{
		tipo = "lista"
		//$('#formDiv').load('http://localhost:3000/pubs/opiniaoPub')
	})

	$("#eventobtn").click(e=>{
		tipo = "evento"
		//$('#formDiv').load('http://localhost:3000/pubs/opiniaoPub')
	})

	$('#formPub').submit(function(e){
		e.preventDefault();
					
		var formData = new FormData();
		var aux=1;
		formData.append( 'action','uploadFiles');
		$.each($("input[type=file]"), function(i, obj) {
			$.each(obj.files,function(j, file){
				formData.append('file'+aux, file);
				aux++;
			})
		});		
		formData.append('username', $('#username').val());

		if(tipo == "opiniao")
			formData.append('opiniao', $('#opiniao').val());

		if(tipo == "ficheiros")
			formData.append('titulo', $('#filesTitulo').val());

		if(tipo == "narracao"){
			formData.append('titulo', $('#titulo').val());
			formData.append('texto', $('#texto').val());
			formData.append('autor', $('#autor').val());
		}
		/*
		if(tipo == "lista")
			formData.append('lista', $('#lista').val());

		if(tipo == "evento")
			formData.append('evento', $('#evento').val());
		*/	
		$.ajax({
			url:'/api/pubs/'+tipo,
			type:"POST",
			contentType: "application/json",
			data:formData,
			success: data =>{/*
				var titulo = $('#filesTitulo').val();

        		for(var numOfInputs = 0; $('#files'+numOfInputs).length; numOfInputs++){
					var files = $('#files'+numOfInputs)[0].files;
					for (var i = 0; i < files.length; i++)
					{
						//alert('Ficheiro enviado:' + files[i].name);

						var nome = files[i].name;
						
						$('#myTable').append('<tr><td><a href=\'/uploaded/'+nome+'\'>'+nome+'</a></td><td>'+titulo+'</td></tr>');
					}			
				}*/
				alert('Ficheiros enviados');
				$('#myForm').trigger("reset");
			},
			error: e =>{
				alert('Erro no post: ' + e)
				$('#myForm').trigger("reset");
				console.log('Erro no post: ' + e)
			},
			cache: false,
			contentType: false,
			processData: false
		});
	});
});