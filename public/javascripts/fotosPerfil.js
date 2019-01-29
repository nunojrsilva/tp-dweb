$(()=>{

	var fileInputs = 0;

	$('input:file').bind('change', function() {
		if (this.files[0].size > 200*1024*1024) {
			//alert("Tamanho do ficheiro excedeu o limite de 200MB");
			$('#myForm').trigger("reset");
		}
	})

	$("#AdicaoFicheiros").click(e =>{
		e.preventDefault()

		$('#filesDiv').css('visibility', 'visible')
	})

	$("#cancelarAdicaoFicheiros").click(e =>{
		e.preventDefault()

		$('#filesDiv').find('input:text').val('');
		$('#filesDiv').find('input:file').val('');
		$('#filesDiv').css('visibility', 'hidden')
	})

	$('#Enviar').click(function(e){
		e.preventDefault();
		
		console.log("HERE")
		var formData = new FormData();

        var aux=1;
		$.each($("input[type=file]"), (i, obj) => {
			
			$.each(obj.files,(j, file) => {
				
				formData.append('file'+aux, file);
				aux++;
			})
		});		
		
		$.ajax({
			url:'/novaFotoPerfil',
			type:"POST",
			contentType: "application/json",
			data:formData,
			success: data =>{
				console.log(JSON.stringify(data))
				$("#listaImg").append(data)
				$('#filesDiv').trigger("reset");
			},
			error: e =>{
				//alert('Erro no post: ' + JSON.stringify(e))
				$('#filesDiv').trigger("reset");
				console.log('Erro no post: ' + JSON.stringify(e))
			},
			cache: false,
			contentType: false,
			processData: false
		});
	});

	$('#alterarFotoPerfil').click(e=>{
		e.preventDefault()
		location.href="http://localhost:3000/atualizarFotoPerfil"
	})
});