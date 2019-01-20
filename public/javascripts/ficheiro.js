$(()=>{

	var fileInputs = 0;

	$('#files').bind('change', function() {
		if (this.files[0].size > 200*1024*1024) {
			alert("Tamanho do ficheiro excedeu o limite de 200MB");
			$('#myForm').trigger("reset");
		}
	})

	$("#more_files").click(e => {

		fileInputs = fileInputs + 1
 
		var input = $("<input type='file' class='w3-input w3-border w3-light-grey' name='file" + fileInputs + "' multiple/>");
		$("#listaFiles").append(input);
	})

	$("#fid").click(e=>{
		var fid = $("#fileID").val()
		location.href = "http://localhost:3000/pubs?id=" + fid
	})

	$("#fdata").click(e=>{
		var fData = $("#fileData").val()
		location.href = "http://localhost:3000/pubs?data=" + fData
	})

	$("#uid").click(e=>{
		var uid = $("#userID").val()
		location.href = "http://localhost:3000/users/" + uid
	})

	$("#eid").click(e=>{
		var eid = $("#userEmail").val()
		location.href = "http://localhost:3000/users/email/" + eid
	})

	$('#myForm').submit(function(e){
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
        formData.append('fTitulo', $('#filesTitulo').val());
        formData.append('username', $('#filesUsername').val());
		
		$.ajax({
			url:'/api/pubs/ficheiros',
			type:"POST",
			contentType: "application/json",
			data:formData,
			success: data =>{
				var titulo = $('#filesTitulo').val();

        		for(var numOfInputs = 0; $('#files'+numOfInputs).length; numOfInputs++){
					var files = $('#files'+numOfInputs)[0].files;
					for (var i = 0; i < files.length; i++)
					{
						//alert('Ficheiro enviado:' + files[i].name);

						var nome = files[i].name;
						
						$('#myTable').append('<tr><td><a href=\'/uploaded/'+nome+'\'>'+nome+'</a></td><td>'+titulo+'</td></tr>');
					}			
				}
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