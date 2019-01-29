$(()=>{
    var aux = 0;


	$('#file').bind('change', function() {
		if (this.files[0].size > 200*1024*1024) {
			//alert("Tamanho do ficheiro excedeu o limite de 200MB");
			$('#myForm').trigger("reset");
		}
	})

	$('#myForm').submit(function(e){
		e.preventDefault();
					
		var formData = new FormData();
        //formData.append( 'action','uploadFiles');
        	
        formData.append('titulo', $('#titulo').val());
        formData.append('texto', $('#texto').val());
        formData.append('autor', $('#autor').val());
        formData.append('username', $('#username').val());

		$.each($("input[type=file]"), function(i, obj) {
			$.each(obj.files,function(j, file){
				formData.append('ficheiro', file);
				aux++;
            })
        })
        formData.append('ficheiro', $('#ficheiro').val());
		
		$.ajax({
			url:'/pubs/narracao',
			type:"POST",
			contentType: "application/json",
			data:formData,
			success: data =>{

        		// for(var numOfInputs = 0; $('#files'+numOfInputs).length; numOfInputs++){
				// 	var files = $('#files'+numOfInputs)[0].files;
				// 	for (var i = 0; i < files.length; i++)
				// 	{
				// 		////alert('Ficheiro enviado:' + files[i].name);

				// 		var nome = files[i].name;
						
				// 		$('#myTable').append('<tr><td><a href=\'/uploaded/'+nome+'\'>'+nome+'</a></td><td>'+titulo+'</td></tr>');
				// 	}			
				// }
				//alert('Narracao enviada');
				$('#myForm').trigger("reset");
			},
			error: e =>{
				//alert('Erro no post: ' + JSON.stringify(e))
				//$('#myForm').trigger("reset");
				console.log('Erro no post: ' + JSON.stringify(e))
			},
			cache: false,
			contentType: false,
			processData: false
		});
	});
})