$(()=>{

	var fileInputs = 0;
	var item = 1;
	var tipo = "opiniao"

	$('input:file').bind('change', function() {
		if (this.files[0].size > 200*1024*1024) {
			alert("Tamanho do ficheiro excedeu o limite de 200MB");
			$('#myForm').trigger("reset");
		}
	})

	$("#formDiv").on("click", "#adicionarLinha", () => {

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

		$('#filesDiv').find('input:text').val('');
		$('#filesDiv').find('input:file').val('');
		$('#filesDiv').css('visibility', 'hidden')
		$('#AdicaoFicheiros').css('visibility', 'visible')
	})

	$("#checkboxSim").click(e =>{

		$('#checkboxNao').prop('checked', false)
		$('#checkboxSim').prop('checked', true)
	})

	$("#checkboxNao").click(e =>{

		$('#checkboxSim').prop('checked', false)
		$('#checkboxNao').prop('checked', true)
	})

    $("#more_files").click(e => {
		e.preventDefault()

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
		$('#formDiv').empty()
	})

	$("#listabtn").click(e=>{
		tipo = "lista"
		//$('#formDiv').load('http://localhost:3000/pubs/listaPub')
	})

	$("#eventobtn").click(e=>{
		tipo = "evento"
		//$('#formDiv').load('http://localhost:3000/pubs/eventoPub')
	})

	$("#livrebtn").click(e=>{
		tipo = "livre"
		//$('#formDiv').load('http://localhost:3000/pubs/livrePub')
	})

	$('#formPub').submit(function(e){
		e.preventDefault();
		alert('Entrei')
					
		var formData = new FormData();
		var aux=1;

		$.each($("input[type=file]"), function(i, obj) {
			$.each(obj.files,function(j, file){
				formData.append('file'+aux, file);
				aux++;
			})
		});		
		formData.append('titulo', $('#filesTitulo').val());
		alert('Cheguei ao 1')

		formData.append('username', $('#username').val());

		if(tipo == "opiniao")
			formData.append('opiniao', $('#opiniao').val());


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
		alert('Cheguei ao 2')

		if(document.getElementById('checkboxSim').checked)
			formData.append('publico', true);
		else
			formData.append('publico', false);
		alert('Cheguei ao 3')

		$.ajax({
			url:'/api/pubs/'+tipo,
			type:"POST",
			contentType: "application/json",
			data:formData,
			success: data =>{
				alert('Publicação efetuada com sucesso');
				$('#formPub').trigger("reset");
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