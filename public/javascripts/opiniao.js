$(()=>{

	var fileInputs = 0;

	$('input:file').bind('change', function() {
		if (this.files[0].size > 200*1024*1024) {
			//alert("Tamanho do ficheiro excedeu o limite de 200MB");
			$('#myForm').trigger("reset");
		}
	})

	$("#addFiles").click(e => {

		fileInputs = fileInputs + 1
 
		var input = $("<input type='file' class='w3-input w3-border w3-light-grey' name='file" + fileInputs + "' multiple/>");
		$("#listaFiles").append(input);
	})


	$('#formOpiniao').submit(function(e){
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
        formData.append('opiniao', $('#opiniao').val());
        formData.append('username', $('#username').val());
		
		$.ajax({
			url:'/pubs/opiniao',
			type:"POST",
			contentType: "application/json",
			data:formData,
			success: data =>{

				//alert('Ficheiros enviados');
				$('#myForm').trigger("reset");
			},
			error: e =>{
				//alert('Erro no post: ' + e)
				$('#myForm').trigger("reset");
				console.log('Erro no post: ' + JSON.stringify(e))
			},
			cache: false,
			contentType: false,
			processData: false
		});
	});
});